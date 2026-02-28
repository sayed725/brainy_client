export interface Booking {
  id: string;
  tutor?: { title: string; poster: string | null } | null;
  totalPrice: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  user: { name: string; id: string; image: string | null };
   tutorId: string;
   userId: string;
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

export interface AdminDashboardData {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
  totalConfirmedBookings: number;
  totalPendingBookings: number;
  totalRevenueResult: {
    _sum: {
      totalPrice: number;
    };
  };
  totalReviews: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    role: string;
    status: string;
    isDeleted: boolean;
    uniqueStatus: boolean;
    isDelete: boolean;
  }>;
  recentBookings: Array<{
    id: string;
    bookingDate: string | null;
    startTime: string;
    endTime: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    tutorId: string;
  }>;
  recentTutors: Array<{
    id: string;
    title: string;
    bio: string;
    rate: number;
    timeSlots: string[];
    availability: boolean;
    poster: string;
    averageRating: number;
    totalBookIng: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    categoryId: number;
  }>;
}