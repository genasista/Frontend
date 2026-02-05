import { Course, Assignment, Grade, Submission } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Matematik 1c',
    description: 'Grundläggande matematikkurs',
    teacher: 'Erik Eriksson',
    startDate: '2025-01-15',
    endDate: '2025-06-15',
    students: 24
  },
  {
    id: '2',
    name: 'Svenska 2',
    description: 'Fortsättningskurs i svenska',
    teacher: 'Maria Svensson',
    startDate: '2025-01-15',
    endDate: '2025-06-15',
    students: 22
  },
  {
    id: '3',
    name: 'Engelska 5',
    description: 'Avancerad engelska',
    teacher: 'John Smith',
    startDate: '2025-01-15',
    endDate: '2025-06-15',
    students: 26
  },
  {
    id: '4',
    name: 'Fysik 1',
    description: 'Introduktion till fysik',
    teacher: 'Erik Eriksson',
    startDate: '2025-01-15',
    endDate: '2025-06-15',
    students: 20
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Algebra uppgift 1',
    description: 'Lös ekvationer på sida 45-48',
    courseId: '1',
    courseName: 'Matematik 1c',
    dueDate: '2025-10-25',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Essä om Svenska klassiker',
    description: 'Skriv en essä om en svensk klassiker',
    courseId: '2',
    courseName: 'Svenska 2',
    dueDate: '2025-10-30',
    status: 'submitted',
    submittedDate: '2025-10-16'
  },
  {
    id: '3',
    title: 'Grammatikövningar',
    description: 'Kapitel 5 och 6',
    courseId: '3',
    courseName: 'Engelska 5',
    dueDate: '2025-10-20',
    status: 'graded',
    grade: 'A',
    submittedDate: '2025-10-15'
  },
  {
    id: '4',
    title: 'Labrapport: Rörelse',
    description: 'Skriv en rapport om laborationen',
    courseId: '4',
    courseName: 'Fysik 1',
    dueDate: '2025-10-28',
    status: 'pending'
  }
];

export const mockGrades: Grade[] = [
  {
    id: '1',
    studentName: 'Anna Andersson',
    assignmentTitle: 'Grammatikövningar',
    courseName: 'Engelska 5',
    grade: 'A',
    date: '2025-10-16'
  },
  {
    id: '2',
    studentName: 'Anna Andersson',
    assignmentTitle: 'Algebra test',
    courseName: 'Matematik 1c',
    grade: 'B',
    date: '2025-10-10'
  },
  {
    id: '3',
    studentName: 'Anna Andersson',
    assignmentTitle: 'Laboration 1',
    courseName: 'Fysik 1',
    grade: 'A',
    date: '2025-10-05'
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    studentName: 'Emma Johansson',
    assignmentTitle: 'Algebra uppgift 1',
    courseName: 'Matematik 1c',
    submittedDate: '2025-10-16',
    status: 'pending'
  },
  {
    id: '2',
    studentName: 'Oscar Berg',
    assignmentTitle: 'Algebra uppgift 1',
    courseName: 'Matematik 1c',
    submittedDate: '2025-10-15',
    status: 'graded',
    grade: 'B'
  },
  {
    id: '3',
    studentName: 'Lisa Karlsson',
    assignmentTitle: 'Labrapport: Rörelse',
    courseName: 'Fysik 1',
    submittedDate: '2025-10-17',
    status: 'pending'
  },
  {
    id: '4',
    studentName: 'Viktor Nilsson',
    assignmentTitle: 'Essä om Svenska klassiker',
    courseName: 'Svenska 2',
    submittedDate: '2025-10-14',
    status: 'pending'
  }
];

export const upcomingCourses: Course[] = [
  {
    id: '5',
    name: 'Kemi 1',
    description: 'Grundläggande kemi',
    teacher: 'Sara Larsson',
    startDate: '2025-11-01',
    endDate: '2026-06-15'
  },
  {
    id: '6',
    name: 'Historia 1b',
    description: 'Svensk och internationell historia',
    teacher: 'Peter Gustafsson',
    startDate: '2025-11-15',
    endDate: '2026-06-15'
  }
];
