
export type Language = 'en' | 'am' | 'or' | 'ti';

export interface NGO {
  id: string;
  name: string;
  licenseNo: string;
  description: string;
  logo: string;
  coverImage?: string;
  telebirrMerchantId?: string;
  isVerified: boolean;
  isSuspended: boolean;
  isFeatured: boolean;
  totalRaised: number;
  joinedDate: string;
}

export interface Project {
  id: string;
  ngoId: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  goalAmount: number;
  raisedAmount: number;
  images: string[];
  category: 'Health' | 'Education' | 'Emergency' | 'Environment' | 'Water';
  isFeatured: boolean;
  donorsCount: number;
  status: 'active' | 'completed' | 'urgent';
  isArchived?: boolean;
}

export interface Broadcast {
  id: string;
  title: Record<Language, string>;
  message: Record<Language, string>;
  date: string;
  type: 'info' | 'urgent' | 'success';
  isPinned?: boolean;
}

export interface Donation {
  id: string;
  projectId: string;
  ngoId: string;
  amount: number;
  serviceFee: number;
  total: number;
  date: string;
  type: 'one-time' | 'recurring';
  status: 'success' | 'pending' | 'failed';
  donorName: string;
  donorPhone: string;
}

export interface Subscription {
  id: string;
  projectId: string;
  ngoId: string; // Added ngoId for institutional mapping
  amount: number;
  nextPaymentDate: string;
  status: 'active' | 'cancelled';
}

export interface TranslationSet {
  home: string;
  myDonations: string;
  about: string;
  notifications: string;
  oneTime: string;
  monthly: string;
  donate: string;
  verified: string;
  raisedOf: string;
  serviceFeeLabel: string;
  totalLabel: string;
  confirmDonation: string;
  ngoInstitution: string;
  topDonors: string;
  manageSubscription: string;
  adminLogin: string;
  enterOtp: string;
  searchPlaceholder: string;
  donateToNgo: string;
  receipt: string;
  transactionId: string;
  date: string;
  beneficiary: string;
  close: string;
  completedTitle: string;
  welcome: string;
  featuredOperations: string;
  browseNgos: string;
  topPriority: string;
  target: string;
  details: string;
  impactMade: string;
  celebrationSub: string;
  done: string;
  officialUpdates: string;
  noUpdates: string;
  partnerOrg: string;
  impactRaised: string;
  theOperation: string;
  recentDonors: string;
  verifiedGift: string;
  successTransfer: string;
  activeOperations: string;
  etbImpact: string;
  allProjects: string;
  funded: string;
  donationHistory: string;
  noGifts: string;
  grossTotal: string;
  includesFee: string;
  platformRules: string;
  agreementReq: string;
  acceptContinue: string;
  termsSmallPrint: string;
  activeStatus: string;
  nextPayment: string;
  cancel: string;
  supportGift: string;
  finalTotal: string;
  confirmPay: string;
  goBack: string;
  recipientInst: string;
  amountEtb: string;
  manage: string; // Added for UI
  subDetails: string; // Added for UI
  recurringSub: string; // Added for UI
  cancelSuccess: string; // Added for UI
}
