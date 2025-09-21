import { GraduationCap, Users, CheckCircle, Star } from "lucide-react";
import backgroundOne from "@/app/assets/images/background_one.jpg";
import backgroundTwo from "@/app/assets/images/background_two.jpg";
import backgroundThree from "@/app/assets/images/background_three.jpg";
import backgroundFour from "@/app/assets/images/background_four.jpg";
import backgroundFive from "@/app/assets/images/background_five.jpg";
import backgroundSix from "@/app/assets/images/background_six.jpg";
import backgroundSeven from "@/app/assets/images/background_seven.jpg";
import backgroundEight from "@/app/assets/images/background_eight.jpg";
import one from "@/app/assets/avatars/one.jpg";
import two from "@/app/assets/avatars/two.jpg";
import three from "@/app/assets/avatars/three.jpg";
import four from "@/app/assets/avatars/four.jpg";
import five from "@/app/assets/avatars/five.jpg";
import six from "@/app/assets/avatars/six.jpg";
import seven from "@/app/assets/avatars/seven.jpg";
import eight from "@/app/assets/avatars/eight.jpg";
import nine from "@/app/assets/avatars/nine.jpg";
import ten from "@/app/assets/avatars/ten.jpg";

import type { StaticImageData } from "next/image";

export interface CourseData {
  courseId: string;
  title: string;
  enrolled: number;
  completionRate: number;
  avgRating: number;
  courses: string;
  image: any;
  icon: any;
  description?: string;
  instructor?: string;
  duration?: string;
  level?: string;
  price?: number;
  currency?: string;
  prerequisites?: string[];
  skills?: string[];
  language?: string;
  lastUpdated?: string;
  certificate?: boolean;
  reviews?: number;
  curriculum?: CourseLesson[];
  tags?: string[];
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "assignment" | "reading";
  completed?: boolean;
}

