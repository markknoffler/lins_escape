export type SceneId = 
  | 'cafe' 
  | 'beach' 
  | 'mountains' 
  | 'night_city' 
  | 'blossom_meadow';

export interface SceneConfig {
  id: SceneId;
  name: string;
  subtitle: string;
  bgImage: string;
  ambientType: 'rain' | 'waves' | 'fire' | 'cafe' | 'city' | 'wind';
  themeColor: string;
  tagline: string;
  details: string;
}

export type MoodType = 
  | 'exhausted' 
  | 'sad' 
  | 'annoyed' 
  | 'meh' 
  | 'overthinking' 
  | 'peace';

export interface CareNote {
  id: number;
  text: string;
  subtext?: string;
  category: 'funny' | 'warm' | 'survival' | 'kdrama';
}
