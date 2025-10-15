export interface Post {
  pid: number;
  title: string;
  createdAt: Date;
  bid: number;
  authorId: number;
  isPinned: boolean;
  likes: number;
  dislikes: number;
}
