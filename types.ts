
export type UserRole = 'student' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  phoneNumber?: string;
  enrolledCourses?: string[]; // Array of Course IDs
  progress?: Record<string, number>; // courseId -> percentage
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  thumbnail: string;
  instructor: string;
  price?: number; // If paid, but usually free for madrasa
  lessons: Lesson[];
  isLive?: boolean;
  liveLink?: string;
}

export type CourseCategory = 'Quran Learning' | 'Dua' | 'Namaz' | 'Hadith' | 'Basic Islam';

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string; // Private streaming URL
  duration: string;
  order: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: string;
  grade?: string;
  feedback?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar?: string;
}
