import { SAMPLE_PPT_DECK, SAMPLE_PDF_DOC, SAMPLE_IMAGE_RESULTS, SAMPLE_SEARCH_RESULTS } from '../mocks/mockData';

export const agentService = {
  /**
   * PPT Agent: Generate Presentation Deck
   */
  async generatePresentation({ topic, audience, slidesCount, tone }, onProgress) {
    const stages = [
      'Structuring presentation outline & narrative arc...',
      'Extracting key takeaways & visual hierarchy...',
      'Generating slide layouts & code/metric diagrams...',
      'Polishing typography & finalizing deck...',
    ];

    for (let i = 0; i < stages.length; i++) {
      if (onProgress) onProgress(stages[i], ((i + 1) / stages.length) * 100);
      await new Promise((r) => setTimeout(r, 450));
    }

    return {
      ...SAMPLE_PPT_DECK,
      topic: topic || SAMPLE_PPT_DECK.topic,
      audience: audience || SAMPLE_PPT_DECK.audience,
      slidesCount: slidesCount || SAMPLE_PPT_DECK.slidesCount,
      tone: tone || SAMPLE_PPT_DECK.tone,
      createdAt: 'Just now',
    };
  },

  /**
   * PDF Agent: Query Document
   */
  async queryPdf(documentId, question, onChunk) {
    const answer = `Based on **Page 18, Chapter 4** of the uploaded document:

The implementation details for **"${question}"** specify:
1. **Dynamic Virtual Nodes**: Consistent hashing ring uses 160 v-nodes per physical instance.
2. **Replication Strategy**: Key ranges replicate in a clockwise direction to 3 successive distinct racks.
3. **Recovery SLA**: Node failure failover completes in under 450ms without data loss.`;

    const words = answer.split(' ');
    let text = '';
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 20));
      text += (i === 0 ? '' : ' ') + words[i];
      if (onChunk) onChunk(text);
    }

    return {
      id: 'pdf-qa-' + Date.now(),
      question,
      answer: text,
      pageRef: 'Page 18',
    };
  },

  /**
   * Image Agent: Generate Images
   */
  async generateImages({ prompt, style, aspectRatio, count = 1 }) {
    await new Promise((r) => setTimeout(r, 1200)); // Simulate diffusion inference
    const images = [];
    const seedUrls = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    ];

    for (let i = 0; i < count; i++) {
      images.push({
        id: 'gen-img-' + Date.now() + '-' + i,
        prompt: prompt || 'Abstract cybernetic visual art',
        style: style || 'Cinematic 3D',
        aspect: aspectRatio || '16:9',
        timestamp: 'Just now',
        url: seedUrls[i % seedUrls.length],
        tags: ['Generated', style || 'Digital', 'Demo Result'],
      });
    }

    return images;
  },

  /**
   * Search Agent: Web Research
   */
  async performSearch(query, onStatusChange) {
    const steps = [
      'Querying live web indices & academic registries...',
      'Parsing source documents & cross-referencing citations...',
      'Synthesizing consensus report & executive findings...',
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onStatusChange) onStatusChange(steps[i]);
      await new Promise((r) => setTimeout(r, 400));
    }

    return {
      ...SAMPLE_SEARCH_RESULTS,
      query: query || SAMPLE_SEARCH_RESULTS.query,
    };
  },
};

export default agentService;
