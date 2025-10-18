export interface Comment {
  cid: number;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  targetId: number;
}
