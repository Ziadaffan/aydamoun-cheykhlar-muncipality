export interface NewsTag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string[];
  category: NewsCategory;
  author: string;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type NewsCategory =
  | 'MUNICIPAL_NEWS'
  | 'DEVELOPMENT_PROJECTS'
  | 'ANNOUNCEMENTS'
  | 'COMMUNITY_EVENTS'
  | 'INFRASTRUCTURE'
  | 'ENVIRONMENTAL'
  | 'SOCIAL_SERVICES'
  | 'HEALTH_AND_SOCIAL_SERVICES'
  | 'OTHER';

export interface NewsCardProps {
  news: News;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export interface NewsGridProps {
  news: News[];
  variant?: 'grid' | 'list';
  className?: string;
}

export interface NewsFiltersProps {
  categories: NewsCategory[];
  selectedCategory: NewsCategory | 'ALL';
  onCategoryChange: (category: NewsCategory | 'ALL') => void;
  className?: string;
}
