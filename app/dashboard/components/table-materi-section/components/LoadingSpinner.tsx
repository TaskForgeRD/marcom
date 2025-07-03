const LoadingSpinner = () => {
  return (
    <div className="p-4 flex flex-col items-center">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
      <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
    </div>
  );
};

export default LoadingSpinner;
