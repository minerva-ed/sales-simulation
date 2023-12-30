'use client';
import React, { useEffect, useState, useRef } from 'react';
// Props
// onRecordingComplete = { onRecord } width = { 960} height = { 540}
// isRecording = { isRecording } setIsRecording = { setIsRecording }
interface RecordingProps {
    onRecordingComplete: (() => void)
    width: number;
    height: number;
}
// A video recording component, which allows users to record their own video with a timelimit of 30s, and an ability to re-record after the time limit is reached, where they can review thier recording and decide to keep or re-record.
const Recording: React.FC<RecordingProps> = ({onRecordingComplete, width, height }) => {
    const [recording, setRecording] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const recordedVideoRef = useRef<HTMLVideoElement>(null);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [counter, setCounter] = useState(30);

    // on load, start displaying video
    useEffect(() => {
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio : true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        })();
    }, []);

    const startRecording = async () => {
        setRecording(true);
        setCounter(30); // Reset counter to 30 seconds
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorderRef.current.ondataavailable = event => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const completeBlob = new Blob(chunks, { type: 'video/webm' });
            const videoURL = URL.createObjectURL(completeBlob);
            setVideoURL(videoURL);
            stream.getTracks().forEach(track => track.stop());

        };

        mediaRecorderRef.current.start();

        const intervalId = setInterval(() => {
            setCounter(prevCounter => {
                if (prevCounter === 1) {
                    clearInterval(intervalId);
                    stopRecording();
                }
                return prevCounter - 1;
            });
        }, 1000);

        // Ensure the interval is cleared if the component unmounts
        return () => clearInterval(intervalId);
    };

    const stopRecording = () => {
        console.log(mediaRecorderRef.current, mediaRecorderRef.current.state)
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const recordAgain = () => {
        setVideoURL(null);
        startRecording();
    };

    const doneRecording = () => {
        // if (videoURL) {
        //     fetch(videoURL)
        //         .then(response => response.blob())
        //         .then(blob => extractAudioFromVideo(blob))
        //         .then(audioStream => handleAudioStream(audioStream))
        //         .catch(console.error);
        // }
        onRecordingComplete()
    };


    const extractAudioFromVideo = async (videoBlob) => {
        return new Promise((resolve, reject) => {
            // Create a video element
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(videoBlob);

            // Extract audio when video metadata is loaded
            videoElement.onloadedmetadata = () => {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaElementSource(videoElement);
                const destination = audioContext.createMediaStreamDestination();
                source.connect(destination);

                videoElement.play().then(() => {
                    videoElement.pause();
                    resolve(destination.stream);
                }).catch(reject);
            };
        });
    };

    const handleAudioStream = (audioStream) => {
        const audioRecorder = new MediaRecorder(audioStream);
        const audioChunks = [];

        audioRecorder.ondataavailable = event => audioChunks.push(event.data);
        audioRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await sendAudioToAPI(audioBlob);
        };

        audioRecorder.start();
        setTimeout(() => audioRecorder.stop(), 1000); // Stop recording after a short delay
    };

    const sendAudioToAPI = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('response-id', ''); // TODO: Implement association with recording position of the simulation

        try {
            const response = await fetch('/upload_response', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                console.log('Audio sent successfully');
                // Handle successful response
            } else {
                console.error('Error sending audio');
                // Handle error
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };





    return (
        <div className="flex flex-col items-center justify-center p-4">
            {recording && <div>Time Remaining: {counter}s</div>}
            {recording || !videoURL ? (
                <video ref={videoRef} autoPlay muted className="w-full h-full mb-4"></video>
            ) : null}
            
            {!recording && videoURL && (
                <video ref={recordedVideoRef} src={videoURL} controls className="w-full h-full mb-4" autoPlay></video>
            )}
            <div className="flex gap-4">
                {!recording && !videoURL && (
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={startRecording}>Record</button>
                )}
                {recording && (
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={stopRecording}>Stop</button>
                )}
                {!recording && videoURL && (
                    <>
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={recordAgain}>Record Again</button>
                        <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={doneRecording}>Done</button>
                    </>
                )}
            </div>
        </div>
    );
;
};
export default Recording;
