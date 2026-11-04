export type ProductCategory = 
  | 'Audio'
  | 'Workspace'
  | 'Coffee & Kitchen'
  | 'Ergonomics'
  | 'Smart Living'
  | 'Accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  rating: number; // average public rating
  reviewsCount: number;
  shortDesc: string;
  description: string;
  tags: string[];
  brand: string;
  specs: Record<string, string>;
  accentColor: string;
  bgGradient: string;
  iconName: string;
  // Normalized vector for content-based matching
  features: {
    categoryWeight: Record<ProductCategory, number>;
    priceNormalized: number; // 0 to 1
    tagsVector: Record<string, number>;
    styleVector: {
      minimalist: number;
      technical: number;
      artisanal: number;
      luxury: number;
      ergonomic: number;
    };
  };
}

export interface UserPersona {
  id: string;
  name: string;
  title: string;
  avatarSeed: string;
  bio: string;
  preferredCategories: ProductCategory[];
  priceSensitivity: 'budget' | 'balanced' | 'premium';
  isColdStart?: boolean;
}

export type EventType = 
  | 'view'
  | 'click'
  | 'dwell'
  | 'cart_add'
  | 'purchase'
  | 'rating';

export interface InteractionEvent {
  id: string;
  timestamp: number;
  userId: string;
  productId: string;
  productName: string;
  type: EventType;
  dwellSeconds?: number;
  ratingValue?: number; // 1-5
  details?: string;
  implicitScore: number;
}

export type RatingMatrix = Record<string, Record<string, number>>;

export interface RecommendationResult {
  product: Product;
  score: number; // 0 to 1 or predicted rating 1 to 5
  algorithm: 'collaborative_user' | 'collaborative_item' | 'content_based' | 'hybrid';
  reason: string;
  metrics?: {
    userSimilarity?: number;
    itemSimilarity?: number;
    contentCosine?: number;
    cfScore?: number;
    cbScore?: number;
    topMatchingFeature?: string;
  };
}

export interface UserSimilarityBreakdown {
  targetUserId: string;
  neighborUserId: string;
  neighborName: string;
  similarity: number;
  coRatedCount: number;
  coRatedItems: {
    productId: string;
    productName: string;
    targetRating: number;
    neighborRating: number;
  }[];
}

export interface PredictionTrace {
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  algorithm: 'ubcf' | 'ibcf';
  targetUserMean: number;
  numerator: number;
  denominator: number;
  predictedRating: number;
  neighbors: {
    id: string;
    name: string;
    similarity: number;
    rating: number;
    meanRating: number;
    deviation: number;
    contribution: number;
  }[];
}

export interface RecsysBenchmark {
  algorithm: string;
  precisionAtK: number;
  recallAtK: number;
  f1AtK: number;
  ndcgAtK: number;
  mapAtK: number;
  rmse: number;
  catalogCoverage: number; // percentage 0-100
  diversityScore: number; // 0-1
}
