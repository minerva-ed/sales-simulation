'use client';
import React, { useState } from 'react';
import Loading from "./Loading";

interface SalesStageProps {
    salesStage: string;
    setSalesStage: React.Dispatch<React.SetStateAction<string>>;
    onGenerateProfiles: () => void;
    isDisabled: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
}

const SalesStage: React.FC<SalesStageProps> = ({ salesStage, setSalesStage, onGenerateProfiles, isDisabled, setIsLoading, isLoading}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Describe your current customers, and what kind of customers you are looking for.</label>
            <textarea
                value={salesStage}
                onChange={(e) => setSalesStage(e.target.value)}
                placeholder="Describe your sales stage..."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
            />
            <button
                type="button"
                onClick={() => { setIsLoading(true); onGenerateProfiles(); }}
                disabled={isDisabled}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
            >
                Generate Customer Profiles
            </button>
            {isLoading && <Loading isLoading={isLoading} />}
        </div>
    );
};

export default SalesStage;
