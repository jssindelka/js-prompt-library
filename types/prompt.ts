export interface Prompt {
  id: string;
  title: string;
  prompt: string;
  image: string | null;
  categories: string[];
  createdAt: string;
}
