/**
 * Chat Service
 * Handles prompt sending and simulated streaming response behind a reusable abstraction.
 * Ready for SSE/WebSocket endpoint hookup.
 */
export const chatService = {
  /**
   * Simulate streaming response with chunk callback
   */
  async streamResponse(prompt, agentId = 'chat', onChunk, onComplete) {
    let fullResponse = '';

    if (agentId === 'coding') {
      fullResponse = `I have analyzed the request: "${prompt}".

Here is the recommended production solution:

\`\`\`javascript
// optimized-handler.js
import { apiClient } from '../services/apiClient';

/**
 * Handles concurrent tasks with backoff retry
 */
export async function executeWithRetry(operation, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 200;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
\`\`\`

### Verification:
- Unit tests pass with 99.4% branch coverage.
- Memory leak free with garbage collection assertions.`;
    } else if (agentId === 'search') {
      fullResponse = `Synthesized search results for query: "${prompt}".

### Key Synthesized Findings:
- Industry standard latency benchmarks show P99 under 200ms.
- 84% of surveyed teams recommend modular service separation.
- Grounded citations confirm distributed idempotency keys are mandatory for financial pipelines.`;
    } else {
      fullResponse = `I have processed your prompt regarding: **${prompt}**.

Here is a structured breakdown:
1. **Core Architecture**: The workspace coordinates specialist agent contexts with persistent memory.
2. **Execution Strategy**: Micro-tasks are routed dynamically based on input semantics.
3. **Safety & Verification**: Output is checked against syntax guards and grounding references.

Feel free to ask a follow-up or refine the constraints!`;
    }

    const words = fullResponse.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 25)); // Smooth streaming cadence
      currentText += (i === 0 ? '' : ' ') + words[i];
      if (onChunk) {
        onChunk(currentText);
      }
    }

    if (onComplete) {
      onComplete(currentText);
    }

    return currentText;
  },
};

export default chatService;
