
import React, { useState, useEffect } from 'react';
import { BotConfig } from './types';
import SetupMode from './components/SetupMode';
import ChatMode from './components/ChatMode';

// Mock window.storage API using localStorage
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    get: async (key) => {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },
    set: async (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
}


const App: React.FC = () => {
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [mode, setMode] = useState<'setup' | 'chat'>('setup');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const storedConfig = await window.storage.get('botConfig');
        if (storedConfig) {
          setBotConfig(storedConfig);
          setMode('chat');
        }
      } catch (error) {
        console.error("Failed to load bot configuration:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleCreateBot = async (config: BotConfig) => {
    try {
      await window.storage.set('botConfig', config);
      setBotConfig(config);
      setMode('chat');
    } catch (error) {
      console.error("Failed to save bot configuration:", error);
    }
  };

  const handleEditBot = () => {
    setMode('setup');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-900 to-blue-900">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-blue-900">
      {mode === 'setup' || !botConfig ? (
        <SetupMode onSave={handleCreateBot} initialConfig={botConfig} />
      ) : (
        <ChatMode botConfig={botConfig} onEdit={handleEditBot} />
      )}
    </div>
  );
};

export default App;
