interface ActionButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    color?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, onClick, color = 'blue' }) => {
    const buttonClass = `px-4 py-2 bg-${color}-500 text-white rounded-md hover:bg-${color}-600`;
    return (
        <button type="button" onClick={onClick} className={buttonClass}>
            {children}
        </button>
    );
};

export default ActionButton;
