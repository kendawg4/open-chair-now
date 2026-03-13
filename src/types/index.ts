export type AvailabilityStatus =
  | "open-chair"
  | "available-now"
  | "last-minute"
  | "appointment-only"
  | "busy"
  | "offline";

export type ProfessionalCategory =
  | "barber"
  | "hairstylist"
  | "braider"
  | "loc-specialist"
  | "nail-tech"
  | "esthetician"
  | "lash-tech"
  | "makeup-artist"
  | "tattoo-artist"
  | "piercer";

export type BusinessType = "independent" | "booth-renter" | "shop-employee" | "shop-owner";

export interface Professional {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  category: ProfessionalCategory;
  specialties: string[];
  businessType: BusinessType;
  shopName?: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  followerCount: number;
  yearsExperience: number;
  status: AvailabilityStatus;
  statusNote?: string;
  bio: string;
  languages: string[];
  portfolio: string[];
  services: Service[];
  nextAvailable?: string;
  promo?: string;
  verified: boolean;
  instagram?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  description?: string;
  instantBook: boolean;
}

export interface Review {
  id: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  text: string;
  date: string;
  tags: string[];
  verified: boolean;
}

export interface FeedPost {
  id: string;
  proId: string;
  proName: string;
  proAvatar: string;
  proCategory: ProfessionalCategory;
  type: "work" | "promo" | "opening" | "announcement";
  image?: string;
  text: string;
  likes: number;
  timestamp: string;
  status?: AvailabilityStatus;
}
