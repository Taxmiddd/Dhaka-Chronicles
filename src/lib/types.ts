export type Category = "Politics" | "Tech" | "Culture" | "Edgy" | "Opinion" | "News";

export interface Article {
  id: string;
  title: string;
  category: Category;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  size?: "small" | "medium" | "large" | "tall";
}
