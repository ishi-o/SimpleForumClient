export interface Post {
  pid: number;
  title: string;
  content: string;
  createdAt: Date;
  bid: number;
  authorId: number;
  authorName: string;
  isPinned: boolean;
  likes: number;
  dislikes: number;
}

export interface PostCreateRequest {
  title: string;
  content: string;
}
