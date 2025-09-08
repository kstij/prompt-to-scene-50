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

export interface GeminiChatResponse {
  response: string;
  shouldGenerateVideo: boolean;
  enhancedPrompt?: EnhancedPrompt;
}

export class GeminiService {
  private static instance: GeminiService;
  
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async getChatResponse(
    userMessage: string,
    conversationHistory: string[] = []
  ): Promise<GeminiChatResponse> {
    const delay = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const lowerMessage = userMessage.toLowerCase();
    const fullContext = conversationHistory.join(' ').toLowerCase();
    
    // Determine if this is a video generation request
    const isVideoRequest = this.isVideoGenerationRequest(userMessage, conversationHistory);
    
    if (isVideoRequest) {
      const enhancedPrompt = await this.enhancePrompt(userMessage, conversationHistory);
      return {
        response: `Great idea! I'll create a video with: "${enhancedPrompt.enhancedPrompt}". Let me generate that for you!`,
        shouldGenerateVideo: true,
        enhancedPrompt
      };
    } else {
      // Conversational response
      const response = this.generateConversationalResponse(userMessage, conversationHistory);
      return {
        response,
        shouldGenerateVideo: false
      };
    }
  }

  private isVideoGenerationRequest(message: string, history: string[]): boolean {
    const lowerMessage = message.toLowerCase();
    const videoKeywords = [
      'make', 'create', 'generate', 'video', 'show', 'animate', 'dancing', 'running',
      'flying', 'swimming', 'jumping', 'walking', 'scene', 'movie', 'clip'
    ];
    
    const hasVideoKeyword = videoKeywords.some(keyword => lowerMessage.includes(keyword));
    const isModification = lowerMessage.includes('add') || lowerMessage.includes('change') || 
                          lowerMessage.includes('modify') || lowerMessage.includes('include');
    
    // If it's a modification and we have previous context, it's likely a video request
    if (isModification && history.length > 0) {
      return true;
    }
    
    return hasVideoKeyword;
  }

  private generateConversationalResponse(message: string, history: string[]): string {
    const lowerMessage = message.toLowerCase();
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your AI video creation assistant. What kind of video would you like to create today? I can help you with anything from dancing animals to stunning landscapes!";
    }
    
    // Questions about capabilities
    if (lowerMessage.includes('what can you do') || lowerMessage.includes('help')) {
      return "I can help you create amazing videos! Just tell me what you'd like to see - like 'a frog dancing in the rain' or 'peaceful mountains at sunrise'. I can also refine and modify videos based on your feedback. What sounds interesting to you?";
    }
    
    // Clarifying questions
    if (lowerMessage.includes('add') || lowerMessage.includes('include')) {
      if (history.length === 0) {
        return "I'd love to help you add something! But I need to know what video we're working with first. Could you describe the base video you'd like me to create?";
      } else {
        return "Interesting! I can definitely add that to our video concept. Should I go ahead and create the enhanced version now?";
      }
    }
    
    // Default encouraging response
    return "That sounds creative! Would you like me to create a video based on that idea? I can make it really engaging with professional cinematic quality.";
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