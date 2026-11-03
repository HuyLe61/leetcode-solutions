// src/remind/job.ts
import { readFileSync } from "node:fs";

// src/types.ts
var TOPICS = [
  ["Arrays", "ARR"],
  ["Hash maps", "HSH"],
  ["Two pointers", "2PT"],
  ["Sliding window", "SLW"],
  ["Stacks", "STK"],
  ["Binary search", "BIN"],
  ["Linked lists", "LNK"],
  ["Trees", "TRE"],
  ["Graphs", "GRF"],
  ["Heaps", "HEP"],
  ["Dynamic programming", "DP"],
  ["Greedy", "GRD"],
  ["Backtracking", "BKT"],
  ["Math", "MTH"]
];

// src/logic/time.ts
var DAY = 864e5;
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmt(sec) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? "0" : ""}${r}`;
}
function dayKey(ts) {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function parseDay(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function addDays(key, n) {
  const d = parseDay(key);
  d.setDate(d.getDate() + n);
  return dayKey(d);
}
function daysBetween(a, b) {
  return Math.round((parseDay(b).getTime() - parseDay(a).getTime()) / DAY);
}
function mondayOf(key) {
  const dow = (parseDay(key).getDay() + 6) % 7;
  return addDays(key, -dow);
}
function shortDate(key) {
  const d = parseDay(key);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}
function mean(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

// src/logic/solves.ts
var byTime = (solves) => [...solves].sort((a, b) => a.ts - b.ts);
function firstSolves(solves) {
  const seen = /* @__PURE__ */ new Set();
  return byTime(solves).filter((s) => seen.has(s.slug) ? false : (seen.add(s.slug), true));
}
function counts(solves) {
  const c = { total: 0, Easy: 0, Medium: 0, Hard: 0 };
  for (const s of firstSolves(solves)) {
    c.total++;
    c[s.difficulty]++;
  }
  return c;
}
function perDay(solves) {
  const m = /* @__PURE__ */ new Map();
  for (const s of solves) {
    const k = dayKey(s.ts);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

// src/logic/history.ts
var DEFAULT_TARGETS = { Easy: 300, Medium: 600, Hard: 1200 };

// src/logic/reminders.ts
var DEFAULT_REMINDERS = { nudge: true, streak: true, pace: true, milestone: true, friends: false };
var DEFAULT_TIMES = { nudge: 8 * 60, streak: 20 * 60, pace: 19 * 60 };
var TIMED = ["nudge", "streak", "pace"];
var LAST_CALL = 22 * 60 + 30;
var QUIET_UNTIL = 8 * 60;
function reminderText(key, tone, f) {
  const enc = tone === "enc";
  switch (key) {
    case "nudge": {
      const plan = f.rivalTopic ? `one ${f.rivalTopic.toLowerCase()} problem, one warm-up` : "one warm-up, one Medium";
      return enc ? `Box, box. Today\u2019s strategy: ${plan}. About 30 minutes.` : `${f.dailyLaps} problems planned today. ${f.todayCount} logged.`;
    }
    case "streak":
      return enc ? f.streak > 0 ? `Your ${f.streak}-day stint is still alive. One Easy before midnight and we stay out.` : "Fresh stint tonight. One Easy gets the odometer running." : `Streak: ${f.streak} days. Resets at midnight unless 1 problem is logged.`;
    case "pace":
      if (!f.goal) return enc ? "Set a goal and I\u2019ll keep you on the right delta." : "No goal set.";
      if (f.goal.done) return enc ? `Goal done: ${f.goal.target} solved. Time to set a bigger one.` : `${f.goal.by} goal: done (${f.goal.cur} of ${f.goal.target}).`;
      return enc ? f.goal.onPace ? `Right in the window for ${f.goal.target} by ${f.goal.by}. Keep the rhythm.` : `Slightly off the ${f.goal.by} delta. Two extra laps this week and we\u2019re back in the window.` : `${f.goal.by} goal: ${f.goal.cur} of ${f.goal.target}. Needed ${f.goal.needed}, current ${f.goal.pace}.`;
    case "milestone":
      if (!f.nextCar) return enc ? "Every car is in the garage. Legend." : "All cars unlocked.";
      return enc ? `${f.nextCar.name} unlocked. Go take a look.` : `Unlocked: ${f.nextCar.name} (${f.nextCar.th} solved).`;
    case "friends":
      if (!f.leader) return enc ? "Invite your crew and I\u2019ll call the gaps." : "No crew yet.";
      return enc ? `${f.leader.name} leads the week with ${f.leader.value}. Gap is ${f.leader.gap}, very catchable.` : `${f.leader.name}: ${f.leader.value} this week. Your gap: ${f.leader.gap}.`;
  }
}

// src/logic/settings.ts
var defaultSettings = () => ({
  targets: { ...DEFAULT_TARGETS },
  goals: [],
  reminders: { ...DEFAULT_REMINDERS },
  quiet: true,
  times: { ...DEFAULT_TIMES },
  quietDays: [],
  tone: "enc",
  theme: null,
  lang: "Python"
});
var isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
var isInt = (x, lo, hi) => typeof x === "number" && Number.isInteger(x) && x >= lo && x <= hi;
var isDay = (x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x);
var TOPIC_NAMES = new Set(TOPICS.map(([t]) => t));
function cleanGoal(x) {
  if (!isObj(x) || typeof x.id !== "string") return null;
  if (x.type === "total" && isInt(x.target, 1, 5e3) && isDay(x.by)) return { id: x.id, type: "total", target: x.target, by: x.by };
  if (x.type === "daily" && isInt(x.perDay, 1, 50)) return { id: x.id, type: "daily", perDay: x.perDay };
  if (x.type === "topic" && TOPIC_NAMES.has(x.topic) && isInt(x.count, 1, 5e3) && isDay(x.start) && isDay(x.end)) {
    return { id: x.id, type: "topic", topic: x.topic, count: x.count, start: x.start, end: x.end };
  }
  return null;
}
function cleanSettings(raw) {
  const d = defaultSettings();
  const x = isObj(raw) ? raw : {};
  const rem = isObj(x.reminders) ? x.reminders : {};
  const times = isObj(x.times) ? x.times : {};
  const targets = isObj(x.targets) ? x.targets : {};
  for (const k of Object.keys(d.reminders)) if (typeof rem[k] === "boolean") d.reminders[k] = rem[k];
  for (const k of TIMED) if (isInt(times[k], 0, 1439)) d.times[k] = times[k];
  for (const k of ["Easy", "Medium", "Hard"]) if (isInt(targets[k], 30, 3 * 3600)) d.targets[k] = targets[k];
  if (x.tone === "enc" || x.tone === "facts") d.tone = x.tone;
  if (typeof x.quiet === "boolean") d.quiet = x.quiet;
  if (Array.isArray(x.quietDays)) d.quietDays = [...new Set(x.quietDays.filter((n) => isInt(n, 0, 6)))].sort();
  if (Array.isArray(x.goals)) d.goals = x.goals.map(cleanGoal).filter((g) => g != null);
  return { ...d, tz: typeof x.tz === "string" && /^[A-Za-z_]+(\/[A-Za-z0-9_+-]+)*$/.test(x.tz) ? x.tz : null };
}

// src/logic/catalog.ts
var D = { E: "Easy", M: "Medium", H: "Hard" };
var ROWS = [
  ["two-sum", "Two Sum", "E", "Arrays", "Hash maps"],
  ["best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock", "E", "Arrays"],
  ["contains-duplicate", "Contains Duplicate", "E", "Arrays", "Hash maps"],
  ["majority-element", "Majority Element", "E", "Arrays"],
  ["move-zeroes", "Move Zeroes", "E", "Arrays", "Two pointers"],
  ["missing-number", "Missing Number", "E", "Arrays", "Math"],
  ["concatenation-of-array", "Concatenation of Array", "E", "Arrays"],
  ["max-consecutive-ones", "Max Consecutive Ones", "E", "Arrays"],
  ["product-of-array-except-self", "Product of Array Except Self", "M", "Arrays"],
  ["maximum-subarray", "Maximum Subarray", "M", "Arrays", "Dynamic programming"],
  ["merge-intervals", "Merge Intervals", "M", "Arrays"],
  ["rotate-array", "Rotate Array", "M", "Arrays"],
  ["insert-interval", "Insert Interval", "M", "Arrays"],
  ["spiral-matrix", "Spiral Matrix", "M", "Arrays"],
  ["set-matrix-zeroes", "Set Matrix Zeroes", "M", "Arrays"],
  ["first-missing-positive", "First Missing Positive", "H", "Arrays"],
  ["valid-anagram", "Valid Anagram", "E", "Hash maps"],
  ["ransom-note", "Ransom Note", "E", "Hash maps"],
  ["isomorphic-strings", "Isomorphic Strings", "E", "Hash maps"],
  ["word-pattern", "Word Pattern", "E", "Hash maps"],
  ["happy-number", "Happy Number", "E", "Hash maps", "Math"],
  ["group-anagrams", "Group Anagrams", "M", "Hash maps"],
  ["longest-consecutive-sequence", "Longest Consecutive Sequence", "M", "Hash maps"],
  ["subarray-sum-equals-k", "Subarray Sum Equals K", "M", "Hash maps"],
  ["valid-sudoku", "Valid Sudoku", "M", "Hash maps"],
  ["lru-cache", "LRU Cache", "M", "Hash maps", "Linked lists"],
  ["encode-and-decode-strings", "Encode and Decode Strings", "M", "Hash maps"],
  ["valid-palindrome", "Valid Palindrome", "E", "Two pointers"],
  ["merge-sorted-array", "Merge Sorted Array", "E", "Two pointers"],
  ["two-sum-ii-input-array-is-sorted", "Two Sum II", "M", "Two pointers"],
  ["3sum", "3Sum", "M", "Two pointers"],
  ["container-with-most-water", "Container With Most Water", "M", "Two pointers"],
  ["sort-colors", "Sort Colors", "M", "Two pointers"],
  ["trapping-rain-water", "Trapping Rain Water", "H", "Two pointers", "Stacks"],
  ["maximum-average-subarray-i", "Maximum Average Subarray I", "E", "Sliding window"],
  ["longest-substring-without-repeating-characters", "Longest Substring Without Repeating Characters", "M", "Sliding window"],
  ["longest-repeating-character-replacement", "Longest Repeating Character Replacement", "M", "Sliding window"],
  ["permutation-in-string", "Permutation in String", "M", "Sliding window"],
  ["minimum-size-subarray-sum", "Minimum Size Subarray Sum", "M", "Sliding window"],
  ["minimum-window-substring", "Minimum Window Substring", "H", "Sliding window"],
  ["sliding-window-maximum", "Sliding Window Maximum", "H", "Sliding window", "Heaps"],
  ["valid-parentheses", "Valid Parentheses", "E", "Stacks"],
  ["baseball-game", "Baseball Game", "E", "Stacks"],
  ["min-stack", "Min Stack", "M", "Stacks"],
  ["evaluate-reverse-polish-notation", "Evaluate Reverse Polish Notation", "M", "Stacks"],
  ["daily-temperatures", "Daily Temperatures", "M", "Stacks"],
  ["car-fleet", "Car Fleet", "M", "Stacks"],
  ["largest-rectangle-in-histogram", "Largest Rectangle in Histogram", "H", "Stacks"],
  ["binary-search", "Binary Search", "E", "Binary search"],
  ["search-insert-position", "Search Insert Position", "E", "Binary search"],
  ["first-bad-version", "First Bad Version", "E", "Binary search"],
  ["search-a-2d-matrix", "Search a 2D Matrix", "M", "Binary search"],
  ["koko-eating-bananas", "Koko Eating Bananas", "M", "Binary search"],
  ["find-minimum-in-rotated-sorted-array", "Find Minimum in Rotated Sorted Array", "M", "Binary search"],
  ["search-in-rotated-sorted-array", "Search in Rotated Sorted Array", "M", "Binary search"],
  ["time-based-key-value-store", "Time Based Key-Value Store", "M", "Binary search", "Hash maps"],
  ["median-of-two-sorted-arrays", "Median of Two Sorted Arrays", "H", "Binary search"],
  ["reverse-linked-list", "Reverse Linked List", "E", "Linked lists"],
  ["merge-two-sorted-lists", "Merge Two Sorted Lists", "E", "Linked lists"],
  ["linked-list-cycle", "Linked List Cycle", "E", "Linked lists", "Two pointers"],
  ["middle-of-the-linked-list", "Middle of the Linked List", "E", "Linked lists"],
  ["reorder-list", "Reorder List", "M", "Linked lists"],
  ["remove-nth-node-from-end-of-list", "Remove Nth Node From End of List", "M", "Linked lists"],
  ["add-two-numbers", "Add Two Numbers", "M", "Linked lists", "Math"],
  ["copy-list-with-random-pointer", "Copy List with Random Pointer", "M", "Linked lists", "Hash maps"],
  ["merge-k-sorted-lists", "Merge k Sorted Lists", "H", "Linked lists", "Heaps"],
  ["invert-binary-tree", "Invert Binary Tree", "E", "Trees"],
  ["maximum-depth-of-binary-tree", "Maximum Depth of Binary Tree", "E", "Trees"],
  ["same-tree", "Same Tree", "E", "Trees"],
  ["diameter-of-binary-tree", "Diameter of Binary Tree", "E", "Trees"],
  ["subtree-of-another-tree", "Subtree of Another Tree", "E", "Trees"],
  ["binary-tree-level-order-traversal", "Binary Tree Level Order Traversal", "M", "Trees"],
  ["validate-binary-search-tree", "Validate Binary Search Tree", "M", "Trees"],
  ["kth-smallest-element-in-a-bst", "Kth Smallest Element in a BST", "M", "Trees"],
  ["lowest-common-ancestor-of-a-binary-search-tree", "Lowest Common Ancestor of a BST", "M", "Trees"],
  ["binary-tree-right-side-view", "Binary Tree Right Side View", "M", "Trees"],
  ["construct-binary-tree-from-preorder-and-inorder-traversal", "Construct Binary Tree from Preorder and Inorder", "M", "Trees"],
  ["binary-tree-maximum-path-sum", "Binary Tree Maximum Path Sum", "H", "Trees"],
  ["serialize-and-deserialize-binary-tree", "Serialize and Deserialize Binary Tree", "H", "Trees"],
  ["flood-fill", "Flood Fill", "E", "Graphs"],
  ["number-of-islands", "Number of Islands", "M", "Graphs"],
  ["course-schedule", "Course Schedule", "M", "Graphs"],
  ["pacific-atlantic-water-flow", "Pacific Atlantic Water Flow", "M", "Graphs"],
  ["clone-graph", "Clone Graph", "M", "Graphs", "Hash maps"],
  ["rotting-oranges", "Rotting Oranges", "M", "Graphs"],
  ["course-schedule-ii", "Course Schedule II", "M", "Graphs"],
  ["word-ladder", "Word Ladder", "H", "Graphs"],
  ["last-stone-weight", "Last Stone Weight", "E", "Heaps"],
  ["kth-largest-element-in-a-stream", "Kth Largest Element in a Stream", "E", "Heaps"],
  ["kth-largest-element-in-an-array", "Kth Largest Element in an Array", "M", "Heaps"],
  ["top-k-frequent-elements", "Top K Frequent Elements", "M", "Heaps", "Hash maps"],
  ["k-closest-points-to-origin", "K Closest Points to Origin", "M", "Heaps"],
  ["task-scheduler", "Task Scheduler", "M", "Heaps", "Greedy"],
  ["find-median-from-data-stream", "Find Median from Data Stream", "H", "Heaps"],
  ["climbing-stairs", "Climbing Stairs", "E", "Dynamic programming"],
  ["min-cost-climbing-stairs", "Min Cost Climbing Stairs", "E", "Dynamic programming"],
  ["house-robber", "House Robber", "M", "Dynamic programming"],
  ["house-robber-ii", "House Robber II", "M", "Dynamic programming"],
  ["coin-change", "Coin Change", "M", "Dynamic programming"],
  ["longest-increasing-subsequence", "Longest Increasing Subsequence", "M", "Dynamic programming"],
  ["word-break", "Word Break", "M", "Dynamic programming"],
  ["unique-paths", "Unique Paths", "M", "Dynamic programming"],
  ["longest-common-subsequence", "Longest Common Subsequence", "M", "Dynamic programming"],
  ["edit-distance", "Edit Distance", "H", "Dynamic programming"],
  ["assign-cookies", "Assign Cookies", "E", "Greedy"],
  ["lemonade-change", "Lemonade Change", "E", "Greedy"],
  ["jump-game", "Jump Game", "M", "Greedy"],
  ["jump-game-ii", "Jump Game II", "M", "Greedy"],
  ["gas-station", "Gas Station", "M", "Greedy"],
  ["partition-labels", "Partition Labels", "M", "Greedy"],
  ["candy", "Candy", "H", "Greedy"],
  ["subsets", "Subsets", "M", "Backtracking"],
  ["combination-sum", "Combination Sum", "M", "Backtracking"],
  ["permutations", "Permutations", "M", "Backtracking"],
  ["word-search", "Word Search", "M", "Backtracking"],
  ["generate-parentheses", "Generate Parentheses", "M", "Backtracking", "Stacks"],
  ["n-queens", "N-Queens", "H", "Backtracking"],
  ["palindrome-number", "Palindrome Number", "E", "Math"],
  ["plus-one", "Plus One", "E", "Math", "Arrays"],
  ["sqrtx", "Sqrt(x)", "E", "Math", "Binary search"],
  ["reverse-integer", "Reverse Integer", "M", "Math"],
  ["powx-n", "Pow(x, n)", "M", "Math"],
  ["rotate-image", "Rotate Image", "M", "Math", "Arrays"]
];
var CATALOG = ROWS.map(([slug, title, d, ...topics]) => ({ slug, title, difficulty: D[d], topics }));
var BY_SLUG = new Map(CATALOG.map((p) => [p.slug, p]));
function findProblem(slug) {
  return BY_SLUG.get(slug);
}
var leetcodeUrl = (slug) => `https://leetcode.com/problems/${slug}/`;
var STARTERS = ["two-sum", "valid-parentheses", "best-time-to-buy-and-sell-stock"];

