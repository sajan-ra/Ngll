import React, { useState } from 'react';
import Layout from '../components/Layout';
import { generateRandomQuestion } from '../services/geminiService';
import { saveMessage, getUserSettings } from '../services/storageService';
import { UserSettings } from '../types';

const Send: React.FC = () => {
  const [text, setText] = useState('');
  const [loadingDice, setLoadingDice] = useState(false);
  const [sent, setSent] = useState(false);
  const user: UserSettings = getUserSettings();

  const handleDiceRoll = async () => {
    setLoadingDice(true);
    const question = await generateRandomQuestion();
    setText(question);
    setLoadingDice(false);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    saveMessage(text);
    setSent(true);
    setText('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <Layout showNav={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        
        {/* Profile Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px] shadow-2xl">
           <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
             <img src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff`} alt="User" className="w-full h-full object-cover" />
           </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Send me anonymous messages!</h1>
          <p className="text-white/60">I won't know it's you... ngl 😉</p>
        </div>

        <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-full bg-black rounded-xl p-6 glass-panel">
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Send me a question..."
                className="w-full bg-transparent text-lg font-medium outline-none placeholder-white/30 resize-none h-32"
              />
              <button 
                onClick={handleDiceRoll}
                disabled={loadingDice}
                className="absolute bottom-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Get a random question"
              >
                <span className={`text-2xl block ${loadingDice ? 'animate-spin' : ''}`}>🎲</span>
              </button>
            </div>
        </div>

        <button 
          onClick={handleSend}
          disabled={!text.trim() || sent}
          className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          {sent ? 'Sent! 🚀' : 'Send Message'}
        </button>

        <p className="text-xs text-white/30 mt-8">
          This site is a demo. Messages are stored locally on your device for testing.
        </p>
      </div>
    </Layout>
  );
};

export default Send;