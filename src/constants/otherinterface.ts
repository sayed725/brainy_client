export interface Booking {
  id: string;
  tutor?: { title: string; poster: string | null } | null;
  totalPrice: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  user: { name: string; id: string; image: string | null };
  status: string; // "PENDING" | "CONFIRMED" | "CANCELLED"
}





export interface Tutor {
  id: string;
  title: string;
  bio: string;
  rate: number;
  availability: boolean;
  poster: string;
  averageRating: number;
  totalBookIng: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  userId: string;

  categories?: {
    id: number;
    name: string;
    slug: string | null;
  } | null;

  timeSlots?: string[];

  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
  };
}