// src/logic/garage.ts
var car = (th, name, shape, paint, quip) => ({ th, name, shape, paint, quip });
var TRACKS = [
  { id: "total", title: "Daily drivers", sub: "Every accepted problem counts toward these.", unit: "solved", cars: [
    car(1, "Shopping cart", "cart", "#C9CED6", "It has wheels. Technically."),
    car(10, "2004 Corolla, 280k miles", "sedan", "#D8CBA6", "Unkillable. Like your hash maps."),
    car(25, "Honda Civic", "hatch", "#7FB2E5", "The Two Sum of cars."),
    car(50, "Subaru WRX", "sedan", "#2E4BFF", "Now we\u2019re rallying."),
    car(75, "Mazda MX-5 Miata", "roadster", "#FF5A3C", "Miata is always the answer."),
    car(100, "Ford Mustang GT", "muscle", "#FFD84D", "Loud, proud and 100 deep."),
    car(150, "Porsche 911", "sports", "#9AA4B1", "Same shape for 60 years. Like binary search."),
    car(200, "Nissan GT-R", "gt", "#5A6070", "Godzilla. Arrives with your 200th solve."),
    car(300, "Lamborghini Hurac\xE1n", "wedge", "#9BE15D", "The neighbors will ask what you do."),
    car(500, "Bugatti Chiron", "sports", "#2B3A8C", "At this point you\u2019re the interviewer.")
  ] },
  { id: "med", title: "The M3 track", sub: "Medium problems only. The interview staple.", unit: "Mediums", cars: [
    car(10, "VW Golf GTI", "hatch", "#F2F2EE", "Hot hatch, warm Mediums."),
    car(50, "Audi RS3", "sedan", "#6F7BFF", "Five cylinders, fifty Mediums."),
    car(100, "Toyota Supra", "sports", "#FF8A00", "Big turbo energy."),
    car(200, "BMW M3", "gt", "#3D8BFF", "200 Mediums. You\u2019ve earned the M badge.")
  ] },
  { id: "hard", title: "Hypercar wing", sub: "Hard problems unlock the exotics.", unit: "Hards", cars: [
    car(1, "Countach poster", "wedge", "#FF3B6B", "It\u2019s a poster on your wall. For now."),
    car(10, "Ferrari F40", "wedge", "#E5322D", "Twin turbos, twin pointers."),
    car(25, "McLaren F1", "sports", "#FF8A00", "Center seat, center of attention."),
    car(50, "Koenigsegg Jesko", "wedge", "#C9D2FF", "Pronounce it right and it\u2019s yours.")
  ] }
];
function trackCounts(solves) {
  const c = counts(solves);
  return { total: c.total, med: c.Medium, hard: c.Hard };
}
function garage(solves) {
  const c = trackCounts(solves);
  return TRACKS.map((def) => {
    const count = c[def.id];
    return { def, count, owned: def.cars.filter((k) => count >= k.th), next: def.cars.find((k) => count < k.th) ?? null };
  });
}
var carsOwned = (g) => g.reduce((n, t) => n + t.owned.length, 0);
function rideFor(n) {
  let name = "On foot";
  for (const k of TRACKS[0].cars) if (n >= k.th) name = k.name;
  return name;
}
function newCars(before, after) {
  const had = new Set(garage(before).flatMap((t) => t.owned.map((k) => k.name)));
  return garage(after).flatMap((t) => t.owned).filter((k) => !had.has(k.name));
}

