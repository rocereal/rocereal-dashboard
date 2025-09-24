import one from "@/app/assets/properties/one.png";
import two from "@/app/assets/properties/two.png";
import three from "@/app/assets/properties/three.png";
import four from "@/app/assets/properties/four.png";
import five from "@/app/assets/properties/five.png";
import six from "@/app/assets/properties/six.png";
import seven from "@/app/assets/properties/seven.png";
import eight from "@/app/assets/properties/eight.png";
import nine from "@/app/assets/properties/nine.png";
import ten from "@/app/assets/properties/ten.png";

import {
  DollarSign,
  Home,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import { StaticImageData } from "next/image";

export interface RealEstateMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  description?: string;
}

export const realEstateMetrics: RealEstateMetric[] = [
  {
    id: "total-properties",
    title: "Total Properties",
    value: "1,247",
    change: "↑ 12% vs last month",
    changeType: "positive",
    icon: Home,
    description: "Total number of properties in portfolio",
  },
  {
    id: "avg-property-value",
    title: "Avg Property Value",
    value: "$485K",
    change: "↑ 8% vs last month",
    changeType: "positive",
    icon: DollarSign,
    description: "Average value of properties",
  },
  {
    id: "properties-sold",
    title: "Properties Sold",
    value: "89",
    change: "↑ 15% vs last month",
    changeType: "positive",
    icon: TrendingUp,
    description: "Number of properties sold this month",
  },
  {
    id: "active-listings",
    title: "Active Listings",
    value: "156",
    change: "↓ 5% vs last month",
    changeType: "negative",
    icon: MapPin,
    description: "Currently active property listings",
  },
  {
    id: "new-leads",
    title: "New Leads",
    value: "234",
    change: "↑ 22% vs last month",
    changeType: "positive",
    icon: Users,
    description: "New potential buyers this month",
  },
  {
    id: "avg-days-market",
    title: "Avg Days on Market",
    value: "28",
    change: "↓ 3 days from last month",
    changeType: "positive",
    icon: Calendar,
    description: "Average time properties stay on market",
  },
];

export interface Room {
  id: string;
  name: string;
  type:
    | "bedroom"
    | "bathroom"
    | "living"
    | "dining"
    | "kitchen"
    | "office"
    | "garage"
    | "basement"
    | "other";
  sqft: number;
  level: number;
  description?: string;
}

export interface FloorPlan {
  id: string;
  level: number;
  name: string;
  sqft: number;
  rooms: Room[];
  image?: string;
  description?: string;
}

export interface NearbyFeature {
  id: string;
  type:
    | "school"
    | "park"
    | "shopping"
    | "restaurant"
    | "hospital"
    | "transport"
    | "other";
  name: string;
  distance: number; // in miles
  rating?: number; // 1-5 stars
  description?: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  type: "house" | "apartment" | "condo" | "townhouse" | "land";
  status: "available" | "pending" | "sold" | "off-market";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize?: number;
  yearBuilt: number;
  description: string;
  features: string[];
  images: (string | StaticImageData)[];
  floorPlans: FloorPlan[];
  nearbyFeatures: NearbyFeature[];
  agent: string;
  agentEmail: string;
  agentPhone: string;
  listedDate: string;
  updatedDate: string;
  latitude?: number;
  longitude?: number;
}

