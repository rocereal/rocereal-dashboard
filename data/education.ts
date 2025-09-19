import { GraduationCap, Users, CheckCircle, Star } from "lucide-react";
import backgroundOne from "@/app/assets/images/background_one.jpg";
import backgroundTwo from "@/app/assets/images/background_two.jpg";
import backgroundThree from "@/app/assets/images/background_three.jpg";
import backgroundFour from "@/app/assets/images/background_four.jpg";
import backgroundFive from "@/app/assets/images/background_five.jpg";
import backgroundSix from "@/app/assets/images/background_six.jpg";
import backgroundSeven from "@/app/assets/images/background_seven.jpg";
import backgroundEight from "@/app/assets/images/background_eight.jpg";

export interface CourseData {
  id: string;
  title: string;
  enrolled: number;
  completionRate: number;
  avgRating: number;
  image: any;
  icon: any;
  description?: string;
}

export const coursesData: CourseData[] = [
  {
    id: "intro-data-science",
    title: "Intro to Data Science",
    enrolled: 320,
    completionRate: 78,
    avgRating: 4.5,
    image: backgroundOne,
    icon: GraduationCap,
    description: "Learn the fundamentals of data science and analytics",
  },
  {
    id: "web-development-basics",
    title: "Web Development Basics",
    enrolled: 510,
    completionRate: 65,
    avgRating: 4.2,
    image: backgroundTwo,
    icon: GraduationCap,
    description: "Master the basics of HTML, CSS, and JavaScript",
  },
  {
    id: "business-analytics",
    title: "Business Analytics",
    enrolled: 210,
    completionRate: 82,
    avgRating: 4.7,
    image: backgroundThree,
    icon: GraduationCap,
    description: "Apply data analytics to business decision making",
  },
  {
    id: "ai-for-beginners",
    title: "AI for Beginners",
    enrolled: 450,
    completionRate: 70,
    avgRating: 4.6,
    image: backgroundFour,
    icon: GraduationCap,
    description: "Introduction to artificial intelligence concepts",
  },
];

export interface EducationMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  description?: string;
}

export interface RecommendedCourse {
  id: string;
  title: string;
  authors: string[];
  rating: number;
  price: number;
  image: any;
}

export const recommendedCourses: RecommendedCourse[] = [
  {
    id: "advanced-python",
    title: "Advanced Python Programming",
    authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    rating: 4.8,
    price: 89.99,
    image: backgroundFive,
  },
  {
    id: "machine-learning-fundamentals",
    title: "Machine Learning Fundamentals",
    authors: ["Dr. James Wilson"],
    rating: 4.9,
    price: 129.99,
    image: backgroundSix,
  },
  {
    id: "data-visualization-excel",
    title: "Data Visualization with Excel",
    authors: ["Lisa Thompson", "Mark Davis"],
    rating: 4.6,
    price: 49.99,
    image: backgroundSeven,
  },
  {
    id: "cloud-computing-aws",
    title: "Cloud Computing with AWS",
    authors: ["Dr. Robert Kim", "Jennifer Liu"],
    rating: 4.7,
    price: 99.99,
    image: backgroundEight,
  },
  {
    id: "react-masterclass",
    title: "React.js Masterclass",
    authors: ["Alex Johnson", "Maria Garcia"],
    rating: 4.8,
    price: 79.99,
    image: backgroundOne,
  },
  {
    id: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    authors: ["Prof. David Brown"],
    rating: 4.5,
    price: 69.99,
    image: backgroundTwo,
  },
  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    authors: ["Dr. Emily White", "Mark Stevens"],
    rating: 4.7,
    price: 94.99,
    image: backgroundThree,
  },
  {
    id: "blockchain-technology",
    title: "Blockchain Technology Fundamentals",
    authors: ["Dr. Kevin Park"],
    rating: 4.6,
    price: 109.99,
    image: backgroundFour,
  },
  {
    id: "ui-ux-design-principles",
    title: "UI/UX Design Principles",
    authors: ["Sarah Mitchell", "Tom Anderson"],
    rating: 4.9,
    price: 84.99,
    image: backgroundFive,
  },
  {
    id: "financial-modeling",
    title: "Financial Modeling for Beginners",
    authors: ["Prof. Rachel Green"],
    rating: 4.4,
    price: 74.99,
    image: backgroundSix,
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development with Flutter",
    authors: ["Carlos Rodriguez", "Anna Kim"],
    rating: 4.8,
    price: 119.99,
    image: backgroundSeven,
  },
  {
    id: "project-management-professional",
    title: "Project Management Professional",
    authors: ["Dr. Michael Chen", "Lisa Wong"],
    rating: 4.6,
    price: 89.99,
    image: backgroundEight,
  },
];

