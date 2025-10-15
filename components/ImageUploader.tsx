
import React from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onAnalyze: () => void;
  imageUrl: string | null;
  isAnalyzing: boolean;
  clearImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  onAnalyze,
  imageUrl,
  isAnalyzing,
  clearImage,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageSelect(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Upload Leaf Image</h2>
      
      {!imageUrl ? (
        <div
          onClick={triggerFileSelect}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative group">
          <img src={imageUrl} alt="Uploaded leaf" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md" />
           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
              <button
                onClick={clearImage}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg"
              >
                Remove
              </button>
            </div>
        </div>
      )}

      {imageUrl && (
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Leaf'
          )}
        </button>
      )}
    </div>
  );
};

export default ImageUploader;
