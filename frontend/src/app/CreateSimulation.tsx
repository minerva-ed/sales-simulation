'use client'

import { useRouter } from 'next/navigation'

import { useState, FormEvent, useEffect } from 'react';
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

const API_ENDPOINT = "20.115.40.108"

const url = `http://${API_ENDPOINT}:8000`

const Disclosure: React.FC = () => {
    return (
        <div className="py-4">
            <h2 className="text-xl mb-4 font-bold text-gray-800">Welcome to the Alpha Demo of Minerva!</h2>
            <p className="text-gray-600 text-sm mb-2">
                As part of our commitment to revolutionizing sales training, we are excited to offer you an early glimpse into Minerva - our cutting-edge sales-simulation software. Minerva is designed to automatically find leads, simulate realistic sales conversations, and create tailored training programs for sales representatives.
            </p>
            <h2 className="text-lg mb-3 font-semibold text-gray-800">Here is What You Need to Know:</h2>
            <p className="text-gray-600 text-sm mb-2">
                <strong>Data Privacy:</strong> We value your privacy. All data used in this demo is stored anonymously, but may be publically accessible as we have not setup authentication. Please do not upload any sensitive data.<br/>
                <strong>Data Persistence:</strong> Please note that your data may not be permanently stored and could be lost when we restart our servers.<br />
                <strong>Training Data:</strong> Currently, we do not collect data from training sessions. However, as we evolve, we may start collecting this data to further enhance your experience.<br />
                <strong>Alpha Version:</strong> Remember, this is an alpha version. As exciting as it is, some parts might be a bit rough around the edges. We are working hard to polish every aspect of Minerva, with new features and your feedback during this phase is invaluable.
            </p>
            <h2 className="text-lg mb-3 font-semibold text-gray-800">Your Participation Shapes Minerva:</h2>
            <p className="text-gray-600 text-sm">
                Your experience and feedback are crucial. By using this alpha version, you are not just testing a product - you are helping shape the future of sales training! Please write to us at <a href="mailto:team@minervai.co"/> with your feedback, questions, and suggestions!
            </p>
        </div>
    )
}

const CreateSimulation: React.FC = () => {
    const router = useRouter();

    // State hooks with TypeScript generics for type definitions
    const [salesDocument, setSalesDocument] = useState<File | undefined>();
    const [salesStage, setSalesStage] = useState<string>('');
    const [fileName, setFileName] = useState<string>('');
    const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>([]);
    const [isGBDisabled, setIsGBDisabled,] = useState<boolean>(true)
    const [isCustomerLoading, setIsCustomerLoading] = useState<boolean>(false);
    useEffect(() => {
        if (typeof salesDocument === 'undefined' || salesStage.length < 10) {
            setIsGBDisabled(true)
        } else {
            setIsGBDisabled(false)
        }
    }, [salesDocument, salesStage])
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
            setIsCustomerLoading(false);
        } catch (error) {
            console.error('Failed to fetch customer profiles:', error);
            setIsCustomerLoading(false);
            throw error;
        }
    }

    const handleDeleteProfile = (index: number) => {
        setCustomerProfiles(prevProfiles => prevProfiles.filter((_, i) => i !== index));
    };

    // Other event handlers and logic...

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold py-4">Create a Sales Simulation</h1>
            <p className="text-gray-600 py-2">Upload a sales document and generate customer profiles to run a sales simulation.</p>
            <Disclosure/>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FileUpload onFileChange={handleFileChange}
                fileName={fileName}/>
                <SalesStage
                    salesStage={salesStage}
                    setSalesStage={setSalesStage}
                    onGenerateProfiles={onGenerateProfiles}
                    isDisabled={isGBDisabled}
                    setIsLoading={setIsCustomerLoading}
                    isLoading={isCustomerLoading}
                />
                <CustomerProfiles
                    customerProfiles={customerProfiles}
                    onDelete={handleDeleteProfile}
                    onAdd={() => {}}
                    onEdit={() => {}}
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
