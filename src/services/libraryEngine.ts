import { aiCore } from '../lib/ai/aiCore';
import { LibraryTemplate, User, BusinessDNA } from '../types';
import { initialLibraryTemplates } from '../data/libraryData';

export const libraryEngine = {
  getAllTemplates(): LibraryTemplate[] {
    return initialLibraryTemplates;
  },

  recommendTemplatesForUser(user: User, businessDNA: BusinessDNA | null, history: any[]): LibraryTemplate[] {
    const all = this.getAllTemplates();
    if (!businessDNA) {
       // Return some general mixed ones
       return all.filter(t => t.niche.includes('geral')).slice(0, 10);
    }
    
    const userNiche = businessDNA.basics?.niche?.toLowerCase() || '';
    
    // Sort by niche match first
    let recommended = all.filter(t => t.niche.some(n => userNiche.includes(n)) || t.niche.includes(userNiche));
    
    if (recommended.length === 0) {
      recommended = all.filter(t => t.niche.includes('geral'));
    }

    return recommended.slice(0, 15);
  },

  async adaptTemplateToDNA(template: LibraryTemplate, context: any, user: User) {
    const aiResponse = await aiCore.runAIAction('library_adapt_to_dna', {
      module: 'library',
      templateTitle: template.title,
      templateContent: template.templateContent,
      objective: context.objective || template.objective
    }, user);
    
    return aiResponse;
  },

  validateTemplateQuality(template: Partial<LibraryTemplate>): number {
     let score = 50;
     if (template.objective) score += 10;
     if (template.problemSolved) score += 10;
     if (template.templateContent && template.templateContent.length > 20) score += 20;
     if (template.channel) score += 10;
     return score;
  }
};