// Original courses data (without export)
const originalCoursesData: CourseData[] = [
  {
    courseId: "intro-data-science",
    title: "Intro to Data Science",
    enrolled: 320,
    completionRate: 78,
    avgRating: 4.5,
    courses: "10 lessons",
    image: backgroundOne,
    icon: "graduation-cap",
    description:
      "Learn the fundamentals of data science and analytics. This comprehensive course covers data collection, cleaning, analysis, and visualization techniques using Python and popular libraries like Pandas, NumPy, and Matplotlib.",
    instructor: "Dr. Sarah Chen",
    duration: "8 weeks",
    level: "Beginner",
    price: 99.99,
    currency: "USD",
    prerequisites: ["Basic mathematics", "Basic programming concepts"],
    skills: ["Python", "Data Analysis", "Statistics", "Data Visualization"],
    language: "English",
    lastUpdated: "2025-01-15",
    certificate: true,
    reviews: 128,
    tags: ["Data Science", "Python", "Analytics", "Beginner"],
    curriculum: [
      {
        id: "1",
        title: "Introduction to Data Science",
        duration: "45 min",
        type: "video",
      },
      {
        id: "2",
        title: "Python Fundamentals for Data Science",
        duration: "1h 30min",
        type: "video",
      },
      {
        id: "3",
        title: "Data Collection and Cleaning",
        duration: "2h 15min",
        type: "video",
      },
      {
        id: "4",
        title: "Exploratory Data Analysis",
        duration: "1h 45min",
        type: "video",
      },
      {
        id: "5",
        title: "Statistical Analysis Basics",
        duration: "2h 30min",
        type: "video",
      },
      {
        id: "6",
        title: "Data Visualization with Matplotlib",
        duration: "1h 15min",
        type: "video",
      },
      {
        id: "7",
        title: "Introduction to Pandas",
        duration: "2h 45min",
        type: "video",
      },
      {
        id: "8",
        title: "Data Science Project",
        duration: "3h 30min",
        type: "assignment",
      },
      {
        id: "9",
        title: "Final Assessment",
        duration: "1h 30min",
        type: "quiz",
      },
      {
        id: "10",
        title: "Course Wrap-up and Next Steps",
        duration: "30 min",
        type: "video",
      },
    ],
  },
  {
    courseId: "web-development-basics",
    title: "Web Development Basics",
    enrolled: 510,
    completionRate: 65,
    avgRating: 4.2,
    courses: "12 lessons",
    image: backgroundTwo,
    icon: "graduation-cap",
    description:
      "Master the basics of HTML, CSS, and JavaScript. Build responsive websites from scratch and learn modern web development practices including semantic HTML, CSS Grid/Flexbox, and JavaScript fundamentals.",
    instructor: "Prof. Michael Rodriguez",
    duration: "10 weeks",
    level: "Beginner",
    price: 79.99,
    currency: "USD",
    prerequisites: ["None"],
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    language: "English",
    lastUpdated: "2025-01-20",
    certificate: true,
    reviews: 245,
    tags: ["Web Development", "HTML", "CSS", "JavaScript", "Frontend"],
    curriculum: [
      {
        id: "1",
        title: "HTML Fundamentals",
        duration: "1h 15min",
        type: "video",
      },
      {
        id: "2",
        title: "CSS Basics and Selectors",
        duration: "1h 45min",
        type: "video",
      },
      {
        id: "3",
        title: "CSS Layout with Flexbox",
        duration: "2h 30min",
        type: "video",
      },
      {
        id: "4",
        title: "CSS Grid Layout",
        duration: "2h 15min",
        type: "video",
      },
      {
        id: "5",
        title: "JavaScript Fundamentals",
        duration: "3h 45min",
        type: "video",
      },
      {
        id: "6",
        title: "DOM Manipulation",
        duration: "2h 30min",
        type: "video",
      },
      {
        id: "7",
        title: "Event Handling",
        duration: "1h 45min",
        type: "video",
      },
      {
        id: "8",
        title: "Building Interactive Forms",
        duration: "2h 15min",
        type: "video",
      },
      {
        id: "9",
        title: "Responsive Design Principles",
        duration: "2h 45min",
        type: "video",
      },
      {
        id: "10",
        title: "Project: Personal Portfolio Website",
        duration: "4h 30min",
        type: "assignment",
      },
      {
        id: "11",
        title: "Final Project Review",
        duration: "1h 30min",
        type: "video",
      },
      {
        id: "12",
        title: "Deployment and Next Steps",
        duration: "45 min",
        type: "video",
      },
    ],
  },
  {
    courseId: "business-analytics",
    title: "Business Analytics",
    enrolled: 210,
    completionRate: 82,
    avgRating: 4.7,
    courses: "13 lessons",
    image: backgroundThree,
    icon: "graduation-cap",
    description:
      "Apply data analytics to business decision making. Learn how to use data to drive business insights, create dashboards, and make data-driven decisions that impact organizational performance.",
    instructor: "Dr. James Wilson",
    duration: "12 weeks",
    level: "Intermediate",
    price: 149.99,
    currency: "USD",
    prerequisites: ["Basic statistics", "Excel proficiency"],
    skills: [
      "Business Intelligence",
      "Data Analysis",
      "Excel",
      "Tableau",
      "SQL",
    ],
    language: "English",
    lastUpdated: "2025-01-10",
    certificate: true,
    reviews: 89,
    tags: [
      "Business Analytics",
      "BI",
      "Data Analysis",
      "Excel",
      "Decision Making",
    ],
    curriculum: [
      {
        id: "1",
        title: "Business Analytics Overview",
        duration: "1h 30min",
        type: "video",
      },
      {
        id: "2",
        title: "Data Collection and Management",
        duration: "2h 15min",
        type: "video",
      },
      {
        id: "3",
        title: "Descriptive Analytics",
        duration: "2h 45min",
        type: "video",
      },
      {
        id: "4",
        title: "Diagnostic Analytics",
        duration: "3h 30min",
        type: "video",
      },
      {
        id: "5",
        title: "Predictive Analytics",
        duration: "4h 15min",
        type: "video",
      },
      {
        id: "6",
        title: "Prescriptive Analytics",
        duration: "3h 45min",
        type: "video",
      },
      {
        id: "7",
        title: "Excel for Business Analytics",
        duration: "5h 30min",
        type: "video",
      },
      {
        id: "8",
        title: "SQL for Data Analysis",
        duration: "4h 15min",
        type: "video",
      },
      {
        id: "9",
        title: "Dashboard Creation with Tableau",
        duration: "6h 45min",
        type: "video",
      },
      {
        id: "10",
        title: "Business Case Studies",
        duration: "3h 30min",
        type: "reading",
      },
      {
        id: "11",
        title: "Analytics Project",
        duration: "8h 30min",
        type: "assignment",
      },
      {
        id: "12",
        title: "Presentation Skills for Analysts",
        duration: "2h 15min",
        type: "video",
      },
      {
        id: "13",
        title: "Career in Business Analytics",
        duration: "1h 30min",
        type: "video",
      },
    ],
  },
  {
    courseId: "ai-for-beginners",
    title: "AI for Beginners",
    enrolled: 450,
    completionRate: 70,
    avgRating: 4.6,
    courses: "14 lessons",
    image: backgroundFour,
    icon: "graduation-cap",
    description:
      "Introduction to artificial intelligence concepts. Learn the fundamentals of AI, machine learning, and neural networks. Understand how AI systems work and their applications in various industries.",
    instructor: "Dr. Emily White",
    duration: "14 weeks",
    level: "Beginner",
    price: 119.99,
    currency: "USD",
    prerequisites: ["Basic mathematics", "Basic programming"],
    skills: [
      "Artificial Intelligence",
      "Machine Learning",
      "Neural Networks",
      "Python",
    ],
    language: "English",
    lastUpdated: "2025-01-25",
    certificate: true,
    reviews: 167,
    tags: ["AI", "Machine Learning", "Neural Networks", "Python", "Beginner"],
    curriculum: [
      {
        id: "1",
        title: "What is Artificial Intelligence?",
        duration: "1h 15min",
        type: "video",
      },
      {
        id: "2",
        title: "History of AI",
        duration: "1h 45min",
        type: "video",
      },
      {
        id: "3",
        title: "Machine Learning Fundamentals",
        duration: "2h 30min",
        type: "video",
      },
      {
        id: "4",
        title: "Supervised Learning",
        duration: "3h 15min",
        type: "video",
      },
      {
        id: "5",
        title: "Unsupervised Learning",
        duration: "2h 45min",
        type: "video",
      },
      {
        id: "6",
        title: "Neural Networks Basics",
        duration: "4h 30min",
        type: "video",
      },
      {
        id: "7",
        title: "Deep Learning Introduction",
        duration: "3h 45min",
        type: "video",
      },
      {
        id: "8",
        title: "Computer Vision",
        duration: "5h 15min",
        type: "video",
      },
      {
        id: "9",
        title: "Natural Language Processing",
        duration: "4h 45min",
        type: "video",
      },
      {
        id: "10",
        title: "AI Ethics and Bias",
        duration: "2h 30min",
        type: "video",
      },
      {
        id: "11",
        title: "AI in Business",
        duration: "3h 15min",
        type: "video",
      },
      {
        id: "12",
        title: "Building Your First AI Model",
        duration: "6h 30min",
        type: "assignment",
      },
      {
        id: "13",
        title: "AI Tools and Frameworks",
        duration: "2h 45min",
        type: "video",
      },
      {
        id: "14",
        title: "Future of AI",
        duration: "1h 30min",
        type: "video",
      },
    ],
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
  courses: string;
  authors: string[];
  rating: number;
  time: string;
  price: number;
  image: any;
}

// Convert recommended courses to full CourseData format and merge with main courses
const recommendedCoursesData: CourseData[] = [
  {
    courseId: "advanced-python",
    title: "Advanced Python Programming",
    enrolled: 890,
    completionRate: 85,
    avgRating: 4.8,
    courses: "10 lessons",
    image: backgroundFive,
    icon: "graduation-cap",
    description:
      "Take your Python skills to the next level with advanced concepts including decorators, generators, metaclasses, and performance optimization techniques.",
    instructor: "Dr. Sarah Chen",
    duration: "6 weeks",
    level: "Advanced",
    price: 89.99,
    currency: "USD",
    prerequisites: ["Python basics", "Object-oriented programming"],
    skills: [
      "Advanced Python",
      "Decorators",
      "Generators",
      "Performance Optimization",
    ],
    language: "English",
    lastUpdated: "2025-02-01",
    certificate: true,
    reviews: 234,
    tags: ["Python", "Advanced", "Programming", "Backend"],
  },
  {
    courseId: "machine-learning-fundamentals",
    title: "Machine Learning Fundamentals",
    enrolled: 1200,
    completionRate: 82,
    avgRating: 4.9,
    courses: "11 lessons",
    image: backgroundSix,
    icon: "graduation-cap",
    description:
      "Master the core concepts of machine learning including supervised and unsupervised learning, model evaluation, and practical applications.",
    instructor: "Dr. James Wilson",
    duration: "8 weeks",
    level: "Intermediate",
    price: 129.99,
    currency: "USD",
    prerequisites: ["Python", "Linear Algebra", "Statistics"],
    skills: ["Machine Learning", "Python", "Scikit-learn", "Model Evaluation"],
    language: "English",
    lastUpdated: "2025-02-05",
    certificate: true,
    reviews: 456,
    tags: ["Machine Learning", "AI", "Python", "Data Science"],
  },
  {
    courseId: "data-visualization-excel",
    title: "Data Visualization with Excel",
    enrolled: 650,
    completionRate: 78,
    avgRating: 4.6,
    courses: "12 lessons",
    image: backgroundSeven,
    icon: "graduation-cap",
    description:
      "Learn to create stunning data visualizations and dashboards in Excel. Master charts, pivot tables, and advanced visualization techniques.",
    instructor: "Lisa Thompson",
    duration: "4 weeks",
    level: "Beginner",
    price: 49.99,
    currency: "USD",
    prerequisites: ["Basic Excel knowledge"],
    skills: ["Excel", "Data Visualization", "Charts", "Dashboards"],
    language: "English",
    lastUpdated: "2025-02-10",
    certificate: true,
    reviews: 189,
    tags: ["Excel", "Data Visualization", "Business Intelligence"],
  },
  {
    courseId: "cloud-computing-aws",
    title: "Cloud Computing with AWS",
    enrolled: 980,
    completionRate: 80,
    avgRating: 4.7,
    courses: "13 lessons",
    image: backgroundEight,
    icon: GraduationCap,
    description:
      "Comprehensive guide to Amazon Web Services. Learn EC2, S3, Lambda, and other AWS services with hands-on projects and real-world scenarios.",
    instructor: "Dr. Robert Kim",
    duration: "10 weeks",
    level: "Intermediate",
    price: 99.99,
    currency: "USD",
    prerequisites: ["Basic IT knowledge", "Networking fundamentals"],
    skills: ["AWS", "Cloud Computing", "EC2", "S3", "Lambda"],
    language: "English",
    lastUpdated: "2025-02-15",
    certificate: true,
    reviews: 312,
    tags: ["AWS", "Cloud Computing", "DevOps", "Infrastructure"],
  },
  {
    courseId: "react-masterclass",
    title: "React.js Masterclass",
    enrolled: 1450,
    completionRate: 83,
    avgRating: 4.8,
    courses: "14 lessons",
    image: backgroundOne,
    icon: GraduationCap,
    description:
      "Become a React expert with advanced concepts including hooks, context, performance optimization, and modern React patterns.",
    instructor: "Alex Johnson",
    duration: "12 weeks",
    level: "Advanced",
    price: 79.99,
    currency: "USD",
    prerequisites: ["JavaScript", "Basic React knowledge"],
    skills: ["React", "JavaScript", "Hooks", "Context API", "Performance"],
    language: "English",
    lastUpdated: "2025-02-20",
    certificate: true,
    reviews: 567,
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
  },
  {
    courseId: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    enrolled: 780,
    completionRate: 76,
    avgRating: 4.5,
    courses: "15 lessons",
    image: backgroundTwo,
    icon: GraduationCap,
    description:
      "Master digital marketing strategies including SEO, SEM, social media marketing, content marketing, and analytics-driven decision making.",
    instructor: "Prof. David Brown",
    duration: "8 weeks",
    level: "Intermediate",
    price: 69.99,
    currency: "USD",
    prerequisites: ["Basic marketing knowledge"],
    skills: ["Digital Marketing", "SEO", "SEM", "Social Media", "Analytics"],
    language: "English",
    lastUpdated: "2025-02-25",
    certificate: true,
    reviews: 234,
    tags: ["Digital Marketing", "SEO", "Social Media", "Marketing"],
  },
  {
    courseId: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    enrolled: 1100,
    completionRate: 84,
    avgRating: 4.7,
    courses: "16 lessons",
    image: backgroundThree,
    icon: GraduationCap,
    description:
      "Learn essential cybersecurity concepts including threat detection, encryption, network security, and best practices for protecting digital assets.",
    instructor: "Dr. Emily White",
    duration: "10 weeks",
    level: "Intermediate",
    price: 94.99,
    currency: "USD",
    prerequisites: ["Basic IT knowledge"],
    skills: [
      "Cybersecurity",
      "Network Security",
      "Encryption",
      "Threat Detection",
    ],
    language: "English",
    lastUpdated: "2025-03-01",
    certificate: true,
    reviews: 378,
    tags: ["Cybersecurity", "Security", "IT", "Network Security"],
  },
  {
    courseId: "blockchain-technology",
    title: "Blockchain Technology Fundamentals",
    enrolled: 920,
    completionRate: 79,
    avgRating: 4.6,
    courses: "17 lessons",
    image: backgroundFour,
    icon: GraduationCap,
    description:
      "Understanding blockchain technology from basics to advanced concepts including smart contracts, decentralized applications, and cryptocurrency.",
    instructor: "Dr. Kevin Park",
    duration: "9 weeks",
    level: "Intermediate",
    price: 109.99,
    currency: "USD",
    prerequisites: ["Basic programming", "Cryptography basics"],
    skills: [
      "Blockchain",
      "Cryptocurrency",
      "Smart Contracts",
      "Decentralized Apps",
    ],
    language: "English",
    lastUpdated: "2025-03-05",
    certificate: true,
    reviews: 267,
    tags: ["Blockchain", "Cryptocurrency", "Web3", "Decentralized"],
  },
];

// Merge all courses into a single comprehensive array
const allCoursesData: CourseData[] = [
  ...originalCoursesData,
  ...recommendedCoursesData,
];

// Re-export the merged data as coursesData
export { allCoursesData as coursesData };

// Keep the old interface for backward compatibility (can be removed later)
export interface RecommendedCourse {
  id: string;
  title: string;
  courses: string;
  authors: string[];
  rating: number;
  time: string;
  price: number;
  image: any;
}

// Create a computed recommended courses array from the merged data
export const recommendedCourses: RecommendedCourse[] =
  recommendedCoursesData.map((course) => ({
    id: course.courseId,
    title: course.title,
    courses: course.courses,
    authors: course.instructor ? [course.instructor] : [],
    rating: course.avgRating,
    time: course.duration || "4 weeks",
    price: course.price || 0,
    image: course.image,
  }));

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
  avatar?: string | StaticImageData;
  progress: number; // Progress percentage (0-100)
  certificates: number; // Number of certificates earned
}

