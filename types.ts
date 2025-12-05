export interface Message {
  id: string;
  text: string;
  timestamp: number;
  isRead: boolean;
  reply?: string;
  theme?: string; // For the card gradient
}

export interface UserSettings {
  username: string;
  avatarUrl?: string;
}

export enum AppRoute {
  HOME = 'home',
  INBOX = 'inbox',
  SEND = 'send',
  REPLY = 'reply'
}