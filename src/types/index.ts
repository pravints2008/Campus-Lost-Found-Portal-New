export type ItemCategory = 
  | 'ID Card' 
  | 'Water Bottle' 
  | 'Books' 
  | 'Wallet' 
  | 'Earphones' 
  | 'Keys' 
  | 'Others';

export type LocationType = 
  | 'Classroom' 
  | 'Library' 
  | 'Canteen' 
  | 'Laboratory' 
  | 'Hostel' 
  | 'Other';

export type ReportType = 'lost' | 'found';

export type ItemStatus = 'Open' | 'Pending' | 'Returned';

export type UserRole = 'student' | 'admin' | 'staff';

export interface UserProfile {
  id: string;
  full_name: string;
  student_id: string;
  department: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LostFoundItem {
  id: string;
  user_id: string;
  type: ReportType;
  title: string;
  category: ItemCategory;
  color: string;
  location: LocationType;
  date: string; // YYYY-MM-DD
  description: string;
  image_url?: string;
  imageUrl?: string; // camelCase compatibility
  status: ItemStatus;
  reporter_name: string;
  reporterName?: string; // camelCase compatibility
  reporter_student_id?: string;
  reporterStudentId?: string; // camelCase compatibility
  reporter_contact_hidden?: string;
  reporterContactHidden?: string; // camelCase compatibility
  return_date?: string;
  returnDate?: string;
  created_at: string;
  createdAt?: string;
  updated_at?: string;
}

export interface ClaimRequest {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  claimant_id: string;
  message: string;
  status: 'Pending Verification' | 'Approved' | 'Resolved';
  created_at: string;
  lost_item?: LostFoundItem;
  found_item?: LostFoundItem;
  claimant?: UserProfile;
}

export interface MatchResult {
  lostItem: LostFoundItem;
  foundItem: LostFoundItem;
  matchScore: number; // 0 - 100
  matchedFields: {
    category: boolean;
    color: boolean;
    location: boolean;
    title: boolean;
    dateProximity: boolean;
  };
  reasons: string[];
}
