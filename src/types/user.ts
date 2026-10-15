export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  username?: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface Rating {
  mediaId: number;
  mediaType: "movie" | "tv";
  score: number;
  createdAt?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  mediaId: number;
  mediaType: "movie" | "tv";
  createdAt: string;
}
