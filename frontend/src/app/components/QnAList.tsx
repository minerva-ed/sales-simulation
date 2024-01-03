interface QnAListProps {
    QnA: [{"question": string, "answer": string}]
}

const QnAList: React.FC<QnAListProps> = ({ QnA }) => (
    <div className="p-4">
        <h2 className="text-lg font-bold mb-2">Q & A</h2>
        <ul className="list-disc pl-5">
            {QnA.map((item, index) => (
                <li key={index} className="mb-2">
                    <strong>Q:</strong> {item.question}
                    <br />
                    <strong>A:</strong> {item.answer}
                </li>
            ))}
        </ul>
        <button className="my-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Practice Q&A (Record)
        </button>
    </div>
);

export default QnAList;