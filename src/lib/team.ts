import type { TeamMember } from './types';

export const teamMembers: TeamMember[] = [
  { id: '1', name: 'Alice Johnson', avatarUrl: 'https://placehold.co/40x40.png', skills: ['Frontend', 'UI/UX'], availability: '40 horas/semana', currentWorkload: 20 },
  { id: '2', name: 'Bob Williams', avatarUrl: 'https://placehold.co/40x40.png', skills: ['Backend', 'Banco de Dados'], availability: '40 horas/semana', currentWorkload: 30 },
  { id: '3', name: 'Charlie Brown', avatarUrl: 'https://placehold.co/40x40.png', skills: ['DevOps', 'CI/CD'], availability: '30 horas/semana', currentWorkload: 15 },
  { id: '4', name: 'Diana Prince', avatarUrl: 'https://placehold.co/40x40.png', skills: ['QA', 'Testes'], availability: '40 horas/semana', currentWorkload: 25 },
];
