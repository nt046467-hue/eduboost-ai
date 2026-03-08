export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface StudyGuide {
  id: string;
  title: string;
  subject: string;
  summary: string;
  content: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: string;
  quiz?: QuizQuestion[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  category: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StudyMaterial {
  id: string;
  subject: string;
  chapter: string;
  type: "VIDEO" | "PDF";
  title: string;
  url: string;
  description: string;
  isOfflineReady: boolean;
}

export type Theme = "light" | "dark";
