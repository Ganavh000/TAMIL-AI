
import React from 'react';
import { AppMode } from '../types';
import { UI_TEXT } from '../constants';

interface HomeViewProps {
  setMode: (mode: AppMode) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setMode }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-stone-50">
      <div className="bg-gradient-to-b from-red-900 to-red-800 text-white p-12 text-center rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
             <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
               </pattern>
             </defs>
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 relative z-10">தமீழி AI</h1>
        <p className="text-xl md:text-2xl opacity-90 font-light relative z-10">தொல்காப்பிய ஆய்வுத் தளம்</p>
      </div>

      <div className="p-8 space-y-10 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button
            onClick={() => setMode(AppMode.CHAT)}
            className="group bg-white p-8 rounded-[2rem] shadow-md border border-stone-200 hover:border-red-300 hover:shadow-xl transition-all text-left transform hover:-translate-y-1"
          >
            <span className="text-5xl block mb-4">📜</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-red-800">இலக்கண ஆய்வு</h3>
            <p className="text-stone-500 leading-relaxed">எழுத்து, சொல், பொருள் அதிகாரங்களின் நுட்பங்களை ஆராயுங்கள்.</p>
          </button>

          <button
            onClick={() => setMode(AppMode.VOICE)}
            className="group bg-white p-8 rounded-[2rem] shadow-md border border-stone-200 hover:border-red-300 hover:shadow-xl transition-all text-left transform hover:-translate-y-1"
          >
            <span className="text-5xl block mb-4">📢</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-red-800">வாய்மொழி ஆய்வு</h3>
            <p className="text-stone-500 leading-relaxed">நூற்பாக்களைக் கூறி அதன் பொருளை நேரடியாகக் கேட்டு அறியுங்கள்.</p>
          </button>

          <button
            onClick={() => setMode(AppMode.IMAGE)}
            className="group bg-white p-8 rounded-[2rem] shadow-md border border-stone-200 hover:border-red-300 hover:shadow-xl transition-all text-left transform hover:-translate-y-1"
          >
            <span className="text-5xl block mb-4">🖼️</span>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-red-800">காட்சிப்படுத்தல்</h3>
            <p className="text-stone-500 leading-relaxed">சங்க கால திணைகளையும் வாழ்வியலையும் சித்திரங்களாகக் காணுங்கள்.</p>
          </button>
        </div>

        <div className="bg-stone-100 p-10 rounded-[3rem] border border-stone-200 relative">
          <div className="absolute -top-4 left-10 bg-red-800 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            ஆய்வு முன்னுரை
          </div>
          <h4 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
            <span>📚</span> தொல்காப்பியச் சிறப்பு
          </h4>
          <div className="grid md:grid-cols-2 gap-8 text-stone-700">
            <div className="space-y-4">
              <p className="italic border-l-4 border-red-300 pl-4 py-2">"எழுத்தெனப் படுப அகர முதல னகர இறுவாய் முப்பஃ தென்ப"</p>
              <p className="text-sm">தமிழ் எழுத்துக்களின் பிறப்பு முதல் வாழ்வியல் நெறிகள் வரை அனைத்தையும் வகுத்துக் தந்த பேராசான் தொல்காப்பியரின் வழியில் இந்த AI இயங்குகிறது.</p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-stone-900">இதில் நீங்கள் செய்யக்கூடியவை:</p>
              <ul className="grid grid-cols-1 gap-2 text-sm">
                <li className="flex items-center gap-2">🔹 நூற்பா விளக்கம் பெறுதல்</li>
                <li className="flex items-center gap-2">🔹 திணை மற்றும் துறை விளக்கம்</li>
                <li className="flex items-center gap-2">🔹 சங்க காலச் சொற்கள் ஆய்வு</li>
                <li className="flex items-center gap-2">🔹 இலக்கணப் பிழை திருத்தம்</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="h-24 md:h-0"></div>
    </div>
  );
};

export default HomeView;
