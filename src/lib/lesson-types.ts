export interface TestResultView {
  name: string;
  hidden: boolean;
  passed: boolean;
  statusDescription: string;
  expected?: string;
  actual?: string;
  stderr: string;
  compileOutput: string;
}

export interface RawRunView {
  stdout: string;
  stderr: string;
  compileOutput: string;
  statusDescription: string;
  time: string | null;
  memory: number | null;
}

export interface RunResponse {
  mode: "test" | "custom";
  passed: boolean;
  passedCount: number;
  total: number;
  results: TestResultView[];
  raw?: RawRunView;
  compileHint?: string | null;
}

export interface PublicTestCase {
  name: string;
  hidden: boolean;
}

export interface LessonView {
  id: string;
  slug: string;
  title: string;
  guideContent: string;
  exampleCode: string;
  exampleOutput: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  xpReward: number;
  chapterTitle: string;
  chapterIcon: string | null;
}

export interface AchievementView {
  type: string;
  label: string;
  description: string;
  icon: string;
}