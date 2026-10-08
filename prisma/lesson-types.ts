export interface SeedLesson {
  slug: string;
  title: string;
  order: number;
  guideContent: string;
  exampleCode: string;
  exampleOutput: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases: {
    name: string;
    stdin: string;
    expectedOutput: string;
    hidden: boolean;
  }[];
  xpReward: number;
}

export interface SeedChapter {
  slug: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  isSecret?: boolean;
  lessons: SeedLesson[];
}
