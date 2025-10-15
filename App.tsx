
import React, { useState } from 'react';
import LeafIcon from './components/icons/LeafIcon';
import ImageUploader from './components/ImageUploader';
import AnalysisResultDisplay from './components/AnalysisResultDisplay';
import { analyzeCropDisease } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
  };

  const handleClearImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageFile(null);
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
  };
  
  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Please select an image first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeCropDisease(imageFile);
      setAnalysisResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <LeafIcon className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            AI Crop Disease Detection
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="lg:sticky top-8">
            <ImageUploader
              onImageSelect={handleImageSelect}
              onAnalyze={handleAnalyze}
              imageUrl={imageUrl}
              isAnalyzing={isAnalyzing}
              clearImage={handleClearImage}
            />
          </div>
          
          <div className="mt-8 lg:mt-0">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {isAnalyzing && !analysisResult && (
                 <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl h-full min-h-[400px]">
                    <svg className="animate-spin h-12 w-12 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg font-semibold text-gray-700">Analyzing your image...</p>
                    <p className="text-gray-500 text-center mt-2">Our AI is hard at work. This may take a moment.</p>
                </div>
            )}

            {analysisResult && <AnalysisResultDisplay result={analysisResult} />}

            {!isAnalyzing && !analysisResult && !imageUrl && (
                 <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl h-full min-h-[400px]">
                     <LeafIcon className="h-16 w-16 text-gray-300 mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-700">Awaiting Image</h3>
                    <p className="text-gray-500 text-center mt-2">Upload an image of a crop leaf to begin analysis.</p>
                </div>
            )}
            
            {!isAnalyzing && !analysisResult && imageUrl && (
                 <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl h-full min-h-[400px]">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                     </svg>
                    <h3 className="text-xl font-semibold text-gray-700">Ready to Analyze</h3>
                    <p className="text-gray-500 text-center mt-2">Click the "Analyze Leaf" button to get your diagnosis.</p>
                </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white mt-12 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} AI Crop Diagnostics. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
