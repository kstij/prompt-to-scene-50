import { EnhancedPrompt } from './geminiService';

export interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl: string;
  metadata: {
    duration: number;
    resolution: string;
    style: string;
    generatedAt: string;
  };
}

export class VideoGenerationService {
  private static instance: VideoGenerationService;
  
  public static getInstance(): VideoGenerationService {
    if (!VideoGenerationService.instance) {
      VideoGenerationService.instance = new VideoGenerationService();
    }
    return VideoGenerationService.instance;
  }

  async generateVideo(
    enhancedPrompt: EnhancedPrompt,
    model: string = 'runway-gen4'
  ): Promise<VideoGenerationResult> {
    // Simulate video generation API call
    const generationTime = this.getGenerationTime(model);
    await new Promise(resolve => setTimeout(resolve, generationTime));
    
    // Mock video result
    const mockVideoId = Math.random().toString(36).substring(7);
    
    return {
      videoUrl: `/api/placeholder/640/360?video=${mockVideoId}`,
      thumbnailUrl: `/api/placeholder/640/360?thumb=${mockVideoId}`,
      metadata: {
        duration: enhancedPrompt.videoParameters.duration,
        resolution: enhancedPrompt.videoParameters.resolution,
        style: enhancedPrompt.videoParameters.style,
        generatedAt: new Date().toISOString()
      }
    };
  }

  private getGenerationTime(model: string): number {
    const times: Record<string, number> = {
      'runway-gen4': 8000,    // 8 seconds
      'veo3': 6000,           // 6 seconds
      'banana': 5000,         // 5 seconds
      'custom': 10000         // 10 seconds
    };
    
    return times[model] || 8000;
  }

  getModelDisplayName(modelId: string): string {
    const models: Record<string, string> = {
      'runway-gen4': 'Runway Gen-4 Turbo',
      'veo3': 'Veo3',
      'banana': 'Banana',
      'custom': 'Custom API'
    };
    
    return models[modelId] || 'Runway Gen-4 Turbo';
  }
}