export const propertiesData: Property[] = [
  {
    id: "prop-001",
    title: "Modern Downtown Loft",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    price: 1250000,
    type: "apartment",
    status: "available",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    yearBuilt: 2018,
    description:
      "Stunning modern loft in the heart of downtown with floor-to-ceiling windows and premium finishes.",
    features: [
      "Hardwood Floors",
      "Stainless Steel Appliances",
      "In-unit Laundry",
      "City Views",
    ],
    images: [one, two, three],
    floorPlans: [
      {
        id: "fp-001-1",
        level: 1,
        name: "Main Floor",
        sqft: 1200,
        rooms: [
          {
            id: "room-001-1",
            name: "Master Bedroom",
            type: "bedroom",
            sqft: 300,
            level: 1,
            description: "Spacious master bedroom with city views",
          },
          {
            id: "room-001-2",
            name: "Second Bedroom",
            type: "bedroom",
            sqft: 250,
            level: 1,
            description: "Comfortable guest bedroom",
          },
          {
            id: "room-001-3",
            name: "Living Room",
            type: "living",
            sqft: 400,
            level: 1,
            description: "Open concept living area with modern furnishings",
          },
          {
            id: "room-001-4",
            name: "Kitchen",
            type: "kitchen",
            sqft: 150,
            level: 1,
            description: "Modern kitchen with stainless steel appliances",
          },
          {
            id: "room-001-5",
            name: "Master Bathroom",
            type: "bathroom",
            sqft: 60,
            level: 1,
            description: "Full bathroom with walk-in shower",
          },
          {
            id: "room-001-6",
            name: "Guest Bathroom",
            type: "bathroom",
            sqft: 40,
            level: 1,
            description: "Half bathroom for guests",
          },
        ],
        description: "Open concept loft with modern amenities",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-001-1",
        type: "school",
        name: "Lincoln High School",
        distance: 0.8,
        rating: 4.2,
        description: "Highly rated public high school",
      },
      {
        id: "nf-001-2",
        type: "shopping",
        name: "Union Square Shopping District",
        distance: 0.3,
        rating: 4.5,
        description: "Premium shopping and dining destination",
      },
      {
        id: "nf-001-3",
        type: "transport",
        name: "Powell Street BART Station",
        distance: 0.2,
        description: "Direct access to public transportation",
      },
      {
        id: "nf-001-4",
        type: "restaurant",
        name: "The Italian Homemade Company",
        distance: 0.1,
        rating: 4.3,
        description: "Popular Italian restaurant",
      },
    ],
    agent: "Sarah Johnson",
    agentEmail: "sarah.johnson@realestate.com",
    agentPhone: "(555) 123-4567",
    listedDate: "2025-08-01",
    updatedDate: "2025-08-15",
  },
  {
    id: "prop-002",
    title: "Spacious Family Home",
    address: "456 Oak Avenue",
    city: "Palo Alto",
    state: "CA",
    zipCode: "94301",
    price: 2850000,
    type: "house",
    status: "pending",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    lotSize: 8500,
    yearBuilt: 1995,
    description:
      "Beautiful family home in prestigious Palo Alto neighborhood with large backyard and updated kitchen.",
    features: [
      "Updated Kitchen",
      "Large Backyard",
      "Garage",
      "Fireplace",
      "Hardwood Floors",
    ],
    images: [four, five, six],
    floorPlans: [
      {
        id: "fp-002-1",
        level: 1,
        name: "Main Floor",
        sqft: 1400,
        rooms: [
          {
            id: "room-002-1",
            name: "Living Room",
            type: "living",
            sqft: 350,
            level: 1,
            description: "Spacious living room with fireplace",
          },
          {
            id: "room-002-2",
            name: "Dining Room",
            type: "dining",
            sqft: 200,
            level: 1,
            description: "Formal dining area",
          },
          {
            id: "room-002-3",
            name: "Kitchen",
            type: "kitchen",
            sqft: 180,
            level: 1,
            description: "Updated kitchen with granite countertops",
          },
          {
            id: "room-002-4",
            name: "Master Bedroom",
            type: "bedroom",
            sqft: 300,
            level: 1,
            description: "Large master suite with walk-in closet",
          },
          {
            id: "room-002-5",
            name: "Master Bathroom",
            type: "bathroom",
            sqft: 80,
            level: 1,
            description: "Full bathroom with double vanity",
          },
        ],
        description: "Main living areas with master suite",
      },
      {
        id: "fp-002-2",
        level: 2,
        name: "Upper Floor",
        sqft: 1400,
        rooms: [
          {
            id: "room-002-6",
            name: "Bedroom 2",
            type: "bedroom",
            sqft: 250,
            level: 2,
            description: "Comfortable guest bedroom",
          },
          {
            id: "room-002-7",
            name: "Bedroom 3",
            type: "bedroom",
            sqft: 220,
            level: 2,
            description: "Kids' bedroom with built-in storage",
          },
          {
            id: "room-002-8",
            name: "Bedroom 4",
            type: "bedroom",
            sqft: 200,
            level: 2,
            description: "Small bedroom perfect for office or nursery",
          },
          {
            id: "room-002-9",
            name: "Full Bathroom",
            type: "bathroom",
            sqft: 60,
            level: 2,
            description: "Full bathroom for upper floor",
          },
          {
            id: "room-002-10",
            name: "Half Bathroom",
            type: "bathroom",
            sqft: 30,
            level: 2,
            description: "Powder room",
          },
        ],
        description: "Three additional bedrooms and bathrooms",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-002-1",
        type: "school",
        name: "Palo Alto High School",
        distance: 0.5,
        rating: 4.8,
        description: "Top-rated public high school",
      },
      {
        id: "nf-002-2",
        type: "school",
        name: "Ohlone Elementary",
        distance: 0.3,
        rating: 4.6,
        description: "Excellent elementary school",
      },
      {
        id: "nf-002-3",
        type: "park",
        name: "Palo Alto Junior Museum & Zoo",
        distance: 1.2,
        rating: 4.4,
        description: "Family-friendly museum and zoo",
      },
      {
        id: "nf-002-4",
        type: "shopping",
        name: "Stanford Shopping Center",
        distance: 2.1,
        rating: 4.3,
        description: "Upscale shopping mall",
      },
    ],
    agent: "Michael Chen",
    agentEmail: "michael.chen@realestate.com",
    agentPhone: "(555) 234-5678",
    listedDate: "2025-07-15",
    updatedDate: "2025-08-10",
  },
  {
    id: "prop-003",
    title: "Luxury Condo with Bay Views",
    address: "789 Marina Boulevard",
    city: "San Francisco",
    state: "CA",
    zipCode: "94123",
    price: 1950000,
    type: "condo",
    status: "sold",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    yearBuilt: 2015,
    description:
      "Luxurious condo with stunning bay views, gourmet kitchen, and premium amenities.",
    features: [
      "Bay Views",
      "Gourmet Kitchen",
      "Concierge",
      "Fitness Center",
      "Rooftop Deck",
    ],
    images: [seven, eight, nine],
    floorPlans: [
      {
        id: "fp-003-1",
        level: 1,
        name: "Main Floor",
        sqft: 1600,
        rooms: [
          {
            id: "room-003-1",
            name: "Master Bedroom",
            type: "bedroom",
            sqft: 350,
            level: 1,
            description: "Spacious master with bay views",
          },
          {
            id: "room-003-2",
            name: "Bedroom 2",
            type: "bedroom",
            sqft: 280,
            level: 1,
            description: "Comfortable guest bedroom",
          },
          {
            id: "room-003-3",
            name: "Bedroom 3",
            type: "bedroom",
            sqft: 250,
            level: 1,
            description: "Third bedroom with built-ins",
          },
          {
            id: "room-003-4",
            name: "Living Room",
            type: "living",
            sqft: 400,
            level: 1,
            description: "Open living area with floor-to-ceiling windows",
          },
          {
            id: "room-003-5",
            name: "Kitchen",
            type: "kitchen",
            sqft: 180,
            level: 1,
            description: "Gourmet kitchen with premium appliances",
          },
          {
            id: "room-003-6",
            name: "Master Bathroom",
            type: "bathroom",
            sqft: 90,
            level: 1,
            description: "Luxury master bath with soaking tub",
          },
          {
            id: "room-003-7",
            name: "Guest Bathroom",
            type: "bathroom",
            sqft: 50,
            level: 1,
            description: "Full guest bathroom",
          },
        ],
        description: "Open concept luxury condo with premium finishes",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-003-1",
        type: "restaurant",
        name: "A16",
        distance: 0.2,
        rating: 4.5,
        description: "Award-winning Italian restaurant",
      },
      {
        id: "nf-003-2",
        type: "park",
        name: "Marina Green",
        distance: 0.3,
        rating: 4.6,
        description: "Scenic waterfront park",
      },
      {
        id: "nf-003-3",
        type: "shopping",
        name: "Chestnut Street Shopping",
        distance: 0.4,
        rating: 4.2,
        description: "Boutique shopping district",
      },
      {
        id: "nf-003-4",
        type: "transport",
        name: "Ferry Building",
        distance: 0.8,
        description: "Historic transit hub with markets",
      },
    ],
    agent: "Emily Rodriguez",
    agentEmail: "emily.rodriguez@realestate.com",
    agentPhone: "(555) 345-6789",
    listedDate: "2025-06-20",
    updatedDate: "2025-08-05",
  },
  {
    id: "prop-004",
    title: "Charming Victorian Townhouse",
    address: "321 Pine Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94109",
    price: 1650000,
    type: "townhouse",
    status: "available",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1800,
    yearBuilt: 1905,
    description:
      "Historic Victorian townhouse with modern updates, original details, and private garden.",
    features: [
      "Historic Details",
      "Private Garden",
      "Updated Plumbing",
      "Original Hardwood",
      "Bay Windows",
    ],

    images: [ten, one, two],
    floorPlans: [
      {
        id: "fp-004-1",
        level: 1,
        name: "Ground Floor",
        sqft: 900,
        rooms: [
          {
            id: "room-004-1",
            name: "Living Room",
            type: "living",
            sqft: 300,
            level: 1,
            description: "Spacious living room with original details",
          },
          {
            id: "room-004-2",
            name: "Dining Room",
            type: "dining",
            sqft: 200,
            level: 1,
            description: "Formal dining with bay windows",
          },
          {
            id: "room-004-3",
            name: "Kitchen",
            type: "kitchen",
            sqft: 150,
            level: 1,
            description: "Updated kitchen with modern appliances",
          },
          {
            id: "room-004-4",
            name: "Half Bathroom",
            type: "bathroom",
            sqft: 30,
            level: 1,
            description: "Powder room",
          },
        ],
        description: "Main living areas with historic charm",
      },
      {
        id: "fp-004-2",
        level: 2,
        name: "Upper Floor",
        sqft: 900,
        rooms: [
          {
            id: "room-004-5",
            name: "Master Bedroom",
            type: "bedroom",
            sqft: 350,
            level: 2,
            description: "Large master with city views",
          },
          {
            id: "room-004-6",
            name: "Bedroom 2",
            type: "bedroom",
            sqft: 250,
            level: 2,
            description: "Comfortable guest room",
          },
          {
            id: "room-004-7",
            name: "Bedroom 3",
            type: "bedroom",
            sqft: 220,
            level: 2,
            description: "Third bedroom with built-ins",
          },
          {
            id: "room-004-8",
            name: "Full Bathroom",
            type: "bathroom",
            sqft: 80,
            level: 2,
            description: "Full bathroom with clawfoot tub",
          },
        ],
        description: "Three bedrooms and full bathroom",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-004-1",
        type: "school",
        name: "Russian Hill Elementary",
        distance: 0.4,
        rating: 4.1,
        description: "Local public elementary school",
      },
      {
        id: "nf-004-2",
        type: "park",
        name: "Lyon Street Steps",
        distance: 0.2,
        rating: 4.3,
        description: "Historic staircase garden",
      },
      {
        id: "nf-004-3",
        type: "restaurant",
        name: "Foreign Cinema",
        distance: 0.6,
        rating: 4.4,
        description: "Popular farm-to-table restaurant",
      },
      {
        id: "nf-004-4",
        type: "transport",
        name: "California Street Cable Car",
        distance: 0.3,
        description: "Historic cable car line",
      },
    ],
    agent: "David Thompson",
    agentEmail: "david.thompson@realestate.com",
    agentPhone: "(555) 456-7890",
    listedDate: "2025-08-10",
    updatedDate: "2025-08-18",
  },
  {
    id: "prop-005",
    title: "Investment Opportunity",
    address: "654 Commercial Street",
    city: "San Jose",
    state: "CA",
    zipCode: "95112",
    price: 750000,
    type: "apartment",
    status: "available",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    yearBuilt: 2020,
    description:
      "Modern one-bedroom apartment in up-and-coming neighborhood, perfect for investors.",
    features: [
      "Modern Finishes",
      "Energy Efficient",
      "Close to Transit",
      "In-unit Laundry",
    ],

    images: [three, four, five],
    floorPlans: [
      {
        id: "fp-005-1",
        level: 1,
        name: "Main Floor",
        sqft: 650,
        rooms: [
          {
            id: "room-005-1",
            name: "Living Room",
            type: "living",
            sqft: 250,
            level: 1,
            description: "Open living area with modern design",
          },
          {
            id: "room-005-2",
            name: "Bedroom",
            type: "bedroom",
            sqft: 200,
            level: 1,
            description: "Comfortable bedroom with built-in storage",
          },
          {
            id: "room-005-3",
            name: "Kitchen",
            type: "kitchen",
            sqft: 120,
            level: 1,
            description: "Modern kitchen with energy-efficient appliances",
          },
          {
            id: "room-005-4",
            name: "Bathroom",
            type: "bathroom",
            sqft: 80,
            level: 1,
            description: "Full bathroom with walk-in shower",
          },
        ],
        description: "Efficient one-bedroom layout",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-005-1",
        type: "transport",
        name: "San Jose Diridon Station",
        distance: 0.5,
        description: "Major transit hub with Caltrain and light rail",
      },
      {
        id: "nf-005-2",
        type: "shopping",
        name: "Santana Row",
        distance: 1.8,
        rating: 4.4,
        description: "Upscale shopping and dining complex",
      },
      {
        id: "nf-005-3",
        type: "school",
        name: "Buchser Middle School",
        distance: 1.2,
        rating: 3.8,
        description: "Local public middle school",
      },
      {
        id: "nf-005-4",
        type: "restaurant",
        name: "The Table",
        distance: 0.8,
        rating: 4.2,
        description: "Popular American restaurant",
      },
    ],
    agent: "Lisa Park",
    agentEmail: "lisa.park@realestate.com",
    agentPhone: "(555) 567-8901",
    listedDate: "2025-08-12",
    updatedDate: "2025-08-18",
  },
  {
    id: "prop-006",
    title: "Waterfront Estate",
    address: "987 Lake Drive",
    city: "Los Altos",
    state: "CA",
    zipCode: "94024",
    price: 5200000,
    type: "house",
    status: "available",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    lotSize: 25000,
    yearBuilt: 2008,
    description:
      "Stunning waterfront estate with panoramic lake views, pool, and guest house.",
    features: [
      "Lake Views",
      "Swimming Pool",
      "Guest House",
      "Wine Cellar",
      "Smart Home",
    ],

    images: [six, seven, eight],
    floorPlans: [
      {
        id: "fp-006-1",
        level: 1,
        name: "Main Floor",
        sqft: 2500,
        rooms: [
          {
            id: "room-006-1",
            name: "Great Room",
            type: "living",
            sqft: 800,
            level: 1,
            description: "Expansive great room with lake views",
          },
          {
            id: "room-006-2",
            name: "Dining Room",
            type: "dining",
            sqft: 300,
            level: 1,
            description: "Formal dining with panoramic windows",
          },
          {
            id: "room-006-3",
            name: "Kitchen",
            type: "kitchen",
            sqft: 400,
            level: 1,
            description: "Gourmet kitchen with premium appliances",
          },
          {
            id: "room-006-4",
            name: "Master Suite",
            type: "bedroom",
            sqft: 500,
            level: 1,
            description: "Luxury master suite with spa bathroom",
          },
          {
            id: "room-006-5",
            name: "Office",
            type: "office",
            sqft: 250,
            level: 1,
            description: "Private home office",
          },
          {
            id: "room-006-6",
            name: "Wine Cellar",
            type: "other",
            sqft: 150,
            level: 1,
            description: "Temperature-controlled wine cellar",
          },
        ],
        description: "Main living areas with luxury amenities",
      },
      {
        id: "fp-006-2",
        level: 2,
        name: "Upper Floor",
        sqft: 2000,
        rooms: [
          {
            id: "room-006-7",
            name: "Bedroom 2",
            type: "bedroom",
            sqft: 350,
            level: 2,
            description: "Large guest bedroom with lake views",
          },
          {
            id: "room-006-8",
            name: "Bedroom 3",
            type: "bedroom",
            sqft: 300,
            level: 2,
            description: "Comfortable bedroom with en-suite",
          },
          {
            id: "room-006-9",
            name: "Bedroom 4",
            type: "bedroom",
            sqft: 280,
            level: 2,
            description: "Fourth bedroom with built-ins",
          },
          {
            id: "room-006-10",
            name: "Bedroom 5",
            type: "bedroom",
            sqft: 250,
            level: 2,
            description: "Fifth bedroom perfect for guests",
          },
          {
            id: "room-006-11",
            name: "Full Bathroom",
            type: "bathroom",
            sqft: 100,
            level: 2,
            description: "Full bathroom with double vanity",
          },
          {
            id: "room-006-12",
            name: "Full Bathroom",
            type: "bathroom",
            sqft: 80,
            level: 2,
            description: "Second full bathroom",
          },
          {
            id: "room-006-13",
            name: "Half Bathroom",
            type: "bathroom",
            sqft: 40,
            level: 2,
            description: "Powder room",
          },
        ],
        description: "Four additional bedrooms and three bathrooms",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-006-1",
        type: "school",
        name: "Bullis Charter School",
        distance: 1.5,
        rating: 4.7,
        description: "Highly rated K-8 charter school",
      },
      {
        id: "nf-006-2",
        type: "park",
        name: "Vasona Park",
        distance: 2.3,
        rating: 4.5,
        description: "Large regional park with lake and trails",
      },
      {
        id: "nf-006-3",
        type: "shopping",
        name: "Los Altos Town Center",
        distance: 3.1,
        rating: 4.3,
        description: "Upscale shopping and dining",
      },
      {
        id: "nf-006-4",
        type: "restaurant",
        name: "Kirk's Steakburgers",
        distance: 2.8,
        rating: 4.4,
        description: "Popular gourmet burger restaurant",
      },
    ],
    agent: "Robert Kim",
    agentEmail: "robert.kim@realestate.com",
    agentPhone: "(555) 678-9012",
    listedDate: "2025-07-01",
    updatedDate: "2025-08-14",
  },
  {
    id: "prop-007",
    title: "Cozy Starter Home",
    address: "147 Elm Street",
    city: "Mountain View",
    state: "CA",
    zipCode: "94041",
    price: 950000,
    type: "house",
    status: "pending",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    lotSize: 5000,
    yearBuilt: 1950,
    description:
      "Charming starter home with potential for expansion, in quiet neighborhood.",
    features: [
      "Detached Garage",
      "Fruit Trees",
      "Quiet Street",
      "Close to Schools",
    ],

    images: [nine, ten, one],
    floorPlans: [
      {
        id: "fp-007-1",
        level: 1,
        name: "Main Floor",
        sqft: 950,
        rooms: [
          {
            id: "room-007-1",
            name: "Living Room",
            type: "living",
            sqft: 300,
            level: 1,
            description: "Cozy living room with fireplace",
          },
          {
            id: "room-007-2",
            name: "Kitchen",
            type: "kitchen",
            sqft: 150,
            level: 1,
            description: "Updated kitchen with modern appliances",
          },
          {
            id: "room-007-3",
            name: "Master Bedroom",
            type: "bedroom",
            sqft: 250,
            level: 1,
            description: "Spacious master bedroom",
          },
          {
            id: "room-007-4",
            name: "Bedroom 2",
            type: "bedroom",
            sqft: 200,
            level: 1,
            description: "Comfortable second bedroom",
          },
          {
            id: "room-007-5",
            name: "Bathroom",
            type: "bathroom",
            sqft: 50,
            level: 1,
            description: "Full bathroom with shower",
          },
        ],
        description: "Cozy single-level home with great potential",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-007-1",
        type: "school",
        name: "Theuerkauf Elementary",
        distance: 0.3,
        rating: 4.5,
        description: "Highly rated public elementary school",
      },
      {
        id: "nf-007-2",
        type: "school",
        name: "Crittenden Middle School",
        distance: 0.8,
        rating: 4.2,
        description: "Local public middle school",
      },
      {
        id: "nf-007-3",
        type: "park",
        name: "Rengstorff Park",
        distance: 1.2,
        rating: 4.3,
        description: "Large community park with trails",
      },
      {
        id: "nf-007-4",
        type: "shopping",
        name: "Palo Alto Square",
        distance: 2.1,
        rating: 4.1,
        description: "Local shopping center",
      },
    ],
    agent: "Jennifer Wu",
    agentEmail: "jennifer.wu@realestate.com",
    agentPhone: "(555) 789-0123",
    listedDate: "2025-08-05",
    updatedDate: "2025-08-16",
  },
  {
    id: "prop-008",
    title: "Penthouse Suite",
    address: "852 High Rise Plaza",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    price: 3200000,
    type: "condo",
    status: "available",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    yearBuilt: 2019,
    description:
      "Exclusive penthouse with 360-degree city views, private elevator, and luxury finishes.",
    features: [
      "City Views",
      "Private Elevator",
      "Wine Storage",
      "Concierge",
      "Valet Parking",
    ],

    images: [two, three, four],
    floorPlans: [
      {
        id: "fp-008-1",
        level: 1,
        name: "Penthouse Floor",
        sqft: 2200,
        rooms: [
          {
            id: "room-008-1",
            name: "Master Bedroom",
            type: "bedroom",
            sqft: 400,
            level: 1,
            description: "Luxury master suite with city views",
          },
          {
            id: "room-008-2",
            name: "Bedroom 2",
            type: "bedroom",
            sqft: 300,
            level: 1,
            description: "Spacious guest bedroom",
          },
          {
            id: "room-008-3",
            name: "Bedroom 3",
            type: "bedroom",
            sqft: 280,
            level: 1,
            description: "Third bedroom with built-ins",
          },
          {
            id: "room-008-4",
            name: "Living Room",
            type: "living",
            sqft: 500,
            level: 1,
            description: "Expansive living area with panoramic views",
          },
          {
            id: "room-008-5",
            name: "Dining Room",
            type: "dining",
            sqft: 200,
            level: 1,
            description: "Formal dining with city views",
          },
          {
            id: "room-008-6",
            name: "Kitchen",
            type: "kitchen",
            sqft: 180,
            level: 1,
            description: "Gourmet kitchen with premium appliances",
          },
          {
            id: "room-008-7",
            name: "Master Bathroom",
            type: "bathroom",
            sqft: 120,
            level: 1,
            description: "Luxury spa bathroom",
          },
          {
            id: "room-008-8",
            name: "Bathroom 2",
            type: "bathroom",
            sqft: 80,
            level: 1,
            description: "Full guest bathroom",
          },
          {
            id: "room-008-9",
            name: "Powder Room",
            type: "bathroom",
            sqft: 40,
            level: 1,
            description: "Half bathroom for guests",
          },
        ],
        description: "Exclusive penthouse with premium finishes and views",
      },
    ],
    nearbyFeatures: [
      {
        id: "nf-008-1",
        type: "restaurant",
        name: "Loló",
        distance: 0.2,
        rating: 4.6,
        description: "Award-winning Mexican restaurant",
      },
      {
        id: "nf-008-2",
        type: "shopping",
        name: "Westfield San Francisco Centre",
        distance: 0.8,
        rating: 4.3,
        description: "Major shopping mall",
      },
      {
        id: "nf-008-3",
        type: "transport",
        name: "Montgomery Street BART",
        distance: 0.4,
        description: "Direct access to public transportation",
      },
      {
        id: "nf-008-4",
        type: "restaurant",
        name: "Zazie",
        distance: 0.3,
        rating: 4.4,
        description: "Popular French bistro",
      },
    ],
    agent: "Mark Johnson",
    agentEmail: "mark.johnson@realestate.com",
    agentPhone: "(555) 890-1234",
    listedDate: "2025-08-08",
    updatedDate: "2025-08-17",
  },
];

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  inquiryType: "general" | "showing" | "offer" | "question";
  status: "new" | "contacted" | "scheduled" | "closed";
  createdAt: string;
  updatedAt: string;
}

