
export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: number;
  text: string;
  sender: Sender;
}

export interface BotConfig {
  name: string;
  details: string;
}

declare global {
  interface Window {
    storage: {
      get: (key: string) => Promise<any>;
      set: (key: string, value: any) => Promise<void>;
    };
  }
}
