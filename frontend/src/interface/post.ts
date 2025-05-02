export interface Author {
  name: string;
}

export interface PostProps {
  _id: string;
  title: string;
  summary: string;
  content: string;
  cover: string;
  createdAt: string;
  author: Author;
}

export interface PostInfo {
  title: string;
  content: string;
  cover: string;
  createdAt: string;
  author?: {
    name: string;
  };
}
