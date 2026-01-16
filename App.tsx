
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ChatWindow from './components/ChatWindow';
import VoiceInterface from './components/VoiceInterface';
import ImageGenerator from './components/ImageGenerator';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.HOME:
        return <HomeView setMode={setMode} />;
      case AppMode.CHAT:
        return <ChatWindow />;
      case AppMode.VOICE:
        return <VoiceInterface />;
      case AppMode.IMAGE:
        return <ImageGenerator />;
      default:
        return <HomeView setMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Navbar currentMode={mode} setMode={setMode} />
      <main className="flex-1 pt-0 md:pt-16 pb-16 md:pb-0 h-[calc(100vh-64px)] overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
