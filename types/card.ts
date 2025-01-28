export interface CardData {
  id: string;
  dateCreated: string;
  title: string;
  author: string;
  tags: string[];
  description: string;
  previewImage: string;
  url: string;
  rank?: number;
  views?: number;
  likes?: number;

  isBookmarked: boolean;
}

