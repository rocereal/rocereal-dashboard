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