// src/logic/goals.ts
var PACE_DAYS = 14;
function trailingPace(solves, today, days = PACE_DAYS, filter) {
  const from = addDays(today, -(days - 1));
  const n = firstSolves(solves).filter((s) => dayKey(s.ts) >= from && dayKey(s.ts) <= today && (!filter || filter(s))).length;
  return n / days;
}
function neededPace(remaining, daysLeft) {
  if (remaining <= 0) return 0;
  return remaining / Math.max(1, daysLeft);
}
function goalProgress(goal, solves, today) {
  if (goal.type === "total") {
    const cur2 = counts(solves).total;
    const daysLeft2 = Math.max(0, daysBetween(today, goal.by));
    const pace2 = trailingPace(solves, today);
    const needed2 = neededPace(goal.target - cur2, daysLeft2);
    return {
      goal,
      cur: cur2,
      target: goal.target,
      frac: Math.min(1, cur2 / goal.target),
      pace: pace2,
      needed: needed2,
      daysLeft: daysLeft2,
      onPace: pace2 >= needed2,
      done: cur2 >= goal.target,
      projection: Math.round(cur2 + pace2 * daysLeft2)
    };
  }
  if (goal.type === "daily") {
    const day = perDay(solves);
    const cur2 = day.get(today) ?? 0;
    let week = 0;
    for (let i = 0; i < 7; i++) week += day.get(addDays(today, -i)) ?? 0;
    const pace2 = week / 7;
    return {
      goal,
      cur: cur2,
      target: goal.perDay,
      frac: Math.min(1, cur2 / goal.perDay),
      pace: pace2,
      needed: goal.perDay,
      daysLeft: 1,
      onPace: pace2 >= goal.perDay,
      done: cur2 >= goal.perDay,
      projection: null
    };
  }
  const inRange = (s) => s.topics.includes(goal.topic) && dayKey(s.ts) >= goal.start && dayKey(s.ts) <= goal.end;
  const cur = firstSolves(solves).filter(inRange).length;
  const daysLeft = Math.max(0, daysBetween(today, goal.end) + 1);
  const elapsed = Math.max(1, daysBetween(goal.start, today) + 1);
  const pace = cur / elapsed;
  const needed = neededPace(goal.count - cur, daysLeft);
  return {
    goal,
    cur,
    target: goal.count,
    frac: Math.min(1, cur / goal.count),
    pace,
    needed,
    daysLeft,
    onPace: pace >= needed,
    done: cur >= goal.count,
    projection: null
  };
}
function paceText(perDay2) {
  if (perDay2 <= 0) return "0/day";
  if (perDay2 >= 0.95) return `${perDay2.toFixed(1)}/day`;
  return `1 per ${Math.round(1 / perDay2)} days`;
}

