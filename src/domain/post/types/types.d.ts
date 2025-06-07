interface Post {
  id: string;
  content: string;
  imageUrls: string[];
  likes: number;
  comments: number;
  reposts: number;
  userId: string;
  user?: User;
}


