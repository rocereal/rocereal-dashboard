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

export const coursesData: CourseData[] = [
  {
    courseId: "intro-data-science",
    title: "Intro to Data Science",
    enrolled: 320,
    completionRate: 78,
    avgRating: 4.5,
    courses: "10 lessons",
    image: backgroundOne,
    icon: GraduationCap,
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
    icon: GraduationCap,
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
    icon: GraduationCap,
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
    icon: GraduationCap,
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

export const recommendedCourses: RecommendedCourse[] = [
  {
    id: "advanced-python",
    title: "Advanced Python Programming",
    authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    rating: 4.8,
    courses: "10 lessons",
    price: 89.99,
    time: "1.5 hours",
    image: backgroundFive,
  },
  {
    id: "machine-learning-fundamentals",
    title: "Machine Learning Fundamentals",
    authors: ["Dr. James Wilson"],
    rating: 4.9,
    courses: "11 lessons",
    price: 129.99,
    time: "3 hours",
    image: backgroundSix,
  },
  {
    id: "data-visualization-excel",
    title: "Data Visualization with Excel",
    authors: ["Lisa Thompson", "Mark Davis"],
    rating: 4.6,
    courses: "12 lessons",
    price: 49.99,
    time: "2 hours",
    image: backgroundSeven,
  },
  {
    id: "cloud-computing-aws",
    title: "Cloud Computing with AWS",
    authors: ["Dr. Robert Kim", "Jennifer Liu"],
    rating: 4.7,
    courses: "13 lessons",
    price: 99.99,
    time: "2.5 hours",
    image: backgroundEight,
  },
  {
    id: "react-masterclass",
    title: "React.js Masterclass",
    authors: ["Alex Johnson", "Maria Garcia"],
    rating: 4.8,
    courses: "14 lessons",
    price: 79.99,
    time: "4 hours",
    image: backgroundOne,
  },
  {
    id: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    authors: ["Prof. David Brown"],
    rating: 4.5,
    courses: "15 lessons",
    price: 69.99,
    time: "3.5 hours",
    image: backgroundTwo,
  },
  {
    id: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    authors: ["Dr. Emily White", "Mark Stevens"],
    rating: 4.7,
    courses: "16 lessons",
    price: 94.99,
    time: "3 hours",
    image: backgroundThree,
  },
  {
    id: "blockchain-technology",
    title: "Blockchain Technology Fundamentals",
    authors: ["Dr. Kevin Park"],
    rating: 4.6,
    courses: "17 lessons",
    price: 109.99,
    time: "2.5 hours",
    image: backgroundFour,
  },
  {
    id: "ui-ux-design-principles",
    title: "UI/UX Design Principles",
    authors: ["Sarah Mitchell", "Tom Anderson"],
    rating: 4.9,
    courses: "18 lessons",
    price: 84.99,
    time: "5 hours",
    image: backgroundFive,
  },
  {
    id: "financial-modeling",
    title: "Financial Modeling for Beginners",
    authors: ["Prof. Rachel Green"],
    rating: 4.4,
    courses: "19 lessons",
    price: 74.99,
    time: "6 hours",
    image: backgroundSix,
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development with Flutter",
    authors: ["Carlos Rodriguez", "Anna Kim"],
    rating: 4.8,
    courses: "20 lessons",
    price: 119.99,
    time: "7 hours",
    image: backgroundSeven,
  },
  {
    id: "project-management-professional",
    title: "Project Management Professional",
    authors: ["Dr. Michael Chen", "Lisa Wong"],
    rating: 4.6,
    courses: "21 lessons",
    price: 89.99,
    time: "8 hours",
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
