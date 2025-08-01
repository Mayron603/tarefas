'use server';

import { suggestOptimalTaskDistribution } from '@/ai/flows/suggest-optimal-task-distribution';
import type { SuggestOptimalTaskDistributionInput } from '@/ai/flows/suggest-optimal-task-distribution';

export async function getTaskDistributionSuggestions(
  input: SuggestOptimalTaskDistributionInput
) {
  try {
    const suggestions = await suggestOptimalTaskDistribution(input);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get AI suggestions. Please check the AI flow configuration.' };
  }
}
