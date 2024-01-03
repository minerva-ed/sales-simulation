const Loading = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white text-xl">Loading (takes up to 1 minute)...</p>
        </div>
    );
};
export default Loading;
