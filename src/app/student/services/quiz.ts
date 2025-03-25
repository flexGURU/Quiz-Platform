import { Quiz } from '../../shared/models';

export const quiz: Quiz[] =  [
    {
      id: 1,
      title: 'Basic Algebra',
      category: 'Math',
      difficulty: 'Easy',
      pointsToEarn: 50,
      hasTimeLimit: true,
      recommended: true,
    },
    {
      id: 2,
      title: 'World War II',
      category: 'History',
      difficulty: 'Medium',
      pointsToEarn: 75,
      hasTimeLimit: true,
      recommended: false,
    },
    {
      id: 3,
      title: 'Periodic Table',
      category: 'Science',
      difficulty: 'Medium',
      pointsToEarn: 75,
      hasTimeLimit: false,
      recommended: true,
    },
    {
      id: 4,
      title: 'Shakespeare Works',
      category: 'Literature',
      difficulty: 'Hard',
      pointsToEarn: 100,
      hasTimeLimit: false,
      recommended: false,
    },
    {
      id: 5,
      title: 'European Countries',
      category: 'Geography',
      difficulty: 'Easy',
      pointsToEarn: 50,
      hasTimeLimit: true,
      recommended: true,
    },
  ];