// src/logic/xp.ts
var XP = { Easy: 10, Medium: 25, Hard: 50, daily: 30, car: 50 };
var DAILY_LAPS = 3;
var XP_PER_LEVEL = 200;
var MAX_LEVEL = 15;
var TIERS = ["Learner\u2019s permit", "Commuter", "Street racer", "Track day", "Pro driver", "F1 legend"];
var ROMAN = ["I", "II", "III"];
function totalXp(solves, dailyLaps2 = DAILY_LAPS) {
  const solveXp = firstSolves(solves).reduce((n, s) => n + XP[s.difficulty], 0);
  const lapDays = [...perDay(solves).values()].filter((n) => n >= dailyLaps2).length;
  return solveXp + lapDays * XP.daily + carsOwned(garage(solves)) * XP.car;
}
function tierIndex(level) {
  if (level <= 3) return 0;
  if (level <= 6) return 1;
  if (level <= 9) return 2;
  if (level <= 12) return 3;
  if (level <= 14) return 4;
  return 5;
}
function levelInfo(xp) {
  const level = Math.min(MAX_LEVEL, Math.floor(xp / XP_PER_LEVEL) + 1);
  const floor = (level - 1) * XP_PER_LEVEL;
  const next = level < MAX_LEVEL ? level * XP_PER_LEVEL : null;
  const ti = tierIndex(level);
  const roman = ti < 5 ? ROMAN[(level - 1) % 3] : "";
  const nti = next ? tierIndex(level + 1) : null;
  return {
    level,
    xp,
    floor,
    next,
    frac: next ? (xp - floor) / XP_PER_LEVEL : 1,
    tier: TIERS[ti],
    roman,
    name: roman ? `${TIERS[ti]} ${roman}` : TIERS[ti],
    nextTier: nti == null ? null : TIERS[nti]
  };
}
var tierName = (level) => levelInfo((level - 1) * XP_PER_LEVEL).name;

