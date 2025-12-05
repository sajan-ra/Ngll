import { Message, UserSettings } from '../types';

const MSG_KEY = 'sajan_ngl_messages';
const USER_KEY = 'sajan_ngl_user';

export const getMessages = (): Message[] => {
  const data = localStorage.getItem(MSG_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveMessage = (text: string) => {
  const messages = getMessages();
  const newMessage: Message = {
    id: crypto.randomUUID(),
    text,
    timestamp: Date.now(),
    isRead: false,
    theme: getRandomTheme()
  };
  localStorage.setItem(MSG_KEY, JSON.stringify([newMessage, ...messages]));
  return newMessage;
};

export const markAsRead = (id: string) => {
  const messages = getMessages().map(msg => 
    msg.id === id ? { ...msg, isRead: true } : msg
  );
  localStorage.setItem(MSG_KEY, JSON.stringify(messages));
};

export const saveReply = (id: string, reply: string) => {
  const messages = getMessages().map(msg => 
    msg.id === id ? { ...msg, reply } : msg
  );
  localStorage.setItem(MSG_KEY, JSON.stringify(messages));
};

export const deleteMessage = (id: string) => {
  const messages = getMessages().filter(msg => msg.id !== id);
  localStorage.setItem(MSG_KEY, JSON.stringify(messages));
};

export const getUserSettings = (): UserSettings => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : { username: 'Sajan' }; // Default
};

export const saveUserSettings = (settings: UserSettings) => {
  localStorage.setItem(USER_KEY, JSON.stringify(settings));
};

const getRandomTheme = () => {
  const themes = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-orange-400 to-pink-600',
    'from-blue-400 to-cyan-500',
    'from-emerald-400 to-teal-500'
  ];
  return themes[Math.floor(Math.random() * themes.length)];
};