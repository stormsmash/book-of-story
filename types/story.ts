export interface Photo {
  id: string;
  albumId: string;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
}

export interface Story {
  id: string;
  imageUrl: string; // Cover image
  story: string; // Description
  title: string;
  themeColor?: string; // Hex color or CSS color
  createdAt: Date;
  updatedAt: Date;
  photos?: Photo[]; // Array of photos in the album
  photoCount?: number; // Number of photos in the album
}

export interface StoryFormData {
  imageFile?: File; // Cover image file
  story: string;
  title: string;
  themeColor?: string;
}

export interface PhotoFormData {
  imageFile: File;
  caption?: string;
}
