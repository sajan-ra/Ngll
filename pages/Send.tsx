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
      <div className="flex flex-col items-center justify-center min-h-[85vh] gap-8">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 animate-float">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[4px] shadow-[0_0_30px_rgba(236,72,153,0.4)]">
             <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border-4 border-black">
               <img 
                 src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff&size=200`} 
                 alt="User" 
                 className="w-full h-full object-cover" 
               />
             </div>
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-white">Send me anonymous messages!</h1>
            <p className="text-pink-200/70 font-medium">I won't know it's you... ngl 😉</p>
          </div>
        </div>

        {/* Input Card */}
        <div className="w-full relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative w-full bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-transparent text-xl font-medium outline-none placeholder-white/20 resize-none h-36 text-white leading-relaxed"
                maxLength={300}
              />
              
              <div className="absolute bottom-4 right-4 flex gap-3">
                 <button 
                  onClick={handleDiceRoll}
                  disabled={loadingDice}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-95 disabled:opacity-50"
                  title="Get a random question"
                >
                  <span className={`text-xl block ${loadingDice ? 'animate-spin' : ''}`}>🎲</span>
                </button>
              </div>
              
              <div className="absolute bottom-4 left-4 text-xs text-white/20 font-mono">
                {text.length}/300
              </div>
            </div>
        </div>

        {/* Send Button */}
        <button 
          onClick={handleSend}
          disabled={!text.trim() || sent}
          className={`w-full py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-300 ${
            sent 
              ? 'bg-green-500 scale-100' 
              : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(219,39,119,0.5)]'
          } disabled:opacity-50 disabled:scale-100 disabled:shadow-none`}
        >
          {sent ? 'Sent! 🚀' : 'Send Message'}
        </button>

        <p className="text-[10px] text-white/20 text-center max-w-xs mx-auto">
          🔒 100% Anonymous. Messages are private and secure. <br/>
          (Demo: Messages stored locally)
        </p>
      </div>
    </Layout>
  );
};

export default Send;