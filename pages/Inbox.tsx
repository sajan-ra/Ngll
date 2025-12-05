import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getMessages, getUserSettings } from '../services/storageService';
import { Message, UserSettings } from '../types';
import { Link } from 'react-router-dom';

const Inbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user] = useState<UserSettings>(getUserSettings());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Refresh messages on load
    setMessages(getMessages());
    // In a real app we'd use a websocket or polling
    const interval = setInterval(() => {
        setMessages(getMessages());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const copyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/send`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <Layout>
      <div className="space-y-8 pb-20">
        
        {/* Header Section */}
        <div className="text-center space-y-4 pt-4">
           <h1 className="text-4xl font-extrabold tracking-tight">Inbox</h1>
           <p className="text-white/60">
             You have <span className="text-pink-400 font-bold">{unreadCount}</span> new messages
           </p>
           
           <button 
             onClick={copyLink}
             className="mx-auto flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md"
           >
             <span className="text-xl">🔗</span>
             <span className="font-medium">{copied ? 'Copied!' : 'Copy your link'}</span>
           </button>
        </div>

        {/* Messages Grid */}
        <div className="grid gap-4">
          {messages.length === 0 ? (
             <div className="text-center py-20 opacity-50">
               <div className="text-6xl mb-4">📭</div>
               <p>No messages yet.</p>
               <p className="text-sm">Share your link to get started!</p>
             </div>
          ) : (
            messages.map((msg) => (
              <Link 
                to={`/reply/${msg.id}`} 
                key={msg.id}
                className="group relative block transition-transform hover:scale-[1.02] active:scale-95"
              >
                 {!msg.isRead && (
                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black z-10 shadow-lg">
                     <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                   </div>
                 )}
                 <div className={`p-6 rounded-2xl bg-gradient-to-br ${msg.theme || 'from-gray-800 to-gray-900'} shadow-xl border border-white/10 relative overflow-hidden`}>
                    {/* Glossy Effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 pointer-events-none" />
                    
                    <div className="relative z-10 text-center space-y-3">
                       <span className="text-xs font-bold uppercase tracking-widest opacity-60">Anonymous</span>
                       <h3 className="text-xl font-bold leading-tight drop-shadow-md break-words">
                         {msg.text}
                       </h3>
                    </div>
                 </div>
                 <div className="mt-2 text-center text-xs text-white/30 font-medium">
                   Tap to reply
                 </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;