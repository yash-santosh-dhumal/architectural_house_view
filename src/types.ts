export type AIModel = 'claude-3.5-sonnet' | 'gemini-1.5-pro' | 'gpt-4o-mini';

export interface RenderMetadata {
  id: string;
  title: string;
  prompt: string;
  style: string;
  model: AIModel;
  createdAt: string;
  sourcePlanName: string;
  sourcePlanUrl: string;
  renderImageUrl: string;
  renderSummary: string;
  author: string;
  likes: number;
}

export interface GenerationInput {
  title: string;
  prompt: string;
  style: string;
  model: AIModel;
  sourcePlan: File;
  author: string;
}
