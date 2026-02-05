export type UserRole = 'student' | 'teacher' | 'parent' | 'demo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  teacher: string;
  startDate: string;
  endDate: string;
  students?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  submittedDate?: string;
}

export interface Grade {
  id: string;
  studentName: string;
  assignmentTitle: string;
  courseName: string;
  grade: string;
  date: string;
}

export interface Submission {
  id: string;
  studentName: string;
  assignmentTitle: string;
  courseName: string;
  submittedDate: string;
  status: 'pending' | 'graded';
  grade?: string;
}
