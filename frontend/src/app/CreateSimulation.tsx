'use client'

import { useRouter } from 'next/navigation'

import { useState, FormEvent } from 'react';
import FileUpload from './components/FileUpload';
import SalesStage from './components/SalesStage';
import CustomerProfiles from './components/CustomerProfiles';
import ActionButton from './components/ActionButton';

// Define the types for your customer profiles
interface CustomerProfile {
    companyName: string;
    description: string;
    // Add other customer profile attributes here
}

const url = "http://127.0.0.1:8000"

const CreateSimulation: React.FC = () => {
    const router = useRouter();

    // State hooks with TypeScript generics for type definitions
    const [salesDocument, setSalesDocument] = useState<File | undefined>();
    const [salesStage, setSalesStage] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>([]);

    // Event handlers are typed with `FormEvent` for form submissions
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Implement the submission logic here
        // Make sure to handle the case where salesDocument is null
        if (salesDocument) {
            const formData = new FormData();
            formData.append('file', salesDocument);
            formData.append('customers', JSON.stringify(customerProfiles));
            // Add other form data as needed

            // Submit the form data to your backend
            const response = await fetch(url + '/upload/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            console.log(data['task_id']);
            router.push(`/results/${data['task_id']}`);


            if (response.ok) {
                console.log('Simulation created successfully');
                // Handle success
            } else {
                console.error('Failed to create simulation');
                // Handle error
            }
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSalesDocument(file);
            setFileName(file.name);
        }
    };

    const onGenerateProfiles = async () => {
        try {
            const formData = new FormData();
            if (typeof salesDocument === 'undefined') return;

            formData.append('product_file', salesDocument);
            formData.append('sales_profile', salesStage);
            // Add other form data as needed

            // Submit the form data to your backend
            const response = await fetch(url + '/customer-profiles/', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            // Assuming the response is an array of strings for customer profiles
            const apiProfiles = await response.json();
            const newCustomerProfiles: CustomerProfile[] = apiProfiles.map((profile: any) => ({
                companyName: profile.company_name,
                description: profile.reasoning,
                // Add other transformations here as needed
            }));
            setCustomerProfiles(newCustomerProfiles);
        } catch (error) {
            console.error('Failed to fetch customer profiles:', error);
            throw error;
        }
    }

    const handleDeleteProfile = (index: number) => {
        setCustomerProfiles(prevProfiles => prevProfiles.filter((_, i) => i !== index));
    };

    // Other event handlers and logic...

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <FileUpload onFileChange={handleFileChange}
                fileName={fileName}/>
                <SalesStage
                    salesStage={salesStage}
                    setSalesStage={setSalesStage}
                    onGenerateProfiles={onGenerateProfiles}
                />
                <CustomerProfiles
                    customerProfiles={customerProfiles}
                    onDelete={handleDeleteProfile}
                />
                <div className="flex space-x-4">
                    <ActionButton onClick={handleSubmit}>Run Simulation (&lt; 2 mins)</ActionButton>
                    <ActionButton onClick={() => {
                        // Logic to save draft
                    }} color="gray">Save Draft</ActionButton>
                </div>
            </form>
        </div>
    );
};

export default CreateSimulation;
