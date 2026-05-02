export interface Post {
  postId: number;
  title: string;
  body: string;
  authorId: number;
  authorName?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
  comments?: Comment[];
}

export interface Tag {
  tagId: number;
  tagName: string;
  isAuto: boolean;
}

export interface Comment {
  commentId: number;
  postId: number;
  userId: number;
  username?: string;
  body: string;
  createdAt: string;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Book {
  bookId: number;
  title: string;
  author: string;
  status: 'reading' | 'read' | 'want_to_read';
  rating: number | null;
  notes: string;
  yearRead: number | null;
  coverUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  projectId: number;
  title: string;
  description: string;
  repoUrl: string;
  liveUrl: string;
  techStack: string;
  status: 'active' | 'completed' | 'archived';
  source: 'manual' | 'github';
  createdAt: string;
  updatedAt: string;
}

export interface ReportResponse {
  posts: Post[];
  stats: {
    totalPosts: number;
    avgViews: number;
    avgComments: number;
    mostActiveAuthor: string;
  };
}

export interface CreatePostPayload {
  title: string;
  body: string;
  authorId: number;
  tagIds: number[];
}

export interface UpdatePostPayload {
  title: string;
  body: string;
  tagIds: number[];
}

export interface CreateCommentPayload {
  userId: number;
  body: string;
}
