
import React, { useState } from 'react';
import { UI_TEXT } from '../constants';
import { generateTamilImage } from '../services/geminiService';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const result = await generateTamilImage(prompt);
      setImageUrl(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 md:p-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">தமிழ் சித்திரம்</h2>
        <p className="text-gray-500">{UI_TEXT.ta.imageInstruction}</p>
      </div>

      <div className="flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="உதாரணம்: பனை மரங்கள் நிறைந்த ஒரு அழகிய கடற்கரை..."
          className="w-full p-4 rounded-2xl border-2 border-red-50 focus:border-red-300 focus:outline-none h-32 resize-none shadow-sm"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-red-700 transition-all disabled:opacity-50"
        >
          {isGenerating ? 'சித்திரம் உருவாகிறது...' : UI_TEXT.ta.generate}
        </button>
      </div>

      <div className="flex-1 min-h-[300px] flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Generated result" className="w-full h-full object-cover" />
        ) : isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-medium">தமீழி வரைந்து கொண்டிருக்கிறார்...</p>
          </div>
        ) : (
          <div className="text-gray-300 text-center p-8">
            <span className="text-6xl block mb-2">🖼️</span>
            உங்களின் கற்பனை இங்கே சித்திரமாகும்
          </div>
        )}
      </div>

      {imageUrl && (
        <a 
          href={imageUrl} 
          download="thamizhi-image.png"
          className="text-center text-red-600 font-semibold hover:underline"
        >
          சித்திரத்தை பதிவிறக்கம் செய்ய
        </a>
      )}
    </div>
  );
};

export default ImageGenerator;
