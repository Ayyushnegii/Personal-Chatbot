import React, { useState, useEffect, useRef } from 'react';
import { BotConfig, Message, Sender } from '../types';
import { getBotResponse } from '../services/geminiService';
import { BotIcon, EditIcon, SendIcon, UserIcon } from './icons';

interface ChatModeProps {
  botConfig: BotConfig;
  onEdit: () => void;
}

const ChatMode: React.FC<ChatModeProps> = ({ botConfig, onEdit }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        text: `Hello! I'm ${botConfig.name}'s personal AI assistant. Feel free to ask me anything about them.`,
        sender: Sender.Bot,
      },
    ]);
  }, [botConfig.name]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: Sender.User,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    // Realistic delay
    await new Promise(res => setTimeout(res, 1000 + Math.random() * 1000));

    const botResponseText = await getBotResponse(updatedMessages, botConfig);

    const botMessage: Message = {
      id: Date.now() + 1,
      text: botResponseText,
      sender: Sender.Bot,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-800/30 backdrop-blur-lg border-x border-white/10">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500 rounded-full">
            <BotIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">{botConfig.name}'s Bot</h1>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 text-blue-300 hover:text-blue-100 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
        >
          <EditIcon className="w-5 h-5" />
          <span className="text-sm font-semibold">Edit Bot</span>
        </button>
      </header>

      {/* Message List */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${
              msg.sender === Sender.User ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === Sender.Bot && (
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                <BotIcon className="w-6 h-6 text-white" />
              </div>
            )}
            <div
              className={`max-w-md p-4 rounded-2xl ${
                msg.sender === Sender.User
                  ? 'bg-blue-600 text-white rounded-br-lg'
                  : 'bg-gray-700 text-gray-200 rounded-bl-lg'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.sender === Sender.User && (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-4 justify-start">
             <div className="w-10 h-10 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center">
                <BotIcon className="w-6 h-6 text-white" />
              </div>
            <div className="bg-gray-700 text-gray-200 p-4 rounded-2xl rounded-bl-lg">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="p-4 border-t border-white/10 bg-gray-900/50 backdrop-blur-sm sticky bottom-0">
        <div className="flex items-center bg-gray-700 rounded-xl p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent px-4 text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isTyping}
            className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SendIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatMode;