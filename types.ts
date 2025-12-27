
export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  image: string;
  description?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