export const educationMetrics: EducationMetric[] = [
  {
    id: "total-students",
    title: "Total Students",
    value: "12,450",
    change: "+8.2% from last month",
    changeType: "positive",
    icon: Users,
    description: "All registered learners on the platform",
  },
  {
    id: "active-students",
    title: "Active Students (This Month)",
    value: "3,280",
    change: "+12.5% from last month",
    changeType: "positive",
    icon: GraduationCap,
    description: "Currently engaged in at least one course",
  },
  {
    id: "completion-rate",
    title: "Avg Course Completion Rate",
    value: "72%",
    change: "+3.1% from last quarter",
    changeType: "positive",
    icon: CheckCircle,
    description: "Percentage of students who finish their enrolled courses",
  },
  {
    id: "certificates-issued",
    title: "Certificates Issued",
    value: "8,940",
    change: "+18.7% from last month",
    changeType: "positive",
    icon: Star,
    description: "Successful completions with certification",
  },
];

// Chart data for Student Engagement
export const studentEngagementData = [
  { week: "Week 1", activeLearners: 2450 },
  { week: "Week 2", activeLearners: 2680 },
  { week: "Week 3", activeLearners: 2890 },
  { week: "Week 4", activeLearners: 3120 },
  { week: "Week 5", activeLearners: 2980 },
  { week: "Week 6", activeLearners: 3340 },
  { week: "Week 7", activeLearners: 3580 },
  { week: "Week 8", activeLearners: 3420 },
  { week: "Week 9", activeLearners: 3760 },
  { week: "Week 10", activeLearners: 3890 },
  { week: "Week 11", activeLearners: 4120 },
  { week: "Week 12", activeLearners: 4280 },
];

// Chart data for Time Spent on Platform by Course
export const timeSpentByCourseData = [
  { course: "Intro to Data Science", hours: 245 },
  { course: "Web Development Basics", hours: 320 },
  { course: "Business Analytics", hours: 180 },
  { course: "AI for Beginners", hours: 290 },
  { course: "Advanced Python", hours: 210 },
  { course: "Machine Learning", hours: 275 },
  { course: "Data Visualization", hours: 165 },
  { course: "Cloud Computing", hours: 235 },
];

export interface RecentStudent {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "completed";
  avatar?: string;
}

export const recentStudentsData: RecentStudent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    course: "Intro to Data Science",
    enrollmentDate: "2025-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    course: "Web Development Basics",
    enrollmentDate: "2025-01-14",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    course: "Business Analytics",
    enrollmentDate: "2025-01-13",
    status: "completed",
  },
  {
    id: "4",
    name: "David Kim",
    email: "d.kim@example.com",
    course: "AI for Beginners",
    enrollmentDate: "2025-01-12",
    status: "active",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "l.thompson@example.com",
    course: "Advanced Python",
    enrollmentDate: "2025-01-11",
    status: "inactive",
  },
  {
    id: "6",
    name: "James Wilson",
    email: "j.wilson@example.com",
    course: "Machine Learning",
    enrollmentDate: "2025-01-10",
    status: "active",
  },
  {
    id: "7",
    name: "Anna Martinez",
    email: "a.martinez@example.com",
    course: "Data Visualization",
    enrollmentDate: "2025-01-09",
    status: "completed",
  },
  {
    id: "8",
    name: "Robert Brown",
    email: "r.brown@example.com",
    course: "Cloud Computing",
    enrollmentDate: "2025-01-08",
    status: "active",
  },
];
