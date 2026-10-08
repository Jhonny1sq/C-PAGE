import "./env";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const F = "```";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

interface SeedLesson {
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

interface SeedChapter {
  slug: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  lessons: SeedLesson[];
}

const chapters: SeedChapter[] = [
  {
    slug: "variables-types",
    title: "Variables & Types",
    description:
      "Store data, name it, and get it back out. The first thing every C++ program does.",
    order: 1,
    icon: "📦",
    lessons: [
      {
        slug: "declaring-variables",
        title: "Declaring Variables",
        order: 1,
        xpReward: 20,
        guideContent: `# Declaring Variables

A **variable** is a named box in memory. You pick a type, give it a name, and
put a value inside.

${F}cpp
int age = 25;              // whole number
std::string name = "Ada";  // text
double price = 9.99;       // decimal number
bool ready = true;         // true or false
${F}

Every statement ends with a **semicolon**. Forget it and the compiler stops.

## Reading input

\`std::cin\` reads from the keyboard. The \`>>\` operator drops the value into a
variable.

${F}cpp
#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    std::cin >> name >> age;
    std::cout << name << " is " << age << " years old" << std::endl;
    return 0;
}
${F}

> **Gotcha:** \`std::cin >> name\` stops at the first space, so it reads a single
> word. That is fine for a first name.

## Your job

Read a name and an age, then print \`<name> is <age> years old\`.`,
        exampleCode: `#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    std::cin >> name >> age;
    std::cout << name << " is " << age << " years old" << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
Sam 30

Output:
Sam is 30 years old`,
        starterCode: `#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    std::cin >> name >> age;

    // TODO: print "<name> is <age> years old"
    // Hint: use std::cout with the << operator.

    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>

int main() {
    std::string name;
    int age;
    std::cin >> name >> age;
    std::cout << name << " is " << age << " years old" << std::endl;
    return 0;
}`,
        hints: [
          "Think about what pieces of text you need: the name, the words \" is \", the number, and \" years old\". Then chain them with <<.",
          "You already have `name` and `age`. Use `std::cout << name << \" is \" << age << \" years old\" << std::endl;`.",
          "Fill the blank: `std::cout << ___ << \" is \" << ___ << \" years old\" << std::endl;` — the blanks are `name` and `age`.",
          "Full solution:\n\n```cpp\nstd::cout << name << \" is \" << age << \" years old\" << std::endl;\n```",
        ],
        testCases: [
          {
            name: "Sam, 30",
            stdin: "Sam 30",
            expectedOutput: "Sam is 30 years old",
            hidden: false,
          },
          {
            name: "Ada, 36",
            stdin: "Ada 36",
            expectedOutput: "Ada is 36 years old",
            hidden: false,
          },
          {
            name: "Zara, 7",
            stdin: "Zara 7",
            expectedOutput: "Zara is 7 years old",
            hidden: true,
          },
        ],
      },
      {
        slug: "types-and-arithmetic",
        title: "Types & Arithmetic",
        order: 2,
        xpReward: 20,
        guideContent: `# Types & Arithmetic

C++ is strict about types. \`int\` holds whole numbers, \`double\` holds decimals,
and mixing them has rules.

${F}cpp
int a = 7;
int b = 2;
int sum = a + b;        // 9
int product = a * b;    // 14
double ratio = a / b;   // 3.0 — integer division first!
double real = (double)a / b; // 3.5
${F}

> **Gotcha:** \`7 / 2\` is \`3\`, not \`3.5\`. Both operands are \`int\`, so the
> result is an \`int\`. Cast one operand to \`double\` to get a real result.

## Your job

Read two integers, then print their sum and their product in this exact format:

${F}
sum=<sum> product=<product>
${F}`,
        exampleCode: `#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << "sum=" << (a + b) << " product=" << (a * b) << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
3 4

Output:
sum=7 product=12`,
        starterCode: `#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;

    // TODO: print "sum=<a+b> product=<a*b>"

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << "sum=" << (a + b) << " product=" << (a * b) << std::endl;
    return 0;
}`,
        hints: [
          "You need to add a and b, and separately multiply them, then print both with a label.",
          "Wrap the arithmetic in parentheses: `(a + b)` and `(a * b)`.",
          "Fill the blank: `std::cout << \"sum=\" << ___ << \" product=\" << ___ << std::endl;`",
          "Full solution:\n\n```cpp\nstd::cout << \"sum=\" << (a + b) << \" product=\" << (a * b) << std::endl;\n```",
        ],
        testCases: [
          {
            name: "3 and 4",
            stdin: "3 4",
            expectedOutput: "sum=7 product=12",
            hidden: false,
          },
          {
            name: "10 and -2",
            stdin: "10 -2",
            expectedOutput: "sum=8 product=-20",
            hidden: false,
          },
          {
            name: "6 and 6",
            stdin: "6 6",
            expectedOutput: "sum=12 product=36",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "control-flow",
    title: "Control Flow",
    description:
      "Make decisions and repeat work. Branches and loops are where programs start to think.",
    order: 2,
    icon: "🔀",
    lessons: [
      {
        slug: "if-else",
        title: "If / Else",
        order: 1,
        xpReward: 25,
        guideContent: `# If / Else

An \`if\` runs a block only when a condition is true. \`else if\` and \`else\`
catch everything that falls through.

${F}cpp
int score = 72;
if (score >= 90) {
    std::cout << "A" << std::endl;
} else if (score >= 60) {
    std::cout << "pass" << std::endl;
} else {
    std::cout << "fail" << std::endl;
}
${F}

Conditions use comparison operators: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`.
The result is a \`bool\` — \`true\` or \`false\`.

> **Gotcha:** \`=\` assigns a value. \`==\` compares two values. Mixing them up is
> the classic bug.

## Your job

Read one integer. Print exactly:

- \`positive\` if it is greater than zero
- \`negative\` if it is less than zero
- \`zero\` if it equals zero`,
        exampleCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    if (n > 0) {
        std::cout << "positive" << std::endl;
    } else if (n < 0) {
        std::cout << "negative" << std::endl;
    } else {
        std::cout << "zero" << std::endl;
    }
    return 0;
}`,
        exampleOutput: `Input:
-3

Output:
negative`,
        starterCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;

    // TODO: check n > 0, n < 0, and the else case.

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    if (n > 0) {
        std::cout << "positive" << std::endl;
    } else if (n < 0) {
        std::cout << "negative" << std::endl;
    } else {
        std::cout << "zero" << std::endl;
    }
    return 0;
}`,
        hints: [
          "You need three outcomes, so use if, else if, and else.",
          "Compare `n` against `0` with `>`, `<`, and let `else` handle zero.",
          "Fill the skeleton:\n\n```cpp\nif (n ___ 0) { std::cout << \"positive\" << std::endl; }\nelse if (n ___ 0) { std::cout << \"negative\" << std::endl; }\nelse { std::cout << \"zero\" << std::endl; }\n```",
          "Full solution:\n\n```cpp\nif (n > 0) {\n    std::cout << \"positive\" << std::endl;\n} else if (n < 0) {\n    std::cout << \"negative\" << std::endl;\n} else {\n    std::cout << \"zero\" << std::endl;\n}\n```",
        ],
        testCases: [
          {
            name: "positive",
            stdin: "5",
            expectedOutput: "positive",
            hidden: false,
          },
          {
            name: "negative",
            stdin: "-8",
            expectedOutput: "negative",
            hidden: false,
          },
          {
            name: "zero",
            stdin: "0",
            expectedOutput: "zero",
            hidden: true,
          },
        ],
      },
      {
        slug: "for-loops",
        title: "For Loops",
        order: 2,
        xpReward: 25,
        guideContent: `# For Loops

A \`for\` loop repeats a block. Three parts control it: **start**, **condition**,
and **step**.

${F}cpp
for (int i = 1; i <= 5; i++) {
    std::cout << i << " ";
}
// prints: 1 2 3 4 5
${F}

- \`int i = 1\` runs once at the start.
- \`i <= 5\` is checked before every pass.
- \`i++\` runs after every pass.

Use a loop to accumulate a running total.

${F}cpp
int total = 0;
for (int i = 1; i <= n; i++) {
    total += i;   // same as total = total + i
}
${F}

> **Gotcha:** \`i <= n\` includes \`n\`. \`i < n\` stops one short. Off-by-one bugs
> live here.

## Your job

Read an integer \`n\` and print the sum of every integer from \`1\` to \`n\`.`,
        exampleCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    std::cout << total << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
5

Output:
15`,
        starterCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    int total = 0;

    // TODO: loop from 1 to n and add each number to total.

    std::cout << total << std::endl;
    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int n;
    std::cin >> n;
    int total = 0;
    for (int i = 1; i <= n; i++) {
        total += i;
    }
    std::cout << total << std::endl;
    return 0;
}`,
        hints: [
          "A loop that counts from 1 up to n, adding the counter to a running total each pass.",
          "The loop header is `for (int i = 1; i <= n; i++)` and the body is `total += i;`.",
          "Fill the blank: `for (int i = 1; i ___ n; i++) { total ___ i; }`",
          "Full solution:\n\n```cpp\nfor (int i = 1; i <= n; i++) {\n    total += i;\n}\n```",
        ],
        testCases: [
          {
            name: "n = 5",
            stdin: "5",
            expectedOutput: "15",
            hidden: false,
          },
          {
            name: "n = 1",
            stdin: "1",
            expectedOutput: "1",
            hidden: false,
          },
          {
            name: "n = 100",
            stdin: "100",
            expectedOutput: "5050",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "functions",
    title: "Functions",
    description:
      "Name a block of work, give it inputs, hand back a result. Stop repeating yourself.",
    order: 3,
    icon: "🧩",
    lessons: [
      {
        slug: "functions-basics",
        title: "Functions",
        order: 1,
        xpReward: 30,
        guideContent: `# Functions

A **function** packages work under a name. It has a **return type**, a **name**,
and **parameters**.

${F}cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    std::cout << add(2, 3) << std::endl; // 5
    return 0;
}
${F}

- \`int\` is the return type — the type of the value handed back.
- \`add\` is the name.
- \`(int a, int b)\` are the parameters.
- \`return\` sends a value back to the caller.

A function must be **declared before** it is used, or defined above \`main\`.

> **Gotcha:** if the compiler says a function "was not declared in this scope",
> you either misspelled the name or defined it below the call site.

## Your job

Read two integers. Use a function named \`maximum\` that returns the larger one,
and print the result.`,
        exampleCode: `#include <iostream>

int maximum(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << maximum(a, b) << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
3 9

Output:
9`,
        starterCode: `#include <iostream>

// TODO: define int maximum(int a, int b) that returns the larger value.

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << maximum(a, b) << std::endl;
    return 0;
}`,
        solutionCode: `#include <iostream>

int maximum(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << maximum(a, b) << std::endl;
    return 0;
}`,
        hints: [
          "Write a function above main that takes two ints and returns one int.",
          "Inside, compare a and b, then `return` the bigger one. If a is not bigger, return b.",
          "Fill the skeleton:\n\n```cpp\nint maximum(int a, int b) {\n    if (a ___ b) return ___;\n    return ___;\n}\n```",
          "Full solution:\n\n```cpp\nint maximum(int a, int b) {\n    if (a > b) return a;\n    return b;\n}\n```",
        ],
        testCases: [
          {
            name: "3 and 9",
            stdin: "3 9",
            expectedOutput: "9",
            hidden: false,
          },
          {
            name: "-4 and -7",
            stdin: "-4 -7",
            expectedOutput: "-4",
            hidden: false,
          },
          {
            name: "5 and 5",
            stdin: "5 5",
            expectedOutput: "5",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "arrays-vectors",
    title: "Arrays & Vectors",
    description:
      "Hold many values at once. Fixed arrays, then the flexible std::vector.",
    order: 4,
    icon: "🗂️",
    lessons: [],
  },
  {
    slug: "pointers-references",
    title: "Pointers & References",
    description:
      "Work with memory addresses directly. The topic that separates beginners from the rest.",
    order: 5,
    icon: "🎯",
    lessons: [
      {
        slug: "pointers-101",
        title: "Pointers 101",
        order: 1,
        xpReward: 35,
        guideContent: `# Pointers 101

A **pointer** stores the memory address of another variable. The \`&\` operator
gets an address; the \`*\` operator follows a pointer to reach the value.

${F}cpp
int value = 10;
int* ptr = &value;   // ptr holds the address of value
*ptr = 20;           // write through the pointer
std::cout << value;  // prints 20
${F}

- \`int* ptr\` — "pointer to int".
- \`&value\` — address-of.
- \`*ptr\` — dereference, read or write the pointed-to value.

## Your job

Read an integer. Use a pointer to double the value it points at, then print the
new value.`,
        exampleCode: `#include <iostream>

int main() {
    int value;
    std::cin >> value;
    int* ptr = &value;
    *ptr = *ptr * 2;
    std::cout << value << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
4

Output:
8`,
        starterCode: `#include <iostream>

int main() {
    int value;
    std::cin >> value;

    // TODO: create an int pointer to value, then double it through the pointer.

    std::cout << value << std::endl;
    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int value;
    std::cin >> value;
    int* ptr = &value;
    *ptr = *ptr * 2;
    std::cout << value << std::endl;
    return 0;
}`,
        hints: [
          "You need the address of `value`, stored in a pointer, then write through it.",
          "Use `int* ptr = &value;` and then `*ptr = *ptr * 2;`.",
          "Fill the blanks: `int* ptr = ___value;` and `___ = *ptr * 2;`",
          "Full solution:\n\n```cpp\nint* ptr = &value;\n*ptr = *ptr * 2;\n```",
        ],
        testCases: [
          {
            name: "4",
            stdin: "4",
            expectedOutput: "8",
            hidden: false,
          },
          {
            name: "-3",
            stdin: "-3",
            expectedOutput: "-6",
            hidden: false,
          },
          {
            name: "0",
            stdin: "0",
            expectedOutput: "0",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "oop",
    title: "Object-Oriented C++",
    description:
      "Classes, objects, inheritance, and polymorphism. Model the world in types.",
    order: 6,
    icon: "🏛️",
    lessons: [],
  },
  {
    slug: "stl",
    title: "The STL",
    description:
      "Containers and algorithms you should use instead of hand-rolling everything.",
    order: 7,
    icon: "🧰",
    lessons: [],
  },
  {
    slug: "templates",
    title: "Templates",
    description: "Write code once that works across many types. Generic programming.",
    order: 8,
    icon: "🧬",
    lessons: [],
  },
  {
    slug: "file-io",
    title: "File I/O",
    description:
      "Read from and write to files. Make your programs remember things between runs.",
    order: 9,
    icon: "💾",
    lessons: [],
  },
];

async function seed() {
  console.log("Seeding C-PAGE chapters and lessons...");

  for (const chapter of chapters) {
    const savedChapter = await prisma.chapter.upsert({
      where: { slug: chapter.slug },
      update: {
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        icon: chapter.icon,
      },
      create: {
        slug: chapter.slug,
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        icon: chapter.icon,
      },
    });

    for (const lesson of chapter.lessons) {
      const data = {
        title: lesson.title,
        order: lesson.order,
        chapterId: savedChapter.id,
        guideContent: lesson.guideContent,
        exampleCode: lesson.exampleCode,
        exampleOutput: lesson.exampleOutput,
        starterCode: lesson.starterCode,
        solutionCode: lesson.solutionCode,
        hints: lesson.hints,
        testCases: lesson.testCases,
        xpReward: lesson.xpReward,
      };

      await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: data,
        create: { slug: lesson.slug, ...data },
      });
    }

    console.log(
      `  ${chapter.icon} ${chapter.title} — ${chapter.lessons.length} lesson(s)`
    );
  }

  const lessonCount = await prisma.lesson.count();
  console.log(`Done. ${chapters.length} chapters, ${lessonCount} lessons.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};