export const recentStudentsData: RecentStudent[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    course: "Intro to Data Science",
    enrollmentDate: "2025-01-15",
    avatar: eight,
    status: "active",
    progress: 75,
    certificates: 1,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    course: "Web Development Basics",
    enrollmentDate: "2025-01-14",
    avatar: five,
    status: "active",
    progress: 60,
    certificates: 0,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    course: "Business Analytics",
    enrollmentDate: "2025-01-13",
    status: "completed",
    avatar: nine,
    progress: 100,
    certificates: 2,
  },
  {
    id: "4",
    name: "David Kim",
    email: "d.kim@example.com",
    course: "AI for Beginners",
    enrollmentDate: "2025-01-12",
    avatar: four,
    status: "active",
    progress: 45,
    certificates: 0,
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "l.thompson@example.com",
    course: "Advanced Python",
    enrollmentDate: "2025-01-11",
    avatar: seven,
    status: "inactive",
    progress: 30,
    certificates: 1,
  },
  {
    id: "6",
    name: "James Wilson",
    email: "j.wilson@example.com",
    course: "Machine Learning",
    avatar: one,
    enrollmentDate: "2025-01-10",
    status: "active",
    progress: 80,
    certificates: 1,
  },
  {
    id: "7",
    name: "Anna Martinez",
    email: "a.martinez@example.com",
    course: "Data Visualization",
    enrollmentDate: "2025-01-09",
    avatar: ten,
    status: "completed",
    progress: 100,
    certificates: 3,
  },
  {
    id: "8",
    name: "Robert Brown",
    email: "r.brown@example.com",
    avatar: six,
    course: "Cloud Computing",
    enrollmentDate: "2025-01-08",
    status: "active",
    progress: 55,
    certificates: 0,
  },
];
