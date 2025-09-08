export interface EnhancedPrompt {
  originalPrompt: string;
  enhancedPrompt: string;
  videoParameters: {
    style: string;
    duration: number;
    resolution: string;
    motionIntensity: 'low' | 'medium' | 'high';
  };
}

export class GeminiService {
  private static instance: GeminiService;
  
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async enhancePrompt(
    userPrompt: string, 
    conversationHistory: string[] = []
  ): Promise<EnhancedPrompt> {
    // Simulate Gemini API call for prompt enhancement
    const delay = Math.random() * 1000 + 500; // 500-1500ms delay
    await new Promise(resolve => setTimeout(resolve, delay));

    // Enhanced prompt generation based on user input
    const enhancedPrompt = this.generateEnhancedPrompt(userPrompt, conversationHistory);
    
    return {
      originalPrompt: userPrompt,
      enhancedPrompt: enhancedPrompt.text,
      videoParameters: enhancedPrompt.parameters
    };
  }

  private generateEnhancedPrompt(userPrompt: string, history: string[]) {
    const lowerPrompt = userPrompt.toLowerCase();
    
    // Analyze context from conversation history
    const context = history.join(' ').toLowerCase();
    const hasAnimal = /frog|cow|dog|cat|bird|fish|elephant|lion|tiger/.test(lowerPrompt + ' ' + context);
    const hasAction = /dancing|running|flying|swimming|jumping|walking/.test(lowerPrompt + ' ' + context);
    const hasEnvironment = /forest|city|ocean|space|mountain|desert|jungle/.test(lowerPrompt + ' ' + context);
    
    let enhancedText = userPrompt;
    let style = 'cinematic';
    let motionIntensity: 'low' | 'medium' | 'high' = 'medium';
    
    // Enhance based on content analysis
    if (hasAnimal && hasAction) {
      enhancedText = `Cinematic shot of ${userPrompt}, professional lighting, smooth motion, vibrant colors, high detail, 4K quality`;
      motionIntensity = 'high';
      style = 'realistic';
    } else if (lowerPrompt.includes('abstract') || lowerPrompt.includes('geometric')) {
      enhancedText = `Abstract artistic ${userPrompt}, fluid motion, gradient colors, mesmerizing patterns, smooth transitions`;
      style = 'abstract';
      motionIntensity = 'medium';
    } else if (hasEnvironment) {
      enhancedText = `Beautiful ${userPrompt}, golden hour lighting, atmospheric depth, cinematic composition, ultra-detailed`;
      style = 'landscape';
      motionIntensity = 'low';
    } else {
      enhancedText = `Professional ${userPrompt}, cinematic quality, dynamic composition, vibrant colors, smooth motion`;
    }
    
    // Add refinements based on conversation history
    if (history.length > 0) {
      const lastContext = history[history.length - 1];
      if (lastContext.includes('add') || lastContext.includes('include')) {
        enhancedText += ', seamlessly integrated with existing elements';
      }
    }
    
    return {
      text: enhancedText,
      parameters: {
        style,
        duration: hasAction ? 8 : 5,
        resolution: '1920x1080',
        motionIntensity
      }
    };
  }

  async refineExistingVideo(
    originalPrompt: string,
    refinementPrompt: string,
    conversationHistory: string[]
  ): Promise<EnhancedPrompt> {
    const delay = Math.random() * 800 + 400;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Combine original context with refinement
    const combinedPrompt = `${originalPrompt}, ${refinementPrompt}`;
    const fullHistory = [...conversationHistory, originalPrompt];
    
    return this.enhancePrompt(combinedPrompt, fullHistory);
  }
}