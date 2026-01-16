
import React from 'react';
import { AppMode } from '../types';
import { UI_TEXT } from '../constants';

interface NavbarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentMode, setMode }) => {
  const tabs = [
    { id: AppMode.HOME, label: UI_TEXT.ta.homeTab, icon: '🏠' },
    { id: AppMode.CHAT, label: UI_TEXT.ta.chatTab, icon: '💬' },
    { id: AppMode.VOICE, label: UI_TEXT.ta.voiceTab, icon: '🎙️' },
    { id: AppMode.IMAGE, label: UI_TEXT.ta.imageTab, icon: '🎨' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-red-100 shadow-lg px-4 py-2 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="hidden md:flex items-center gap-2 mr-auto">
        <span className="text-2xl font-bold text-red-700">தமீழி AI</span>
      </div>
      <div className="flex w-full md:w-auto justify-around md:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentMode === tab.id ? 'text-red-700 scale-110' : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
