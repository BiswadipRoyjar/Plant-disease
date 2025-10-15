
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

const TreatmentCard: React.FC<{ title: string; content: string; icon: string }> = ({ title, content, icon }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h3 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
      <span className="text-2xl mr-3">{icon}</span>
      {title}
    </h3>
    <p className="text-gray-600 whitespace-pre-wrap">{content}</p>
  </div>
);

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  const { isHealthy, diseaseName, confidenceScore, description, organicTreatment, chemicalTreatment } = result;

  const confidenceColor = confidenceScore > 0.8 ? 'text-green-600' : confidenceScore > 0.6 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-6 animate-fade-in">
      <div className="text-center">
        {isHealthy ? (
          <div className="inline-flex items-center bg-green-100 text-green-800 text-2xl font-bold px-6 py-2 rounded-full">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Healthy
          </div>
        ) : (
          <div className="inline-flex items-center bg-red-100 text-red-800 text-2xl font-bold px-6 py-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            Diseased
          </div>
        )}
      </div>

      {!isHealthy && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">{diseaseName}</h2>
          <p className={`text-lg font-medium ${confidenceColor}`}>Confidence: {(confidenceScore * 100).toFixed(1)}%</p>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-r-lg" role="alert">
        <p className="font-bold">Description</p>
        <p>{description}</p>
      </div>

      <div className="space-y-4">
        <TreatmentCard title="Organic Treatment" content={organicTreatment} icon="🌿" />
        <TreatmentCard title="Chemical Treatment" content={chemicalTreatment} icon="🧪" />
      </div>
    </div>
  );
};

export default AnalysisResultDisplay;
