
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};


const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isHealthy: { type: Type.BOOLEAN, description: 'Whether the leaf is healthy.' },
    diseaseName: { type: Type.STRING, description: 'Name of the disease, or "N/A" if healthy.' },
    confidenceScore: { type: Type.NUMBER, description: 'Confidence in the diagnosis (0.0 to 1.0).' },
    description: { type: Type.STRING, description: 'A brief description of the disease or general plant health.' },
    organicTreatment: { type: Type.STRING, description: 'Recommended organic treatment methods.' },
    chemicalTreatment: { type: Type.STRING, description: 'Recommended chemical treatment methods.' },
  },
  required: ['isHealthy', 'diseaseName', 'confidenceScore', 'description', 'organicTreatment', 'chemicalTreatment'],
};

export const analyzeCropDisease = async (imageFile: File): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = await fileToGenerativePart(imageFile);

  const prompt = `Analyze the attached image of a crop leaf. Based on your analysis, provide the following information in the requested JSON format.

  - If the leaf shows signs of disease, identify it, provide a confidence score, a description of the disease, and recommend both organic and chemical treatments.
  - If the leaf appears healthy, set isHealthy to true, diseaseName to "N/A", provide a high confidence score, and write a brief description about maintaining plant health. Provide positive messages for the treatment fields.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const text = response.text.trim();
  try {
    // Gemini may sometimes wrap the JSON in ```json ... ```
    const cleanedText = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const parsedJson = JSON.parse(cleanedText);
    return parsedJson as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
};
