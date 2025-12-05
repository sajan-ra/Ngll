import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getMessages, markAsRead, saveReply } from '../services/storageService';
import { generateWittyReply } from '../services/geminiService';
import { Message } from '../types';

const Reply: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [generating, setGenerating] = useState(false);
  
  // Ref for the card we want to "screenshot" (conceptually)
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const msgs = getMessages();
    const found = msgs.find(m => m.id === id);
    if (found) {
      setMessage(found);
      if (!found.isRead) markAsRead(found.id);
      if (found.reply) setReplyText(found.reply);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleAI = async (tone: 'funny' | 'roast' | 'wholesome') => {
    if (!message) return;
    setGenerating(true);
    const result = await generateWittyReply(message.text, tone);
    setReplyText(result);
    setGenerating(false);
  };

  const handleSave = () => {
    if(id && replyText) {
       saveReply(id, replyText);
       // In a real app, this would trigger a native share or download the image
       alert("Reply saved! In a real app, this would open Instagram Stories with the image below.");
    }
  };

  if (!message) return null;

  return (
    <Layout>
      <div className="flex flex-col items-center gap-6">
        
        {/* Navigation */}
        <div className="w-full flex justify-between items-center px-2">
          <button onClick={() => navigate('/')} className="text-white/50 hover:text-white">← Back</button>
          <span className="text-sm font-bold uppercase tracking-widest opacity-50">Story Mode</span>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* The "Story" Canvas Area */}
        <div 
          className="w-full aspect-[9/16] max-h-[60vh] bg-gray-900 rounded-3xl relative overflow-hidden shadow-2xl border border-white/10 flex items-center justify-center"
          ref={cardRef}
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-50" />
          
          {/* Elements to simulate Story UI */}
          <div className="w-full px-8 flex flex-col items-center gap-6 relative z-10">
            
            {/* The Question Card */}
            <div className="w-full bg-white text-black rounded-3xl p-6 text-center shadow-xl transform rotate-[-2deg]">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Anonymous wrote:</p>
              <h2 className="text-2xl font-bold leading-tight">{message.text}</h2>
            </div>

            {/* The Reply Area */}
            {replyText ? (
               <div className="text-center space-y-2 transform rotate-[2deg] max-w-full break-words">
                 <p className="text-3xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                   {replyText}
                 </p>
                 <div className="inline-block bg-black/30 backdrop-blur-md rounded-full px-4 py-1 text-xs font-medium">
                   sajan.ngl 🔗
                 </div>
               </div>
            ) : (
              <div className="text-white/30 italic text-sm">Type a reply below...</div>
            )}

          </div>
        </div>

        {/* Controls */}
        <div className="w-full space-y-4">
          
          <div className="flex gap-2">
             <input 
               type="text" 
               value={replyText}
               onChange={(e) => setReplyText(e.target.value)}
               placeholder="Type your reply..."
               className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 outline-none focus:border-pink-500 transition-colors"
             />
             <button 
               onClick={handleSave}
               className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-transform"
             >
               ➤
             </button>
          </div>

          <div className="glass-panel rounded-2xl p-4">
             <p className="text-xs text-center text-white/50 mb-3 uppercase tracking-wider font-bold">
               ✨ AI Magic Assist
             </p>
             <div className="grid grid-cols-3 gap-2">
               <button 
                 onClick={() => handleAI('funny')}
                 disabled={generating}
                 className="py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
               >
                 😂 Funny
               </button>
               <button 
                 onClick={() => handleAI('roast')}
                 disabled={generating}
                 className="py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
               >
                 🔥 Roast
               </button>
               <button 
                 onClick={() => handleAI('wholesome')}
                 disabled={generating}
                 className="py-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-lg text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50"
               >
                 💖 Sweet
               </button>
             </div>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Reply;