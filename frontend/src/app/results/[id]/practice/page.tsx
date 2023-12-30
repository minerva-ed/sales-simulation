'use client';

import InteractiveImage from '../../../components/InteractiveImage';
import agentImage from '../../../public/agent-image.png';
import Loading from '../../../components/Loading';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const PracticePage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [subtitles, setSubtitles] = useState(['[Salesforce] Could you elaborate on how the AI-generated customer behaviors are tailored to reflect the specific challenges and scenarios our sales team encounters in our industry?', '[record]', '[HubSpot] Could you elaborate on the specific metrics or KPIs that the software tracks to measure the improvement in sales performance?)', '[record]']);
    const [currentIndex, setCurrentIndex] = useState(0);
    const hasNext = (currentIndex < subtitles.length - 1);
    const hasBack = (currentIndex > 0);
    const isNextRecord = (hasNext && subtitles[currentIndex + 1] === '[record]');
    const [isFinal, setIsFinal] = useState(false);
    // State and business logic for managing components
    const handleRecordingComplete = () => {
        console.log('Recording complete', subtitles, currentIndex);
        setIsRecording(false);
        onNext();
        // Add business logic for handling recording
    }
    const onNext = () => {
        console.log('Next', subtitles, currentIndex);
        if (isNextRecord) {
            setIsRecording(true);
        }
        if (hasNext) {
            setCurrentIndex(currentIndex + 1);
        }else{
            setIsFinal(true);
        }
        
    }

    const onBack = () => {
        // Add business logic for handling back
        if (hasBack) {
            setCurrentIndex(currentIndex - 1);
            if(subtitles[currentIndex - 1] === '[record]') {
                setIsRecording(true);
            }
        }
    }


    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-4xl aspect-w-16 aspect-h-9 bg-white shadow-lg">
            { !isFinal ? (
                <InteractiveImage setRecording={setIsRecording} recording={isRecording} subtitle={subtitles[currentIndex]} imgSrc={agentImage} imgAlt="Simulated Sales Agent" hasBack={hasBack} hasNext={hasNext} isNextRecord={isNextRecord} onNext={onNext} onBack={onBack} onRecord={handleRecordingComplete} />
                ) : (
                    <div className="w-full p-4 text-center max-w-4xl aspect-w-16 aspect-h-9 bg-white shadow-lg">
                        <p className="text-2xl">Thank you for completing the practice!</p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={() => router.push('.')}>View Analysis</button>
                    </div>
                )}
            </div>
            <Loading isLoading={isLoading} />
            </div>
    );
};

export default PracticePage;
