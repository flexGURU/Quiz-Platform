export interface Quiz {
    id: number;
    title: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    pointsToEarn: number;
    hasTimeLimit: boolean;
    recommended: boolean;
  }