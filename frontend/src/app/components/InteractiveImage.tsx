'use client'
import React, { useState } from 'react';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import Recording from './Recording';


interface InteractiveImageProps {
    recording: boolean;
    setRecording: React.Dispatch<React.SetStateAction<boolean>>;
    hasBack: boolean;
    hasNext: boolean;
    isNextRecord: boolean;
    subtitle: string;
    imgSrc: string | StaticImageData;
    imgAlt: string;
    onNext: () => void;
    onBack: () => void;
    onRecord: () => void;
}

const InteractiveImage = ({ recording, setRecording, hasBack, hasNext, isNextRecord, subtitle, imgSrc, imgAlt, onNext, onBack, onRecord }: InteractiveImageProps) => {
    return (
        <div className="relative w-full text-center">
            {recording ? (<Recording onRecordingComplete={onRecord} width={960} height={540}/>) : (<Image src={imgSrc} alt={imgAlt} width={960}/>)}
            {!recording && <div className="rounded absolute m-4 w-full max-w-xl mx-auto bottom-0 bg-black bg-opacity-50 text-white p-4 text-center left-1/2 transform -translate-x-1/2 z-10">
                {subtitle}
            </div>}
            { !recording &&
                <div className='absolute bottom-0 w-full flex justify-between'>
                    {hasBack ? (<button className="m-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={onBack}>Back</button>) : (<div className="m-2 px-4 py-2" />)}
                    {(<button className="m-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={onNext}>{isNextRecord ? 'Respond (30s)' : (hasNext ? 'Next': 'Done')}</button>)}
                </div>}
        </div>
    );
};
export default InteractiveImage;