// src/logic/standings.ts
function rank(people, board) {
  const val = (p) => board === "all" ? p.all : p.week;
  const rows = [...people].sort((a, b) => val(b) - val(a) || Number(!!a.me) - Number(!!b.me));
  const mx = Math.max(1, val(rows[0] ?? { week: 0, all: 0 }));
  return rows.map((p, i) => ({
    rank: i + 1,
    name: p.name,
    ini: p.ini,
    me: !!p.me,
    value: val(p),
    streak: p.streak,
    level: p.level,
    tier: tierName(p.level),
    ride: rideFor(p.all),
    frac: Math.max(0.04, val(p) / mx)
  }));
}

// src/logic/streak.ts
function streakInfo(solves, today) {
  const days = perDay(solves);
  const has = (k) => (days.get(k) ?? 0) > 0;
  const solvedToday = has(today);
  let current = 0;
  for (let k = solvedToday ? today : addDays(today, -1); has(k); k = addDays(k, -1)) current++;
  const sorted = [...days.keys()].sort();
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const k of sorted) {
    run = prev && addDays(prev, 1) === k ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = k;
  }
  const last = sorted[sorted.length - 1] ?? null;
  const broken = current === 0 && last != null;
  let lastRun = 0;
  if (broken) for (let k = last; has(k); k = addDays(k, -1)) lastRun++;
  return {
    current,
    longest,
    solvedToday,
    atRisk: current > 0 && !solvedToday,
    broken,
    lastRun,
    endedOn: broken ? last : null
  };
}

