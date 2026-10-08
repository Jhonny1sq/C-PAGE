import type { SeedChapter } from "./lesson-types";

const F = "```";

export const extraChapters: SeedChapter[] = [
  {
    slug: "arrays-vectors",
    title: "Arrays & Vectors",
    description:
      "Hold many values at once. Fixed arrays, then the flexible std::vector.",
    order: 4,
    icon: "🗂️",
    lessons: [
      {
        slug: "arrays-indexing",
        title: "Arrays & Indexing",
        order: 1,
        xpReward: 25,
        guideContent: `# Arrays & Indexing

An **array** holds many values of one type, back to back. You reach each slot
by its **index** — and the first slot is index \`0\`, not 1.

${F}cpp
int scores[5] = {10, 20, 30, 40, 50};
std::cout << scores[0];  // 10
std::cout << scores[4];  // 50
${F}

Loop over the valid range, \`0\` to \`size - 1\`. Reading \`scores[5]\` compiles
fine and then reads garbage — or crashes. That is not a compiler bug, that is
an out-of-bounds read, and it is the same bug class behind half of all game
crashes.

${F}cpp
int total = 0;
for (int i = 0; i < 5; i++) {
    total += scores[i];
}
${F}

> **Gotcha:** the array does not know its own size. If you need the size later,
> track it yourself — or use \`std::vector\` (next lesson).

## Your job

Read five integers into an array. Print their sum and the largest value:

${F}
sum=<sum> max=<max>
${F}`,
        exampleCode: `#include <iostream>

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) {
        std::cin >> a[i];
    }
    int sum = 0, mx = a[0];
    for (int i = 0; i < 5; i++) {
        sum += a[i];
        if (a[i] > mx) mx = a[i];
    }
    std::cout << "sum=" << sum << " max=" << mx << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
1 2 3 4 5

Output:
sum=15 max=5`,
        starterCode: `#include <iostream>

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) {
        std::cin >> a[i];
    }

    // TODO: compute sum and max, then print "sum=<sum> max=<max>"

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int a[5];
    for (int i = 0; i < 5; i++) {
        std::cin >> a[i];
    }
    int sum = 0, mx = a[0];
    for (int i = 0; i < 5; i++) {
        sum += a[i];
        if (a[i] > mx) mx = a[i];
    }
    std::cout << "sum=" << sum << " max=" << mx << std::endl;
    return 0;
}`,
        hints: [
          "Two passes over the array: one to read it, one to add everything up while tracking the biggest value seen.",
          "Start `mx` at `a[0]`, then update it only when `a[i] > mx`.",
          "Fill the blank:\n\n```cpp\nint sum = 0, mx = a[0];\nfor (int i = 0; i < 5; i++) {\n    sum += ___;\n    if (a[i] > mx) mx = ___;\n}\nstd::cout << \"sum=\" << sum << \" max=\" << mx << std::endl;\n```",
          "Full solution:\n\n```cpp\nint sum = 0, mx = a[0];\nfor (int i = 0; i < 5; i++) {\n    sum += a[i];\n    if (a[i] > mx) mx = a[i];\n}\nstd::cout << \"sum=\" << sum << \" max=\" << mx << std::endl;\n```",
        ],
        testCases: [
          {
            name: "1 to 5",
            stdin: "1 2 3 4 5",
            expectedOutput: "sum=15 max=5",
            hidden: false,
          },
          {
            name: "all nines",
            stdin: "9 9 9 9 9",
            expectedOutput: "sum=45 max=9",
            hidden: false,
          },
          {
            name: "negatives",
            stdin: "-3 0 7 2 -1",
            expectedOutput: "sum=5 max=7",
            hidden: true,
          },
        ],
      },
      {
        slug: "vectors-push-back",
        title: "Vectors & push_back",
        order: 2,
        xpReward: 30,
        guideContent: `# Vectors & push_back

\`std::vector\` is an array that grows. You don't declare a size up front —
you \`push_back\` values and it handles the memory.

${F}cpp
#include <vector>

std::vector<int> scores;
scores.push_back(10);
scores.push_back(20);
std::cout << scores.size();  // 2
std::cout << scores[0];      // 10
${F}

This pattern — read values until a **sentinel** tells you to stop — shows up
everywhere, from input parsing to reading entity lists.

${F}cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    int x;
    while (std::cin >> x && x != -1) {
        v.push_back(x);
    }
    std::cout << "count=" << v.size() << std::endl;
    return 0;
}
${F}

> **Gotcha:** \`vector<int> v(5)\` makes 5 zeros. \`vector<int> v\` makes an
> empty one. The parentheses matter.

## Your job

Read integers until \`-1\` (don't store the \`-1\`). Print how many you got
and their sum:

${F}
count=<count> sum=<sum>
${F}`,
        exampleCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    int x;
    while (std::cin >> x && x != -1) {
        v.push_back(x);
    }
    int sum = 0;
    for (size_t i = 0; i < v.size(); i++) {
        sum += v[i];
    }
    std::cout << "count=" << v.size() << " sum=" << sum << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
3 7 2 -1

Output:
count=3 sum=12`,
        starterCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    int x;
    while (std::cin >> x && x != -1) {
        v.push_back(x);
    }

    // TODO: sum the vector, then print "count=<n> sum=<sum>"

    return 0;
}`,
        solutionCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;
    int x;
    while (std::cin >> x && x != -1) {
        v.push_back(x);
    }
    int sum = 0;
    for (size_t i = 0; i < v.size(); i++) {
        sum += v[i];
    }
    std::cout << "count=" << v.size() << " sum=" << sum << std::endl;
    return 0;
}`,
        hints: [
          "The reading loop is done for you. You need a second loop that adds up `v[0]` through `v[v.size() - 1]`.",
          "Use `v.size()` for the count and accumulate into `sum`.",
          "Fill the blank:\n\n```cpp\nint sum = 0;\nfor (size_t i = 0; i < v.size(); i++) {\n    sum += ___;\n}\nstd::cout << \"count=\" << v.size() << \" sum=\" << sum << std::endl;\n```",
          "Full solution:\n\n```cpp\nint sum = 0;\nfor (size_t i = 0; i < v.size(); i++) {\n    sum += v[i];\n}\nstd::cout << \"count=\" << v.size() << \" sum=\" << sum << std::endl;\n```",
        ],
        testCases: [
          {
            name: "three values",
            stdin: "3 7 2 -1",
            expectedOutput: "count=3 sum=12",
            hidden: false,
          },
          {
            name: "empty",
            stdin: "-1",
            expectedOutput: "count=0 sum=0",
            hidden: false,
          },
          {
            name: "two values",
            stdin: "10 20 -1",
            expectedOutput: "count=2 sum=30",
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
    lessons: [
      {
        slug: "classes-objects",
        title: "Classes & Objects",
        order: 1,
        xpReward: 30,
        guideContent: `# Classes & Objects

A **class** is a blueprint. An **object** is one thing built from it. Members
are \`public\` (anyone can touch) or \`private\` (only the class itself).

${F}cpp
class Player {
public:
    std::string name;
    int hp;

    void takeDamage(int amount) {
        hp -= amount;
        if (hp < 0) hp = 0;
    }
};

Player p;
p.name = "Ada";
p.hp = 100;
p.takeDamage(30);  // hp is now 70
${F}

A **constructor** runs when the object is born and sets it up in one call:

${F}cpp
class Player {
public:
    std::string name;
    int hp;
    Player(std::string n, int h) : name(n), hp(h) {}
};
${F}

> **Gotcha:** \`class\` members are private by default. Forget \`public:\` and
> nothing outside can reach them.

## Your job

Read a name and an HP value. Build a \`Player\` with a constructor and print:

${F}
<name> has <hp> HP
${F}`,
        exampleCode: `#include <iostream>
#include <string>

class Player {
public:
    std::string name;
    int hp;
    Player(std::string n, int h) : name(n), hp(h) {}
};

int main() {
    std::string name;
    int hp;
    std::cin >> name >> hp;
    Player p(name, hp);
    std::cout << p.name << " has " << p.hp << " HP" << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
Ada 100

Output:
Ada has 100 HP`,
        starterCode: `#include <iostream>
#include <string>

class Player {
public:
    std::string name;
    int hp;
    // TODO: add a constructor Player(string n, int h)
};

int main() {
    std::string name;
    int hp;
    std::cin >> name >> hp;
    Player p(name, hp);
    std::cout << p.name << " has " << p.hp << " HP" << std::endl;
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>

class Player {
public:
    std::string name;
    int hp;
    Player(std::string n, int h) : name(n), hp(h) {}
};

int main() {
    std::string name;
    int hp;
    std::cin >> name >> hp;
    Player p(name, hp);
    std::cout << p.name << " has " << p.hp << " HP" << std::endl;
    return 0;
}`,
        hints: [
          "A constructor has no return type and the same name as the class. It takes the values and stores them in the members.",
          "Use an initializer list: `Player(std::string n, int h) : name(n), hp(h) {}`.",
          "Fill the blank:\n\n```cpp\nPlayer(std::string n, int h) : ___(n), ___(h) {}\n```",
          "Full solution:\n\n```cpp\nPlayer(std::string n, int h) : name(n), hp(h) {}\n```",
        ],
        testCases: [
          {
            name: "Ada",
            stdin: "Ada 100",
            expectedOutput: "Ada has 100 HP",
            hidden: false,
          },
          {
            name: "Bob",
            stdin: "Bob 42",
            expectedOutput: "Bob has 42 HP",
            hidden: false,
          },
          {
            name: "Zed",
            stdin: "Zed 1",
            expectedOutput: "Zed has 1 HP",
            hidden: true,
          },
        ],
      },
      {
        slug: "inheritance-basics",
        title: "Inheritance Basics",
        order: 2,
        xpReward: 35,
        guideContent: `# Inheritance Basics

**Inheritance** lets a new class reuse an old one. The child gets every member
of the parent, then adds or changes behavior.

${F}cpp
class Enemy {
public:
    int attack = 10;
};

class Boss : public Enemy {
public:
    int special() { return attack * 2; }
};

Boss b;
std::cout << b.special();  // 20
${F}

- \`class Boss : public Enemy\` — Boss inherits Enemy.
- A Boss **is an** Enemy, so it can stand anywhere an Enemy is expected.
- A child method with the same name as a parent method **overrides** it.

Game code is built on this: one \`Entity\` base, then \`Player\`,
\`Enemy\`, \`Projectile\` children, each with their own \`update()\`.

> **Gotcha:** \`private\` members are inherited but unreachable. Use
> \`protected\` for members children need but outsiders shouldn't touch.

## Your job

Read an integer \`base\`. An \`Enemy\` has that attack. A \`Boss\` doubles it
through a \`special()\` method. Print the boss's special attack.`,
        exampleCode: `#include <iostream>

class Enemy {
public:
    int attack;
    Enemy(int a) : attack(a) {}
};

class Boss : public Enemy {
public:
    Boss(int a) : Enemy(a) {}
    int special() { return attack * 2; }
};

int main() {
    int base;
    std::cin >> base;
    Boss b(base);
    std::cout << b.special() << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
21

Output:
42`,
        starterCode: `#include <iostream>

class Enemy {
public:
    int attack;
    Enemy(int a) : attack(a) {}
};

class Boss : public Enemy {
public:
    Boss(int a) : Enemy(a) {}
    // TODO: int special() that returns double the attack
};

int main() {
    int base;
    std::cin >> base;
    Boss b(base);
    std::cout << b.special() << std::endl;
    return 0;
}`,
        solutionCode: `#include <iostream>

class Enemy {
public:
    int attack;
    Enemy(int a) : attack(a) {}
};

class Boss : public Enemy {
public:
    Boss(int a) : Enemy(a) {}
    int special() { return attack * 2; }
};

int main() {
    int base;
    std::cin >> base;
    Boss b(base);
    std::cout << b.special() << std::endl;
    return 0;
}`,
        hints: [
          "The Boss already inherits `attack`. You just need a method that returns twice that value.",
          "Boss constructors must forward to the Enemy constructor: `Boss(int a) : Enemy(a) {}` (already done).",
          "Fill the blank:\n\n```cpp\nint special() { return attack ___ 2; }\n```",
          "Full solution:\n\n```cpp\nint special() { return attack * 2; }\n```",
        ],
        testCases: [
          {
            name: "21",
            stdin: "21",
            expectedOutput: "42",
            hidden: false,
          },
          {
            name: "0",
            stdin: "0",
            expectedOutput: "0",
            hidden: false,
          },
          {
            name: "33",
            stdin: "33",
            expectedOutput: "66",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "stl",
    title: "The STL",
    description:
      "Containers and algorithms you should use instead of hand-rolling everything.",
    order: 7,
    icon: "🧰",
    lessons: [
      {
        slug: "sorting-with-sort",
        title: "Sorting with std::sort",
        order: 1,
        xpReward: 30,
        guideContent: `# Sorting with std::sort

The Standard Template Library ships algorithms that beat anything you'll
write in a lesson. \`std::sort\` sorts a range in \`O(n log n)\`.

${F}cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {5, 2, 9, 1};
std::sort(v.begin(), v.end());
// v is now {1, 2, 5, 9}
${F}

- \`#include <algorithm>\` — the header.
- \`v.begin(), v.end()\` — the half-open range \`[begin, end)\`.
- Default order is ascending. Pass \`std::greater<int>()\` as a third
  argument for descending.

Leaderboards, render queues, and target lists are all just sorted vectors.

> **Gotcha:** sorting needs random-access iterators. It works on \`vector\`
> and arrays, not on \`std::list\` (lists have their own \`.sort()\`).

## Your job

Read \`n\` followed by \`n\` integers. Sort them ascending and print them
separated by single spaces.`,
        exampleCode: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (int i = 0; i < n; i++) {
        std::cin >> v[i];
    }
    std::sort(v.begin(), v.end());
    for (int i = 0; i < n; i++) {
        if (i > 0) std::cout << " ";
        std::cout << v[i];
    }
    std::cout << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
5 5 4 3 2 1

Output:
1 2 3 4 5`,
        starterCode: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (int i = 0; i < n; i++) {
        std::cin >> v[i];
    }

    // TODO: sort v, then print values separated by single spaces.

    return 0;
}`,
        solutionCode: `#include <algorithm>
#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> v(n);
    for (int i = 0; i < n; i++) {
        std::cin >> v[i];
    }
    std::sort(v.begin(), v.end());
    for (int i = 0; i < n; i++) {
        if (i > 0) std::cout << " ";
        std::cout << v[i];
    }
    std::cout << std::endl;
    return 0;
}`,
        hints: [
          "One call sorts the whole vector: `std::sort(v.begin(), v.end());`. Then print with spaces between, not after.",
          "Print a space *before* every element except the first: `if (i > 0) std::cout << \" \";`.",
          "Fill the skeleton:\n\n```cpp\nstd::sort(v.___, v.___);\nfor (int i = 0; i < n; i++) {\n    if (i > 0) std::cout << \" \";\n    std::cout << v[i];\n}\nstd::cout << std::endl;\n```",
          "Full solution:\n\n```cpp\nstd::sort(v.begin(), v.end());\nfor (int i = 0; i < n; i++) {\n    if (i > 0) std::cout << \" \";\n    std::cout << v[i];\n}\nstd::cout << std::endl;\n```",
        ],
        testCases: [
          {
            name: "reversed five",
            stdin: "5 5 4 3 2 1",
            expectedOutput: "1 2 3 4 5",
            hidden: false,
          },
          {
            name: "three mixed",
            stdin: "3 9 1 5",
            expectedOutput: "1 5 9",
            hidden: false,
          },
          {
            name: "single",
            stdin: "1 7",
            expectedOutput: "7",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "templates",
    title: "Templates",
    description: "Write code once that works across many types. Generic programming.",
    order: 8,
    icon: "🧬",
    lessons: [
      {
        slug: "function-templates",
        title: "Function Templates",
        order: 1,
        xpReward: 35,
        guideContent: `# Function Templates

A **template** is one function that works for many types. The compiler stamps
out a copy for each type you actually use.

${F}cpp
template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

maxOf(3, 7);      // int version
maxOf(2.5, 1.2);  // double version
${F}

- \`template <typename T>\` declares the placeholder type.
- \`T\` behaves like a real type name inside the function.
- Both arguments must be the **same** type — \`maxOf(3, 2.5)\` won't compile
  without an explicit cast, because \`T\` can only be one thing per call.

The entire STL is built this way: \`std::vector<int>\` and
\`std::vector<std::string>\` are two stamps of one template.

> **Gotcha:** templates live in headers. Splitting a template's declaration
> and definition across .h/.cpp files is the classic linker-error factory.

## Your job

Write a \`maxOf\` template. Read two integers, print the larger one using it.`,
        exampleCode: `#include <iostream>

template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << maxOf(a, b) << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
7 3

Output:
7`,
        starterCode: `#include <iostream>

// TODO: template <typename T> T maxOf(T a, T b) returning the larger value.

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << maxOf(a, b) << std::endl;
    return 0;
}`,
        solutionCode: `#include <iostream>

template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << maxOf(a, b) << std::endl;
    return 0;
}`,
        hints: [
          "The function looks like a normal max, but the type is a placeholder declared on the line above.",
          "First line: `template <typename T>`. Then `T maxOf(T a, T b)`.",
          "Fill the skeleton:\n\n```cpp\ntemplate <typename ___>\n___ maxOf(___ a, ___ b) {\n    return (a > b) ? a : b;\n}\n```",
          "Full solution:\n\n```cpp\ntemplate <typename T>\nT maxOf(T a, T b) {\n    return (a > b) ? a : b;\n}\n```",
        ],
        testCases: [
          {
            name: "7 and 3",
            stdin: "7 3",
            expectedOutput: "7",
            hidden: false,
          },
          {
            name: "negatives",
            stdin: "-2 -9",
            expectedOutput: "-2",
            hidden: false,
          },
          {
            name: "equal",
            stdin: "4 4",
            expectedOutput: "4",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "file-io",
    title: "File I/O",
    description:
      "Read from and write to files. Make your programs remember things between runs.",
    order: 9,
    icon: "💾",
    lessons: [
      {
        slug: "files-that-remember",
        title: "Files That Remember",
        order: 1,
        xpReward: 30,
        guideContent: `# Files That Remember

\`std::ofstream\` writes. \`std::ifstream\` reads. Open, use, close — the
file keeps the data after your program exits.

${F}cpp
#include <fstream>
#include <string>

std::ofstream out("save.txt");
out << "Ada:7" << std::endl;
out.close();

std::string line;
std::ifstream in("save.txt");
std::getline(in, line);  // "Ada:7"
in.close();
${F}

- \`ofstream\` = output file stream. \`ifstream\` = input file stream.
- \`<<\` writes, \`>>\` and \`getline\` read.
- Always \`close()\` when done — buffered data can sit unwritten otherwise.

Configs, save files, and logs are all this pattern.

> **Gotcha:** opening an \`ofstream\` on an existing file **truncates** it.
> Open with \`std::ios::app\` if you mean to append.

## Your job

Read a word and a number. Write \`<word>:<number>\` to \`save.txt\`, read it
back, and print exactly what you read.`,
        exampleCode: `#include <fstream>
#include <iostream>
#include <string>

int main() {
    std::string word;
    int num;
    std::cin >> word >> num;

    std::ofstream out("save.txt");
    out << word << ":" << num << std::endl;
    out.close();

    std::string line;
    std::ifstream in("save.txt");
    std::getline(in, line);
    in.close();

    std::cout << line << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
Ada 7

Output:
Ada:7`,
        starterCode: `#include <fstream>
#include <iostream>
#include <string>

int main() {
    std::string word;
    int num;
    std::cin >> word >> num;

    // TODO: write "<word>:<num>" to save.txt, read it back, print it.

    return 0;
}`,
        solutionCode: `#include <fstream>
#include <iostream>
#include <string>

int main() {
    std::string word;
    int num;
    std::cin >> word >> num;

    std::ofstream out("save.txt");
    out << word << ":" << num << std::endl;
    out.close();

    std::string line;
    std::ifstream in("save.txt");
    std::getline(in, line);
    in.close();

    std::cout << line << std::endl;
    return 0;
}`,
        hints: [
          "Three steps: open an ofstream and write, close it, then open an ifstream and getline into a string.",
          "Write with `out << word << \":\" << num << std::endl;` and read with `std::getline(in, line);`.",
          "Fill the skeleton:\n\n```cpp\nstd::ofstream out(\"save.txt\");\nout << ___ << \":\" << ___ << std::endl;\nout.close();\nstd::string line;\nstd::ifstream in(\"save.txt\");\nstd::getline(in, ___);\nin.close();\nstd::cout << line << std::endl;\n```",
          "Full solution:\n\n```cpp\nstd::ofstream out(\"save.txt\");\nout << word << \":\" << num << std::endl;\nout.close();\nstd::string line;\nstd::ifstream in(\"save.txt\");\nstd::getline(in, line);\nin.close();\nstd::cout << line << std::endl;\n```",
        ],
        testCases: [
          {
            name: "Ada 7",
            stdin: "Ada 7",
            expectedOutput: "Ada:7",
            hidden: false,
          },
          {
            name: "Bob 3",
            stdin: "Bob 3",
            expectedOutput: "Bob:3",
            hidden: false,
          },
          {
            name: "Zed 99",
            stdin: "Zed 99",
            expectedOutput: "Zed:99",
            hidden: true,
          },
        ],
      },
    ],
  },
  {
    slug: "the-vault",
    title: "The Vault",
    description:
      "Locked advanced track. Memory, offsets, flags, scanning, and aim math — the machinery behind mods and cheats.",
    order: 10,
    icon: "🔓",
    isSecret: true,
    lessons: [
      {
        slug: "vault-addresses",
        title: "Addresses Are Just Numbers",
        order: 1,
        xpReward: 40,
        guideContent: `# Addresses Are Just Numbers

Every variable lives at a **memory address** — a number. \`&\` reads the
address, \`*\` follows a pointer back to the value.

${F}cpp
int hp = 100;
int* p = &hp;   // p holds hp's address
std::cout << *p;  // 100, read through the pointer
*p = 1;           // hp is now 1, written through the pointer
${F}

This is the entire foundation of game modding. A tool like Cheat Engine does
exactly this from outside:

1. Find the address holding the HP value.
2. Write a new value to that address.
3. The game reads its own variable and sees your number.

Same operations, different process. Master \`&\` and \`*\` here and the
outside version is just plumbing.

> **Gotcha:** an uninitialized pointer points nowhere. \`int* p;\` followed
> by \`*p = 5;\` is a crash (or worse). Always point at something real first.

## Your job

Read an integer. Store it, take its address with a pointer, double the value
**through the pointer**, then print the result.`,
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
21

Output:
42`,
        starterCode: `#include <iostream>

int main() {
    int value;
    std::cin >> value;

    // TODO: point at value, then double it through the pointer.

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
          "Two lines: take the address into a pointer, then write through it with `*ptr` on the left side.",
          "Line one is `int* ptr = &value;`. Line two doubles through the pointer.",
          "Fill the blanks:\n\n```cpp\nint* ptr = ___value;\n___ = *ptr * 2;\n```",
          "Full solution:\n\n```cpp\nint* ptr = &value;\n*ptr = *ptr * 2;\n```",
        ],
        testCases: [
          {
            name: "21",
            stdin: "21",
            expectedOutput: "42",
            hidden: false,
          },
          {
            name: "-5",
            stdin: "-5",
            expectedOutput: "-10",
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
      {
        slug: "vault-offsets",
        title: "Struct Layout & Offsets",
        order: 2,
        xpReward: 45,
        guideContent: `# Struct Layout & Offsets

A struct's members sit at fixed **offsets** from its start. If you know the
start address and a member's offset, you know the member's address:

${F}
member_address = struct_start + offset
${F}

\`offsetof\` from \`<cstddef>\` reports those offsets, and the compiler pads
members to satisfy **alignment** — a \`char\` followed by an \`int\` costs 8
bytes, not 5.

${F}cpp
#include <cstddef>
#include <iostream>

struct Player {
    char team;   // offset 0
    int hp;      // offset 4 (3 bytes of padding first)
    char alive;  // offset 8
};

int main() {
    std::cout << offsetof(Player, team) << " ";
    std::cout << offsetof(Player, hp) << " ";
    std::cout << offsetof(Player, alive) << std::endl;
    return 0;
}
// prints: 0 4 8
${F}

Modders live in offsets: HP at \`+0x4\`, armor at \`+0x8\`. Reversing a game
struct is listing exactly these numbers.

> **Gotcha:** padding depends on member order and the platform. Reorder
> members and the offsets move — same reason game updates break cheats.

## Your job

Print the three offsets of \`team\`, \`hp\`, and \`alive\`, space-separated,
using \`offsetof\`. No input.`,
        exampleCode: `#include <cstddef>
#include <iostream>

struct Player {
    char team;
    int hp;
    char alive;
};

int main() {
    std::cout << offsetof(Player, team) << " ";
    std::cout << offsetof(Player, hp) << " ";
    std::cout << offsetof(Player, alive) << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
(none)

Output:
0 4 8`,
        starterCode: `#include <cstddef>
#include <iostream>

struct Player {
    char team;
    int hp;
    char alive;
};

int main() {
    // TODO: print offsetof team, hp, alive separated by spaces.

    return 0;
}`,
        solutionCode: `#include <cstddef>
#include <iostream>

struct Player {
    char team;
    int hp;
    char alive;
};

int main() {
    std::cout << offsetof(Player, team) << " ";
    std::cout << offsetof(Player, hp) << " ";
    std::cout << offsetof(Player, alive) << std::endl;
    return 0;
}`,
        hints: [
          "Each value is `offsetof(Player, member)` printed with a space between.",
          "Three members, three offsetof calls, spaces between the first two.",
          "Fill the skeleton:\n\n```cpp\nstd::cout << offsetof(Player, ___) << \" \";\nstd::cout << offsetof(Player, ___) << \" \";\nstd::cout << offsetof(Player, ___) << std::endl;\n```",
          "Full solution:\n\n```cpp\nstd::cout << offsetof(Player, team) << \" \";\nstd::cout << offsetof(Player, hp) << \" \";\nstd::cout << offsetof(Player, alive) << std::endl;\n```",
        ],
        testCases: [
          {
            name: "offsets",
            stdin: "",
            expectedOutput: "0 4 8",
            hidden: false,
          },
          {
            name: "offsets again",
            stdin: "",
            expectedOutput: "0 4 8",
            hidden: true,
          },
        ],
      },
      {
        slug: "vault-flags",
        title: "Flags & Bit Masks",
        order: 3,
        xpReward: 40,
        guideContent: `# Flags & Bit Masks

One integer can hold 32 on/off switches. Each **bit** is a flag: god mode,
noclip, invisibility — games pack state exactly like this.

${F}cpp
int flags = 0;
flags |= (1 << 2);   // turn bit 2 ON   -> 4
flags &= ~(1 << 2);  // turn bit 2 OFF  -> 0
flags ^= (1 << 2);   // toggle bit 2
bool on = flags & (1 << 2);  // test bit 2
${F}

- \`|\` sets bits. \`&\` tests or masks them. \`^\` flips them.
- \`1 << n\` is the mask for bit \`n\`. Bit 2 has value 4.
- \`~mask\` inverts a mask so \`&\` clears instead of keeps.

Toggling a feature in a running game is usually one XOR away.

> **Gotcha:** \`=\` vs \`|=\`. \`flags = (1 << 2)\` wipes every other flag.
> \`flags |= (1 << 2)\` touches only bit 2.

## Your job

Read an integer \`flags\`. Toggle **bit 2** with XOR and print the result.`,
        exampleCode: `#include <iostream>

int main() {
    int flags;
    std::cin >> flags;
    flags ^= (1 << 2);
    std::cout << flags << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
0

Output:
4`,
        starterCode: `#include <iostream>

int main() {
    int flags;
    std::cin >> flags;

    // TODO: toggle bit 2, then print flags.

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int flags;
    std::cin >> flags;
    flags ^= (1 << 2);
    std::cout << flags << std::endl;
    return 0;
}`,
        hints: [
          "XOR with a mask flips exactly the bits the mask has set. The mask for bit 2 is `(1 << 2)`.",
          "One line: `flags ^= (1 << 2);` then print.",
          "Fill the blank:\n\n```cpp\nflags ___ (1 << 2);\nstd::cout << flags << std::endl;\n```",
          "Full solution:\n\n```cpp\nflags ^= (1 << 2);\nstd::cout << flags << std::endl;\n```",
        ],
        testCases: [
          {
            name: "0",
            stdin: "0",
            expectedOutput: "4",
            hidden: false,
          },
          {
            name: "7",
            stdin: "7",
            expectedOutput: "3",
            hidden: false,
          },
          {
            name: "4",
            stdin: "4",
            expectedOutput: "0",
            hidden: true,
          },
        ],
      },
      {
        slug: "vault-pattern-scan",
        title: "Pattern Scanning",
        order: 4,
        xpReward: 50,
        guideContent: `# Pattern Scanning

Game updates shuffle addresses, so cheats don't hardcode them. Instead they
**scan memory for a byte pattern** — a signature — and compute the address
from the match.

${F}cpp
// find first index of target in buffer, or -1
int scan(int* buffer, int size, int target) {
    for (int i = 0; i < size; i++) {
        if (buffer[i] == target) {
            return i;
        }
    }
    return -1;
}
${F}

Real scanners add wildcards (\`??\` bytes that match anything) so one changed
byte doesn't break the signature. The loop is the same idea.

> **Gotcha:** returning inside the loop on the first match is the whole point.
> Scanning past the first hit wastes time and can return the wrong instance.

## Your job

A buffer holds \`{10, 20, 30, 40, 50, 60, 70, 80, 90, 99}\`. Read a target
integer, print the index of its first occurrence, or \`-1\`.`,
        exampleCode: `#include <iostream>

int main() {
    int buffer[10] = {10, 20, 30, 40, 50, 60, 70, 80, 90, 99};
    int target;
    std::cin >> target;
    int found = -1;
    for (int i = 0; i < 10; i++) {
        if (buffer[i] == target) {
            found = i;
            break;
        }
    }
    std::cout << found << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
30

Output:
2`,
        starterCode: `#include <iostream>

int main() {
    int buffer[10] = {10, 20, 30, 40, 50, 60, 70, 80, 90, 99};
    int target;
    std::cin >> target;

    // TODO: find first index of target, or -1. Print it.

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int buffer[10] = {10, 20, 30, 40, 50, 60, 70, 80, 90, 99};
    int target;
    std::cin >> target;
    int found = -1;
    for (int i = 0; i < 10; i++) {
        if (buffer[i] == target) {
            found = i;
            break;
        }
    }
    std::cout << found << std::endl;
    return 0;
}`,
        hints: [
          "Walk the buffer, compare each slot to the target, remember the index and stop at the first hit.",
          "Default `found` to `-1` so a miss prints correctly without extra code.",
          "Fill the skeleton:\n\n```cpp\nint found = -1;\nfor (int i = 0; i < 10; i++) {\n    if (buffer[i] == ___) {\n        found = ___;\n        break;\n    }\n}\nstd::cout << found << std::endl;\n```",
          "Full solution:\n\n```cpp\nint found = -1;\nfor (int i = 0; i < 10; i++) {\n    if (buffer[i] == target) {\n        found = i;\n        break;\n    }\n}\nstd::cout << found << std::endl;\n```",
        ],
        testCases: [
          {
            name: "30",
            stdin: "30",
            expectedOutput: "2",
            hidden: false,
          },
          {
            name: "99",
            stdin: "99",
            expectedOutput: "9",
            hidden: false,
          },
          {
            name: "miss",
            stdin: "5",
            expectedOutput: "-1",
            hidden: true,
          },
        ],
      },
      {
        slug: "vault-aim-math",
        title: "Aim Math",
        order: 5,
        xpReward: 50,
        guideContent: `# Aim Math

Every aimbot and ESP is vector math. Distance between two 3D points decides
what gets drawn, what gets targeted, and what gets ignored.

${F}cpp
// squared distance avoids the expensive sqrt when comparing
int dx = x2 - x1;
int dy = y2 - y1;
int dz = z2 - z1;
int distSq = dx*dx + dy*dy + dz*dz;
${F}

- Compare **squared** distances to skip \`sqrt\` — ordering is identical and
  it's far cheaper per frame across thousands of entities.
- Take the real root only when you need the number itself (display, FOV
  checks in world units).
- Nearest-target selection is a running minimum over \`distSq\`, exactly
  like the max-tracking loop from the arrays lesson.

> **Gotcha:** comparing squared against non-squared mixes units. Pick one
> side of the comparison and square (or root) the other to match.

## Your job

Read \`x1 y1 z1 x2 y2 z2\` and print the **squared** 3D distance between the
two points.`,
        exampleCode: `#include <iostream>

int main() {
    int x1, y1, z1, x2, y2, z2;
    std::cin >> x1 >> y1 >> z1 >> x2 >> y2 >> z2;
    int dx = x2 - x1;
    int dy = y2 - y1;
    int dz = z2 - z1;
    std::cout << dx*dx + dy*dy + dz*dz << std::endl;
    return 0;
}`,
        exampleOutput: `Input:
0 0 0 3 4 0

Output:
25`,
        starterCode: `#include <iostream>

int main() {
    int x1, y1, z1, x2, y2, z2;
    std::cin >> x1 >> y1 >> z1 >> x2 >> y2 >> z2;

    // TODO: print the squared distance between the two points.

    return 0;
}`,
        solutionCode: `#include <iostream>

int main() {
    int x1, y1, z1, x2, y2, z2;
    std::cin >> x1 >> y1 >> z1 >> x2 >> y2 >> z2;
    int dx = x2 - x1;
    int dy = y2 - y1;
    int dz = z2 - z1;
    std::cout << dx*dx + dy*dy + dz*dz << std::endl;
    return 0;
}`,
        hints: [
          "Differences first, then square each and add. No sqrt needed.",
          "Three lines: `dx`, `dy`, `dz`, then print the sum of squares.",
          "Fill the blank:\n\n```cpp\nint dx = x2 - x1;\nint dy = y2 - y1;\nint dz = z2 - z1;\nstd::cout << ___ + ___ + ___ << std::endl;\n```",
          "Full solution:\n\n```cpp\nstd::cout << dx*dx + dy*dy + dz*dz << std::endl;\n```",
        ],
        testCases: [
          {
            name: "3-4-0",
            stdin: "0 0 0 3 4 0",
            expectedOutput: "25",
            hidden: false,
          },
          {
            name: "same point",
            stdin: "1 1 1 1 1 1",
            expectedOutput: "0",
            hidden: false,
          },
          {
            name: "1-2-2",
            stdin: "0 0 0 1 2 2",
            expectedOutput: "9",
            hidden: true,
          },
        ],
      },
    ],
  },
];
