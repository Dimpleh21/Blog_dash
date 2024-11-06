export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  username: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  body: string;
}