export const propertyInquiries: PropertyInquiry[] = [
  {
    id: "inq-001",
    propertyId: "prop-001",
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "(555) 111-2222",
    message: "I'm interested in scheduling a showing for this loft.",
    inquiryType: "showing",
    status: "scheduled",
    createdAt: "2025-08-15T10:30:00Z",
    updatedAt: "2025-08-16T14:20:00Z",
  },
  {
    id: "inq-002",
    propertyId: "prop-004",
    customerName: "Maria Garcia",
    customerEmail: "maria.garcia@email.com",
    customerPhone: "(555) 333-4444",
    message: "Is this townhouse still available? I'd like to make an offer.",
    inquiryType: "offer",
    status: "contacted",
    createdAt: "2025-08-16T09:15:00Z",
    updatedAt: "2025-08-17T11:45:00Z",
  },
  {
    id: "inq-003",
    propertyId: "prop-006",
    customerName: "David Wilson",
    customerEmail: "david.wilson@email.com",
    customerPhone: "(555) 555-6666",
    message: "Can you tell me more about the waterfront features?",
    inquiryType: "question",
    status: "new",
    createdAt: "2025-08-17T16:20:00Z",
    updatedAt: "2025-08-17T16:20:00Z",
  },
];

export const realEstateCharts = {
  propertiesByType: [
    { name: "Houses", value: 45, color: "#0088FE" },
    { name: "Condos", value: 30, color: "#00C49F" },
    { name: "Apartments", value: 15, color: "#FFBB28" },
    { name: "Townhouses", value: 8, color: "#FF8042" },
    { name: "Land", value: 2, color: "#8884D8" },
  ],
  propertiesByStatus: [
    { name: "Available", value: 60 },
    { name: "Pending", value: 25 },
    { name: "Sold", value: 12 },
    { name: "Off Market", value: 3 },
  ],
  priceRanges: [
    { range: "Under $500K", count: 15 },
    { range: "$500K - $1M", count: 35 },
    { range: "$1M - $2M", count: 28 },
    { range: "$2M - $5M", count: 18 },
    { range: "Over $5M", count: 4 },
  ],
};