// src/logic/topics.ts
var MIN_SOLVES = 3;
function topicStatus(first, avgSec, solved) {
  if (solved < MIN_SOLVES) return "none";
  const avg = avgSec ?? 0;
  if (first >= 75 && avgSec != null && avg <= 600) return "strong";
  if (first <= 35 || avg >= 1200) return "weak";
  return "dev";
}
var LABEL = {
  strong: ["Strong", "\u2605\u2605\u2605"],
  dev: ["Getting there", "\u2605\u2605\u2606"],
  weak: ["Weak", "\u2605\u2606\u2606"],
  none: ["Warming up", "\u2606\u2606\u2606"]
};
var RANK = { weak: 0, dev: 1, strong: 2, none: 3 };
function nextProblem(topic, solvedSlugs) {
  const pool = CATALOG.filter((p) => p.topics[0] === topic && !solvedSlugs.has(p.slug));
  const order = { Medium: 0, Easy: 1, Hard: 2 };
  return [...pool].sort((a, b) => order[a.difficulty] - order[b.difficulty])[0] ?? null;
}
function whyFor(t, slowest, isRival) {
  if (isRival) return `Lowest first-try rate (${t.first}%). Plan before you code.`;
  if (slowest?.solveSec && slowest.solveSec >= 1200)
    return `${slowest.title} took ${Math.round(slowest.solveSec / 60)} min. Same pattern, fresh problem.`;
  if (t.avgSec != null && t.avgSec >= 1200) return `${fmt(t.avgSec)} average. Aim for under 20:00.`;
  return `${t.first}% first try. Push it past 75%.`;
}
function topicStats(solves) {
  const solvedSlugs = new Set(solves.map((s) => s.slug));
  const stats = TOPICS.map(([name, code]) => {
    const mine = solves.filter((s) => s.topics.includes(name));
    const solved = new Set(mine.map((s) => s.slug)).size;
    const avgSec = mean(mine.filter((s) => s.solveSec != null).map((s) => s.solveSec));
    const first = mine.length ? Math.round(mine.filter((s) => s.attempts === 1).length / mine.length * 100) : 0;
    const key = topicStatus(first, avgSec, solved);
    const slowest = [...mine].sort((a, b) => (b.solveSec ?? 0) - (a.solveSec ?? 0))[0];
    return { name, code, solved, avgSec, first, key, label: LABEL[key][0], stars: LABEL[key][1], slowest };
  });
  stats.sort((a, b) => RANK[a.key] - RANK[b.key] || a.first - b.first || (b.avgSec ?? 0) - (a.avgSec ?? 0));
  let rivalSeen = false;
  return stats.map(({ slowest, ...t }) => {
    const isRival = t.key === "weak" && !rivalSeen;
    if (isRival) rivalSeen = true;
    return { ...t, next: nextProblem(t.name, solvedSlugs), why: t.key === "weak" ? whyFor(t, slowest, isRival) : "" };
  });
}

