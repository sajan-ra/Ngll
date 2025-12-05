import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getMessages, deleteMessage } from '../services/storageService';
import { Message } from '../types';
import { Link } from 'react-router-dom';

const Inbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Refresh messages on load
    setMessages(getMessages());
    // Polling for new messages
    const interval = setInterval(() => {
        // Only update if count changed to avoid UI jitter, or simple re-fetch
        const current = getMessages();
        if (current.length !== messages.length) {
            setMessages(current);
        }
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

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
        <div className="text-center space-y-6 pt-6">
           <div>
             <h1 className="text-4xl font-extrabold tracking-tight mb-2">Inbox</h1>
             <p className="text-white/60">
               <span className={`font-bold ${unreadCount > 0 ? 'text-pink-400' : 'text-white/60'}`}>
                 {unreadCount}
               </span> new messages waiting for you
             </p>
           </div>
           
           <button 
             onClick={copyLink}
             className="relative mx-auto group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] transition-all transform hover:scale-105 active:scale-95"
           >
             <span className="text-2xl animate-pulse">🔗</span>
             <span className="font-bold text-lg">{copied ? 'Link Copied!' : 'Copy Your Link'}</span>
             
             {/* Shine effect */}
             <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-white/20 skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out" />
             </div>
           </button>
        </div>

        {/* Messages Grid */}
        <div className="grid gap-4">
          {messages.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
               <div className="text-8xl animate-bounce">📭</div>
               <div className="text-center">
                 <p className="text-xl font-bold">No messages yet</p>
                 <p className="text-sm text-white/50 mt-1">Share your link on your Story to get started!</p>
               </div>
             </div>
          ) : (
            messages.map((msg) => (
              <Link 
                to={`/reply/${msg.id}`} 
                key={msg.id}
                className="group relative block transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                 {/* Unread Indicator */}
                 {!msg.isRead && (
                   <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500"></span>
                    </span>
                 )}

                 {/* Card Content */}
                 <div className={`p-6 pb-8 rounded-2xl bg-gradient-to-br ${msg.theme || 'from-gray-800 to-gray-900'} shadow-lg border border-white/10 relative overflow-hidden`}>
                    
                    {/* Glossy Effect */}
                    <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    {/* Delete Button (Visible on Hover/Touch) */}
                    <button 
                      onClick={(e) => handleDelete(e, msg.id)}
                      className="absolute top-2 right-2 p-2 text-white/30 hover:text-white hover:bg-black/20 rounded-full transition-colors z-20 opacity-100 sm:opacity-0 group-hover:opacity-100"
                      title="Delete message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="relative z-10 text-center space-y-3 pt-2">
                       <span className="inline-block px-3 py-1 rounded-full bg-black/20 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm">
                         Anonymous
                       </span>
                       <h3 className="text-2xl font-bold leading-tight drop-shadow-md break-words font-outfit">
                         {msg.text}
                       </h3>
                    </div>

                    {/* Replied Status */}
                    {msg.reply && (
                      <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md py-1 flex items-center justify-center gap-1">
                        <span className="text-green-400 text-xs">✓</span>
                        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">Replied</span>
                      </div>
                    )}
                 </div>
                 
                 {/* Tap hint */}
                 {!msg.reply && (
                    <div className="absolute bottom-3 left-0 w-full text-center opacity-0 group-hover:opacity-60 transition-opacity text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                      Tap to reply
                    </div>
                 )}
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;