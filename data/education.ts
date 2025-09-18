import { GraduationCap, Users, CheckCircle, Star } from "lucide-react";

export interface CourseData {
  id: string;
  title: string;
  enrolled: number;
  completionRate: number;
  avgRating: number;
  image: string;
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
    image: "/images/background_one.jpg",
    icon: GraduationCap,
    description: "Learn the fundamentals of data science and analytics",
  },
  {
    id: "web-development-basics",
    title: "Web Development Basics",
    enrolled: 510,
    completionRate: 65,
    avgRating: 4.2,
    image: "/images/background_two.jpg",
    icon: GraduationCap,
    description: "Master the basics of HTML, CSS, and JavaScript",
  },
  {
    id: "business-analytics",
    title: "Business Analytics",
    enrolled: 210,
    completionRate: 82,
    avgRating: 4.7,
    image: "/images/background_three.jpg",
    icon: GraduationCap,
    description: "Apply data analytics to business decision making",
  },
  {
    id: "ai-for-beginners",
    title: "AI for Beginners",
    enrolled: 450,
    completionRate: 70,
    avgRating: 4.6,
    image: "/images/background_four.jpg",
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
  image: string;
}

export const recommendedCourses: RecommendedCourse[] = [
  {
    id: "advanced-python",
    title: "Advanced Python Programming",
    authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    rating: 4.8,
    price: 89.99,
    image: "/images/background_five.jpg",
  },
  {
    id: "machine-learning-fundamentals",
    title: "Machine Learning Fundamentals",
    authors: ["Dr. James Wilson"],
    rating: 4.9,
    price: 129.99,
    image: "/images/background_six.jpg",
  },
  {
    id: "data-visualization-excel",
    title: "Data Visualization with Excel",
    authors: ["Lisa Thompson", "Mark Davis"],
    rating: 4.6,
    price: 49.99,
    image: "/images/background_seven.jpg",
  },
  {
    id: "cloud-computing-aws",
    title: "Cloud Computing with AWS",
    authors: ["Dr. Robert Kim", "Jennifer Liu"],
    rating: 4.7,
    price: 99.99,
    image: "/images/background_eight.jpg",
  },
];

export const educationMetrics: EducationMetric[] = [
  {
    id: "total-students",
    title: "Total Students",
    value: "12,847",
    change: "+15.3% from last month",
    changeType: "positive",
    icon: Users,
    description: "Total number of enrolled students",
  },
  {
    id: "active-courses",
    title: "Active Courses",
    value: "24",
    change: "+2 new courses",
    changeType: "positive",
    icon: GraduationCap,
    description: "Currently active courses",
  },
  {
    id: "completion-rate",
    title: "Avg Completion Rate",
    value: "73.8%",
    change: "+5.2% from last quarter",
    changeType: "positive",
    icon: CheckCircle,
    description: "Average course completion rate",
  },
  {
    id: "avg-rating",
    title: "Avg Course Rating",
    value: "4.5/5",
    change: "+0.1 from last month",
    changeType: "positive",
    icon: Star,
    description: "Average course rating from students",
  },
];