// src/logic/today.ts
function dailyLaps(goals) {
  const g = goals.find((x) => x.type === "daily");
  return g && g.type === "daily" ? g.perDay : DAILY_LAPS;
}
function meRow(solves, today) {
  const mon = mondayOf(today);
  const week = new Set(solves.filter((s) => dayKey(s.ts) >= mon).map((s) => s.slug)).size;
  return {
    name: "You",
    ini: "YOU",
    me: true,
    week,
    all: counts(solves).total,
    streak: streakInfo(solves, today).current,
    level: levelInfo(totalXp(solves)).level
  };
}
function suggestProblem(solves) {
  const solved = new Set(solves.map((s) => s.slug));
  const starter = STARTERS.map((x) => findProblem(x)).find((p) => !solved.has(p.slug));
  if (starter) return starter;
  return topicStats(solves).find((t) => (t.key === "weak" || t.key === "dev") && t.next)?.next ?? null;
}

// src/logic/notify.ts
function reminderFacts(settings, solves, friends, today) {
  const total = settings.goals.find((g2) => g2.type === "total");
  const gp = total && total.type === "total" ? goalProgress(total, solves, today) : null;
  const g = garage(solves);
  const lastCar = g[0].owned[g[0].owned.length - 1] ?? null;
  const me = meRow(solves, today);
  const leader = rank([...friends, me], "wk")[0];
  return {
    todayCount: perDay(solves).get(today) ?? 0,
    dailyLaps: dailyLaps(settings.goals),
    streak: me.streak,
    rivalTopic: topicStats(solves).find((t) => t.key === "weak")?.name ?? null,
    goal: gp && total && total.type === "total" ? { cur: gp.cur, target: gp.target, by: shortDate(total.by), needed: paceText(gp.needed), pace: paceText(gp.pace), onPace: gp.onPace, done: gp.done } : null,
    nextCar: lastCar ? { name: lastCar.name, th: lastCar.th } : null,
    leader: leader && !leader.me && friends.length ? { name: leader.name, value: leader.value, gap: leader.value - me.week } : null
  };
}
var WINDOW_MIN = 3 * 60;
var CAR_WINDOW_MS = 10 * 36e5;
function planPushes({ solves, settings, now, sent }) {
  const d = new Date(now);
  const min = d.getHours() * 60 + d.getMinutes();
  if (settings.quiet && min < QUIET_UNTIL) return [];
  const today = dayKey(now);
  const f = reminderFacts(settings, solves, [], today);
  const enc = settings.tone === "enc";
  const on = settings.reminders;
  const restDay = settings.quietDays.includes(d.getDay());
  const at = (k) => settings.times[k];
  const due = (k) => min >= at(k) && min < at(k) + WINDOW_MIN;
  const p = suggestProblem(solves);
  const open = p ? { label: `Open ${p.title}`, url: leetcodeUrl(p.slug) } : null;
  const out = [];
  if (!restDay) {
    if (on.nudge && due("nudge") && f.todayCount < f.dailyLaps) {
      const lines = [reminderText("nudge", settings.tone, f)];
      if (p) lines.push(`Try: ${p.title} (${p.difficulty}).`);
      const next = garage(solves)[0].next;
      const total = counts(solves).total;
      if (next) lines.push(next.th - total === 1 ? `One more solve unlocks the ${next.name}.` : `${next.th - total} more to the ${next.name}.`);
      if (f.goal && !f.goal.onPace && !f.goal.done) lines.push(`Goal: ${f.goal.cur} of ${f.goal.target} by ${f.goal.by}. You need ${f.goal.needed}, you\u2019re at ${f.goal.pace}.`);
      out.push({ key: `nudge.${today}`, title: "Daily strategy", message: lines.join("\n"), priority: 3, tags: ["checkered_flag"], screen: "", action: open });
    }
    const lastCall = on.streak && f.todayCount === 0 && f.streak > 0 && at("streak") < LAST_CALL && min >= LAST_CALL;
    if (on.streak && f.todayCount === 0 && min >= at("streak") && !lastCall) {
      out.push({ key: `streak.${today}`, title: "Streak rescue", message: reminderText("streak", settings.tone, f), priority: 4, tags: ["fuelpump"], screen: "", action: open });
    }
    if (lastCall) {
      const left = 24 * 60 - min;
      out.push({
        key: `last.${today}`,
        title: "Last call",
        message: enc ? `${left} minutes left on the clock. One Easy keeps your ${f.streak}-day streak.` : `${left} minutes to midnight. Streak: ${f.streak} days.`,
        priority: 4,
        tags: ["hourglass"],
        screen: "",
        action: open
      });
    }
    if (on.pace && d.getDay() === 0 && due("pace")) {
      const week = meRow(solves, today).week;
      out.push({
        key: `pace.${today}`,
        title: "Pace check",
        message: `${reminderText("pace", settings.tone, f)}
This week: ${week} ${week === 1 ? "problem" : "problems"}.`,
        priority: 3,
        tags: ["chart_with_upwards_trend"],
        screen: "goals",
        action: null
      });
    }
  }
  if (on.milestone) {
    for (const car2 of newCars(solves.filter((s) => s.ts < now - CAR_WINDOW_MS), solves)) {
      out.push({
        key: `car.${car2.name}`,
        title: `New car: ${car2.name}`,
        message: enc ? `${car2.quip} It\u2019s in your garage now.` : `Unlocked: ${car2.name} (${car2.th} solved).`,
        priority: 3,
        tags: ["red_car"],
        screen: "garage",
        action: null
      });
    }
  }
  return out.filter((x) => !sent.has(x.key));
}

