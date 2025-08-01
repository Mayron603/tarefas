'use server';

/**
 * @fileOverview An AI agent that suggests optimal task distribution among team members.
 *
 * - suggestOptimalTaskDistribution - A function that suggests optimal task distribution.
 * - SuggestOptimalTaskDistributionInput - The input type for the suggestOptimalTaskDistribution function.
 * - SuggestOptimalTaskDistributionOutput - The return type for the suggestOptimalTaskDistribution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalTaskDistributionInputSchema = z.object({
  tasks: z
    .array(
      z.object({
        name: z.string().describe('The name of the task.'),
        description: z.string().describe('A detailed description of the task.'),
        deadline: z.string().describe('The deadline for the task (ISO format).'),
        priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the task.'),
      })
    )
    .describe('A list of tasks to be distributed.'),
  teamMembers: z
    .array(
      z.object({
        name: z.string().describe('The name of the team member.'),
        skills: z.array(z.string()).describe('A list of skills the team member possesses.'),
        availability: z.string().describe('The team member availability (e.g., hours per week).'),
        currentWorkload: z.number().describe('The current workload of the team member (in hours).'),
      })
    )
    .describe('A list of team members to distribute the tasks to.'),
});

export type SuggestOptimalTaskDistributionInput = z.infer<
  typeof SuggestOptimalTaskDistributionInputSchema
>;

const SuggestOptimalTaskDistributionOutputSchema = z.object({
  assignments: z
    .array(
      z.object({
        taskName: z.string().describe('The name of the assigned task.'),
        teamMemberName: z.string().describe('The name of the team member assigned to the task.'),
        reason: z.string().describe('The reasoning behind the task assignment.'),
      })
    )
    .describe('A list of task assignments with the assigned team member and the reason for the assignment.'),
});

export type SuggestOptimalTaskDistributionOutput = z.infer<
  typeof SuggestOptimalTaskDistributionOutputSchema
>;

export async function suggestOptimalTaskDistribution(
  input: SuggestOptimalTaskDistributionInput
): Promise<SuggestOptimalTaskDistributionOutput> {
  return suggestOptimalTaskDistributionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalTaskDistributionPrompt',
  input: {schema: SuggestOptimalTaskDistributionInputSchema},
  output: {schema: SuggestOptimalTaskDistributionOutputSchema},
  prompt: `You are an AI project management assistant. Your role is to suggest the optimal distribution of tasks among team members, taking into account their skills, availability, and current workload.

Tasks:
{{#each tasks}}
- Name: {{name}}
  Description: {{description}}
  Deadline: {{deadline}}
  Priority: {{priority}}
{{/each}}

Team Members:
{{#each teamMembers}}
- Name: {{name}}
  Skills: {{#each skills}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
  Availability: {{availability}}
  Current Workload: {{currentWorkload}} hours
{{/each}}

Suggest an optimal task distribution, providing a clear explanation for each assignment.  Consider all parameters to provide the best suggestion possible.

Format your response as a JSON object.
`, // Updated prompt content
});

const suggestOptimalTaskDistributionFlow = ai.defineFlow(
  {
    name: 'suggestOptimalTaskDistributionFlow',
    inputSchema: SuggestOptimalTaskDistributionInputSchema,
    outputSchema: SuggestOptimalTaskDistributionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
