export interface HFModel {
  id: string;
  author: string;
  title: string;
  description: string;
  url: string;
  lastModified: string;
  model_type: string;
  base_model: string[];
  likes?: number;
  downloads?: number;
  tags?: string[];
}

export interface HFDataset {
  id: string;
  author: string;
  title: string;
  description?: string;
  url: string;
  lastModified: string;
  likes?: number;
  downloads?: number;
  tags?: string[];
}

export interface GithubRepo {
  title: string;
  description: string;
  url: string;
  demo?: string;
  post?: string;
  lastModified: string;
  author: string;
  tags?: string[];
  license?: string;
} 