// src/data/records.ts
var DIFFS2 = ["Easy", "Medium", "Hard"];
var TOPIC_NAMES2 = new Set(TOPICS.map(([t]) => t));
function normalize(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const x = r;
    if (typeof x.id !== "string" || typeof x.slug !== "string" || typeof x.title !== "string") continue;
    if (!DIFFS2.includes(x.difficulty) || typeof x.ts !== "number" || !Number.isFinite(x.ts)) continue;
    out.push({
      id: x.id,
      slug: x.slug,
      title: x.title,
      difficulty: x.difficulty,
      topics: Array.isArray(x.topics) ? x.topics.filter((t) => TOPIC_NAMES2.has(t)) : [],
      ts: x.ts,
      lang: typeof x.lang === "string" ? x.lang : "Unknown",
      ...typeof x.runtime === "string" ? { runtime: x.runtime } : {},
      ...typeof x.solveSec === "number" && x.solveSec > 0 ? { solveSec: x.solveSec } : {},
      attempts: typeof x.attempts === "number" && x.attempts >= 1 ? Math.round(x.attempts) : 1,
      source: "sync"
    });
  }
  return out.sort((a, b) => a.ts - b.ts);
}

// src/remind/ntfy.ts
var DEFAULT_DASHBOARD = "https://leetcode-tracker-eight-pied.vercel.app";
var validTopic = (t) => /^[A-Za-z0-9_-]{16,64}$/.test(t);
var tapLink = (dashboard, key, screen) => `${dashboard.replace(/\/$/, "")}/?r=${encodeURIComponent(key)}#/${screen}`;
function sentKeys(ndjson) {
  const out = /* @__PURE__ */ new Set();
  for (const line of ndjson.split("\n")) {
    if (!line.trim()) continue;
    try {
      const m = JSON.parse(line);
      if (m.event !== "message" || !m.click) continue;
      const r = new URL(m.click).searchParams.get("r");
      if (r) out.add(r);
    } catch {
    }
  }
  return out;
}
function ntfyBody(p, topic, dashboard) {
  return {
    topic,
    title: p.title,
    message: p.message,
    priority: p.priority,
    tags: p.tags,
    click: tapLink(dashboard, p.key, p.screen),
    ...p.action ? { actions: [{ action: "view", label: p.action.label, url: p.action.url, clear: true }] } : {}
  };
}
function testPush(now) {
  return {
    key: `test.${now}`,
    title: "Grind Prix is connected",
    message: "Your LeetCode reminders will show up here. See you at the morning briefing.",
    priority: 3,
    tags: ["checkered_flag"],
    screen: "reminders",
    action: null
  };
}

// src/remind/job.ts
var env = process.env;
function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}
async function main() {
  const topic = (env.NTFY_TOPIC ?? "").trim();
  if (!topic) return console.log("No NTFY_TOPIC secret yet, so there is nothing to send.");
  if (!validTopic(topic)) throw new Error("NTFY_TOPIC should be 16\u201364 letters, digits, - or _.");
  const server = (env.NTFY_SERVER || "https://ntfy.sh").replace(/\/$/, "");
  const dashboard = env.DASHBOARD_URL || DEFAULT_DASHBOARD;
  const dry = env.DRY_RUN === "1";
  const now = dry && env.NOW ? new Date(env.NOW).getTime() : Date.now();
  let pushes;
  if (env.TEST === "true") pushes = [testPush(now)];
  else {
    const solves = normalize(readJson("data/solves.json"));
    const settings = cleanSettings(readJson("data/settings.json"));
    const r = await fetch(`${server}/${topic}/json?poll=1&since=12h`);
    if (!r.ok) throw new Error(`ntfy poll answered ${r.status}`);
    pushes = planPushes({ solves, settings, now, sent: sentKeys(await r.text()) });
  }
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(`${new Date(now).toLocaleString("en-US", { timeZone: zone })} (${zone}): ${pushes.length ? pushes.map((p) => p.key).join(", ") : "nothing due"}`);
  for (const p of pushes) {
    const body = ntfyBody(p, topic, dashboard);
    if (dry) {
      console.log(JSON.stringify({ ...body, topic: "***" }, null, 2));
      continue;
    }
    const r = await fetch(server, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`ntfy answered ${r.status} for ${p.key}`);
  }
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
