interface SummaryProps {
    summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => (
    <div className="p-4">
        <h2 className="text-lg font-bold mb-2">Summary</h2>
        <p className="whitespace-pre-wrap">{summary}</p>
    </div>
);
export default Summary;