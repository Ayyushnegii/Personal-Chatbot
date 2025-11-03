
import React, { useState } from 'react';
import { BotConfig } from '../types';

interface SetupModeProps {
  onSave: (config: BotConfig) => void;
  initialConfig: BotConfig | null;
}

const SetupMode: React.FC<SetupModeProps> = ({ onSave, initialConfig }) => {
  const [name, setName] = useState(initialConfig?.name || '');
  const [details, setDetails] = useState(initialConfig?.details || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !details.trim()) {
      setError('Both name and details are required.');
      return;
    }
    setError('');
    onSave({ name, details });
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-white/10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Your Personal AI Bot</h1>
          <p className="text-blue-300 mb-6">Fill in your details below to bring your digital twin to life.</p>
        </div>
        
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Jane Doe"
              className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-blue-200 mb-2">
              About You
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Paste all information about yourself: work, hobbies, background, interests, contact info, etc."
              rows={12}
              className="w-full bg-gray-900/70 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            Create My Bot
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupMode;
