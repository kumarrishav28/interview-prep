import type { TheoryTopic } from './types';

export const theoryA: TheoryTopic[] = [
  {
    category: "Array / String",
    tagline: "Use indexed sequences to organize data and turn local operations into efficient scans.",
    overview: [
      "Arrays and strings store values in sequence, so each item has a position and the next item is easy to reach. Arrays usually have a fixed length; strings represent ordered characters and may be immutable. Their direct layout makes them the foundation for many interview problems.",
      "Direct indexing reads or replaces a known position in constant time. A scan inspects every item in linear time, and a second array can hold prefix information or transformed results. In-place algorithms reuse storage, often reducing memory at the cost of more careful index management.",
      "State what every index means before writing code. Track bounds, read and write positions, and whether an interval is inclusive or half-open. For strings, also consider whether characters mean bytes, Unicode code points, or UTF-16 code units; constraints may simplify this but representation still matters.",
      "Arrays suit positional access, but middle insertion or deletion may shift many values. Extra arrays and prefix tables consume memory; in-place updates can be harder to reason about. Choose a traversal and representation that fit the operation instead of defaulting to nested loops."
    ],
    layman: { analogy: "An array is like numbered lockers: you can go straight to locker 12, but making room in the middle means moving contents.", plainEnglish: ["Use a position number to access an item directly.", "A left-to-right scan checks every item once.", "Give every index a clear job.", "Changing the middle may require shifting later items."] },
    whenToUse: ["The input is a list, character sequence, or fixed row of values.", "The task asks for a one-pass calculation, rearrangement, or transformation.", "You need fast access to an item by position.", "An answer depends on elements before or after a position.", "The prompt requests in-place edits or limits extra storage."],
    keyIdeas: [
      { term: "Index", meaning: "The numeric position of an element, commonly starting at zero." },
      { term: "Traversal", meaning: "Visiting elements in a planned order, such as left to right." },
      { term: "In-place", meaning: "Updating the existing sequence rather than building a full replacement." },
      { term: "Prefix sum", meaning: "A running total that lets a range sum be found by subtracting two prefixes." },
      { term: "Half-open range", meaning: "A range containing its start but not its end, often written [left, right)." },
      { term: "Stable order", meaning: "Keeping retained elements in their original relative order." }
    ],
    algorithms: [
      { name: "Single-pass accumulation", layman: "Walk down a receipt once, adding each price instead of recounting it repeatedly.", how: ["Initialize an identity value, such as zero for a sum.", "Visit every element from first to last.", "Combine each item into the running result.", "Return the accumulated result."], code: `static long sum(int[] a) {\n    long total = 0;\n    for (int value : a) total += value;\n    return total;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use for totals, counts, extrema, and answers updated from each item." },
      { name: "Prefix sums for range queries", layman: "Write down the total so far at every point; subtract two notes to find the total between them.", how: ["Create a prefix array one item longer than the input.", "Set its first entry to zero.", "Store previous prefix plus current value at each step.", "Answer inclusive [left,right] with prefix[right+1] minus prefix[left]."], code: `static long[] buildPrefix(int[] a) {\n    long[] p = new long[a.length + 1];\n    for (int i = 0; i < a.length; i++) p[i + 1] = p[i] + a[i];\n    return p;\n}\nstatic long rangeSum(long[] p, int left, int right) {\n    return p[right + 1] - p[left];\n}`, time: "O(n) build, O(1) per query", space: "O(n)", useWhen: "Use for many static range-sum queries over the same unchanged array." },
      { name: "Read/write compaction", layman: "Read each item once and put only approved items into the next open spot at the front.", how: ["Set write to the first available output position.", "Scan each item with read.", "Copy a retained item to the write position.", "Advance write only after retaining an item.", "Return write as the new logical length."], code: `static int compactNonZero(int[] a) {\n    int write = 0;\n    for (int read = 0; read < a.length; read++) {\n        if (a[read] != 0) a[write++] = a[read];\n    }\n    return write;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use to filter or compact in place while preserving retained-item order." }
    ],
    examples: [
      { title: "Running total", problem: "Sum every value in one pass.", input: "values = [3, -1, 4]", steps: [
        { title: "Start", detail: "No values processed.", state: "index=0, total=0" }, { title: "Read 3", detail: "Add the first value.", state: "index=0, total=3" }, { title: "Read -1", detail: "The negative value reduces the total.", state: "index=1, total=2" }, { title: "Read 4", detail: "Add the final value.", state: "index=2, total=6" }, { title: "Finish", detail: "The scan is complete.", state: "index=3, total=6" }
      ], result: "6" },
      { title: "Compact zeroes", problem: "Move nonzero values to the front without changing their order.", input: "a = [0, 5, 0, 2]", steps: [
        { title: "Start", detail: "Read from the beginning; output begins at zero.", state: "read=0, write=0, a=[0,5,0,2]" }, { title: "Skip zero", detail: "Do not advance the output position.", state: "read=0, write=0" }, { title: "Keep 5", detail: "Copy 5 into the first output slot.", state: "read=1, write=1, a=[5,5,0,2]" }, { title: "Skip then keep", detail: "Skip index two and copy 2 to index one.", state: "read=3, write=2, a=[5,2,0,2]" }, { title: "Finish", detail: "The first two slots are the compacted result.", state: "length=2, prefix=[5,2]" }
      ], result: "Compacted prefix [5, 2], length 2." }
    ],
    pitfalls: ["Using int for a sum that can overflow; choose a wider type when needed.", "Mixing inclusive endpoints with half-open formulas.", "Advancing write for skipped items and leaving gaps.", "Assuming immutable strings can be edited in place.", "Returning array capacity instead of the filtered logical length."],
    related: ["Two Pointers", "Sliding Window", "Hashmap"]
  },
  {
    category: "Two Pointers",
    tagline: "Coordinate two positions so each move eliminates work instead of repeating it.",
    overview: [
      "Two-pointer methods maintain two indexes into a sequence, list, or separate inputs. They work when a movement rule proves progress: one pointer moves inward, one catches another, or a reader feeds a writer.",
      "On sorted data, opposite ends can decide which side to move based on whether a pair is too small or too large. In a linked list, a fast pointer can move twice as quickly as a slow one. In-place filtering uses a read pointer to inspect and a write pointer to fill the valid prefix.",
      "The technique often reduces quadratic pair enumeration to a linear scan, but it depends on a valid invariant. Sorted order lets a comparison safely discard candidates; without it, a move may skip the answer. Sorting first may alter positions or add time.",
      "State what each pointer represents and why its update is safe. Check termination and duplicate handling. This prevents infinite loops and off-by-one errors, especially for empty, singleton, or repeated-value inputs."
    ],
    layman: { analogy: "Two people inspect a row of seats, one from each end; clues tell them which way to move toward the answer.", plainEnglish: ["Give each position a clear job.", "Move only when you know which possibilities that move rules out.", "Sorted order can tell you a safe direction.", "Stop when pointers meet or cross, unless the task says otherwise."] },
    whenToUse: ["The task involves pairs in sorted data or asks for a target sum.", "A sequence must be reversed, partitioned, or filtered in place.", "A linked-list task asks for its middle or a cycle.", "The prompt asks for a palindrome or matching ends.", "A nested pair loop can be avoided using order or monotonicity."],
    keyIdeas: [
      { term: "Opposite ends", meaning: "Two indexes begin at the first and last positions and move inward." },
      { term: "Fast/slow", meaning: "Pointers move at different speeds to reveal middle or cycle structure." },
      { term: "Read/write", meaning: "One pointer examines input while another marks the next output slot." },
      { term: "Invariant", meaning: "A fact that remains true after every pointer update." },
      { term: "Monotonic property", meaning: "A value changes in one direction, helping safely rule out choices." },
      { term: "Convergence", meaning: "Pointers approach a meeting or crossing condition that ends the scan." }
    ],
    algorithms: [
      { name: "Opposite-end pair sum", layman: "On a sorted shelf, check the smallest and largest remaining values, then discard the side that cannot help.", how: ["Place left at the first and right at the last item.", "Add the two pointed values.", "Return their indexes if the sum matches.", "If too small, move left forward; if too large, move right backward.", "Stop when left meets right."], code: `static int[] twoSumSorted(int[] a, int target) {\n    int left = 0, right = a.length - 1;\n    while (left < right) {\n        long sum = (long) a[left] + a[right];\n        if (sum == target) return new int[] {left, right};\n        if (sum < target) left++; else right--;\n    }\n    return new int[] {-1, -1};\n}`, time: "O(n)", space: "O(1)", useWhen: "Use for a target pair in a sorted array using distinct positions." },
      { name: "Fast/slow middle node", layman: "One walker takes one step and another takes two; when the fast one ends, the slow one is halfway.", how: ["Initialize both pointers at the head.", "Move slow one node and fast two nodes.", "Continue while fast and fast.next exist.", "Return slow; for an even list this is the second middle."], code: `static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }\nstatic ListNode middleNode(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next; fast = fast.next.next;\n    }\n    return slow;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use to find a list midpoint in one pass, including when splitting a list." },
      { name: "Read/write stable filtering", layman: "A reader checks every item while a keeper puts approved items into the next open front spot.", how: ["Start write at zero.", "Scan using read from left to right.", "Copy each retained value to write.", "Advance write only after copying.", "Return the valid prefix length."], code: `static int removeValue(int[] a, int unwanted) {\n    int write = 0;\n    for (int read = 0; read < a.length; read++) {\n        if (a[read] != unwanted) a[write++] = a[read];\n    }\n    return write;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use to filter values in place while preserving survivor order." }
    ],
    examples: [
      { title: "Find a sorted pair", problem: "Return positions whose values add to the target.", input: "a = [1, 3, 6, 9], target = 10", steps: [
        { title: "Initialize", detail: "Begin with the smallest and largest remaining values.", state: "left=0 (1), right=3 (9)" }, { title: "Check pair", detail: "1 plus 9 equals the target.", state: "sum=10" }, { title: "Return", detail: "The matching values have distinct positions.", state: "answer=[0,3]" }, { title: "Stop", detail: "A match ends the scan immediately.", state: "left=0, right=3" }, { title: "Verify", detail: "Indexes are zero-based and sum correctly.", state: "values=[1,9]" }
      ], result: "[0, 3]" },
      { title: "Remove unwanted values", problem: "Compact values other than 2 and report the new length.", input: "a = [2, 1, 2, 3]", steps: [
        { title: "Start", detail: "No kept values have been written.", state: "read=0, write=0" }, { title: "Skip first 2", detail: "The unwanted value leaves write unchanged.", state: "write=0" }, { title: "Keep 1", detail: "Copy 1 to the first output slot.", state: "read=1, write=1, a=[1,1,2,3]" }, { title: "Skip 2 and keep 3", detail: "Skip index two, then copy 3 to index one.", state: "read=3, write=2, a=[1,3,2,3]" }, { title: "Finish", detail: "The first two entries form the stable result.", state: "length=2, prefix=[1,3]" }
      ], result: "Length 2 with prefix [1, 3]." }
    ],
    pitfalls: ["Using opposite-end moves on unsorted values without a safe ordering.", "Moving both pointers when only one move is justified.", "Forgetting pair indexes must be distinct.", "Dereferencing fast.next without null checks.", "Returning physical array length rather than compacted logical length."],
    related: ["Array / String", "Sliding Window", "Linked List"]
  },
  {
    category: "Sliding Window",
    tagline: "Maintain a moving contiguous range so repeated subarray work becomes incremental.",
    overview: [
      "A sliding window is a contiguous range represented by left and right boundaries. Rather than recomputing every candidate range, update state as the range expands or contracts. This is effective for substring and subarray problems.",
      "Fixed-size windows advance one step by adding a new item and removing the old first item. Variable windows grow until a condition holds, then shrink while it remains valid. The invariant describes exactly what the current range and maintained sum or counts mean.",
      "A variable window is often linear because each boundary moves only forward. This argument usually needs nonnegative values or another monotonic property. With arbitrary negative numbers, a sum may move unpredictably, so prefix sums or another approach may be needed.",
      "Windows can track sums, frequencies, distinct counts, or validity. Memory depends on maintained state. Be precise about longest versus shortest valid ranges and whether an empty range is permitted."
    ],
    layman: { analogy: "Move a magnifying glass along a row of words: add what enters, forget what leaves, and keep notes about what is under it.", plainEnglish: ["A window contains neighboring items and cannot skip positions.", "When the right edge moves, update for the newly included item.", "Move the left edge when the range must shrink.", "Write down the rule that must stay true in the current range."] },
    whenToUse: ["The prompt asks for a contiguous subarray or substring.", "It asks for the longest or shortest range satisfying a condition.", "The range has a fixed width and needs a rolling sum or average.", "Adding or removing one endpoint updates the tracked information cheaply.", "The condition changes predictably as a window expands or contracts."],
    keyIdeas: [
      { term: "Window", meaning: "A contiguous portion of the input between two moving boundaries." },
      { term: "Fixed-size window", meaning: "A range whose width remains constant as boundaries advance." },
      { term: "Variable-size window", meaning: "A range that grows and shrinks to satisfy a condition." },
      { term: "Window invariant", meaning: "Maintained facts that describe the current range correctly." },
      { term: "Expand", meaning: "Move the right boundary to include another item." },
      { term: "Shrink", meaning: "Move the left boundary to exclude items until a condition is restored." }
    ],
    algorithms: [
      { name: "Fixed-size rolling sum", layman: "Add the new number and subtract the number that just fell off the back.", how: ["Reject a nonpositive width or width larger than input.", "Sum the first window.", "Save its sum as the best so far.", "For each later right endpoint, add its value and subtract the value one width behind.", "Update and return the best sum."], code: `static long maxWindowSum(int[] a, int k) {\n    if (k <= 0 || k > a.length) return 0;\n    long sum = 0;\n    for (int i = 0; i < k; i++) sum += a[i];\n    long best = sum;\n    for (int r = k; r < a.length; r++) {\n        sum += a[r] - a[r - k];\n        best = Math.max(best, sum);\n    }\n    return best;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use when every candidate is a contiguous range of the same known width." },
      { name: "Minimum length with target sum", layman: "Add items until the total is enough, then remove from the front while it remains enough.", how: ["Set left and sum to zero; best starts beyond any possible answer.", "Extend right and add its value.", "While sum reaches target, record the current length.", "Subtract the leftmost value and advance left to try a shorter range.", "Return zero if no range reaches the target."], code: `static int minLengthAtLeast(int[] a, int target) {\n    int left = 0, best = a.length + 1; long sum = 0;\n    for (int right = 0; right < a.length; right++) {\n        sum += a[right];\n        while (sum >= target) {\n            best = Math.min(best, right - left + 1);\n            sum -= a[left++];\n        }\n    }\n    return best == a.length + 1 ? 0 : best;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use for a shortest range reaching a sum threshold when all values are nonnegative." },
      { name: "Longest substring without repeats", layman: "When a repeated character appears, move the start past its previous copy and continue.", how: ["Track each character's last seen index.", "Scan with right as the current end.", "If a character appeared inside the current window, move left past it.", "Record the greatest valid window length.", "Return the best length."], code: `static int longestUnique(String s) {\n    java.util.Map<Character, Integer> last = new java.util.HashMap<>();\n    int left = 0, best = 0;\n    for (int right = 0; right < s.length(); right++) {\n        char c = s.charAt(right);\n        if (last.containsKey(c)) left = Math.max(left, last.get(c) + 1);\n        last.put(c, right);\n        best = Math.max(best, right - left + 1);\n    }\n    return best;\n}`, time: "O(n) expected", space: "O(min(n, alphabet size))", useWhen: "Use for the longest substring with no repeated characters." }
    ],
    examples: [
      { title: "Largest width-two sum", problem: "Find the maximum sum of contiguous windows of width two.", input: "a = [2, 1, 5, 1], k = 2", steps: [
        { title: "First", detail: "Add the first two values.", state: "window=[2,1], sum=3, best=3" }, { title: "Slide", detail: "Add 5 and remove 2.", state: "window=[1,5], sum=6, best=6" }, { title: "Slide again", detail: "Add 1 and remove the outgoing 1.", state: "window=[5,1], sum=6, best=6" }, { title: "End", detail: "No more complete windows remain.", state: "right=4, best=6" }, { title: "Choose", detail: "The last two windows tie for maximum.", state: "best=6" }
      ], result: "6" },
      { title: "Shortest threshold range", problem: "Find the shortest range with sum at least 7; values are nonnegative.", input: "a = [2, 3, 1, 2, 4], target = 7", steps: [
        { title: "Expand", detail: "The first three values total 6, below target.", state: "left=0, right=2, sum=6" }, { title: "Add 2", detail: "The range reaches 8 and has length four.", state: "left=0, right=3, sum=8, best=4" }, { title: "Shrink", detail: "Remove leading 2; the sum falls below target.", state: "left=1, sum=6, best=4" }, { title: "Add 4", detail: "The range from index one totals 10.", state: "left=1, right=4, sum=10, best=4" }, { title: "Shrink twice", detail: "Remove 3 to get 7 at length 3, then remove 1 to get 6.", state: "left=3, sum=6, best=3" }
      ], result: "3, from [1, 2, 4]." }
    ],
    pitfalls: ["Using sum-based shrinking when negative values break monotonicity.", "Forgetting to remove the outgoing item in fixed windows.", "Recording a candidate with incorrect boundary arithmetic.", "Moving left backward to a repeated character already outside the window.", "Confusing contiguous ranges with subsequences that can skip items."],
    related: ["Array / String", "Hashmap", "Two Pointers"]
  },
  {
    category: "Matrix",
    tagline: "Treat a grid as rows and columns, using explicit boundaries to traverse it safely.",
    overview: [
      "A matrix is a two-dimensional arrangement addressed by row and column. Many grid tasks are familiar sequence algorithms with one added concern: every move must respect dimensions. Rectangular matrices have independent row and column counts, so square assumptions are dangerous.",
      "Common patterns include row-major scans, spirals, diagonals, and searches that exploit sorted rows or columns. A square matrix can rotate clockwise in place by transposing and reversing each row. Other shapes may require a new output matrix.",
      "For spiral traversal, maintain top, bottom, left, and right boundaries. After consuming an edge, update its boundary, then check that a remaining row or column still exists. These checks prevent duplicate visits in single-row and single-column grids.",
      "A grid may be stored as nested rows or a flat array with a coordinate mapping. In interview code readability usually wins, but traversal order and memory bounds still matter. State dimensions and valid ranges before the walk."
    ],
    layman: { analogy: "A matrix is like a seating chart: a seat needs both a row and a column, and walking around it means watching the edges.", plainEnglish: ["Count rows and columns separately.", "Check that each move stays inside the grid.", "For a spiral, mark an edge as used after traversing it.", "Handle one-row and one-column grids without repeating cells."] },
    whenToUse: ["The input is a grid, board, table, or rows and columns.", "The task asks for spiral, diagonal, layer, or neighbor traversal.", "A transformation rotates, reflects, or transposes a grid.", "Sorted rows or columns can guide a search.", "The prompt asks about connected cells or grid boundaries."],
    keyIdeas: [
      { term: "Dimensions", meaning: "The row and column counts, which may differ." },
      { term: "Row-major order", meaning: "Visit all columns in a row before advancing to the next row." },
      { term: "Boundary", meaning: "An index limit describing the unprocessed rectangle or legal edge." },
      { term: "Transpose", meaning: "Swap row and column positions, turning rows into columns." },
      { term: "Layer", meaning: "A ring of cells around the unvisited interior." },
      { term: "Neighbor", meaning: "A cell reached by one allowed local move, often up, down, left, or right." }
    ],
    algorithms: [
      { name: "Spiral traversal", layman: "Walk around a picture frame's outside edge, remove that edge, and repeat inward.", how: ["Initialize top, bottom, left, and right boundaries.", "Read the top row left to right, then advance top.", "Read the right column downward, then move right inward.", "If a row remains, read the bottom edge backward and move bottom inward.", "If a column remains, read its left edge upward and move left inward; repeat."], code: `static java.util.List<Integer> spiral(int[][] m) {\n    java.util.List<Integer> out = new java.util.ArrayList<>();\n    if (m.length == 0 || m[0].length == 0) return out;\n    int top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;\n    while (top <= bottom && left <= right) {\n        for (int c = left; c <= right; c++) out.add(m[top][c]);\n        top++;\n        for (int r = top; r <= bottom; r++) out.add(m[r][right]);\n        right--;\n        if (top <= bottom) { for (int c = right; c >= left; c--) out.add(m[bottom][c]); bottom--; }\n        if (left <= right) { for (int r = bottom; r >= top; r--) out.add(m[r][left]); left++; }\n    }\n    return out;\n}`, time: "O(rows × columns)", space: "O(rows × columns) for output", useWhen: "Use when all cells must be emitted clockwise, outside to inside." },
      { name: "Rotate square clockwise", layman: "Swap cells across the diagonal, then turn each row around.", how: ["For square size n, swap m[r][c] with m[c][r] above the diagonal.", "This creates the transpose without swapping a pair twice.", "Reverse every row in place.", "The resulting matrix is rotated clockwise."], code: `static void rotateClockwise(int[][] m) {\n    int n = m.length;\n    for (int r = 0; r < n; r++) for (int c = r + 1; c < n; c++) {\n        int t = m[r][c]; m[r][c] = m[c][r]; m[c][r] = t;\n    }\n    for (int[] row : m) for (int l = 0, r = n - 1; l < r; l++, r--) {\n        int t = row[l]; row[l] = row[r]; row[r] = t;\n    }\n}`, time: "O(n²)", space: "O(1)", useWhen: "Use for an in-place 90-degree clockwise rotation of a square matrix." },
      { name: "Search row-and-column sorted matrix", layman: "Start at a corner where one move makes values larger and the other makes them smaller; each comparison removes a row or column.", how: ["Start at the top-right cell.", "Return true if it matches.", "If too large, move left.", "If too small, move down.", "Return false after leaving the grid."], code: `static boolean contains(int[][] m, int target) {\n    if (m.length == 0 || m[0].length == 0) return false;\n    int r = 0, c = m[0].length - 1;\n    while (r < m.length && c >= 0) {\n        if (m[r][c] == target) return true;\n        if (m[r][c] > target) c--; else r++;\n    }\n    return false;\n}`, time: "O(rows + columns)", space: "O(1)", useWhen: "Use when each row and each column is sorted ascending." }
    ],
    examples: [
      { title: "Spiral a two-by-three grid", problem: "Visit every cell clockwise from the upper-left.", input: "m = [[1,2,3],[4,5,6]]", steps: [
        { title: "Top edge", detail: "Read first row left to right.", state: "out=[1,2,3], top=1, bottom=1" }, { title: "Right edge", detail: "Read the remaining rightmost cell.", state: "out=[1,2,3,6], right=1" }, { title: "Bottom edge", detail: "Read remaining bottom row backward.", state: "out=[1,2,3,6,5,4], bottom=0" }, { title: "Bounds cross", detail: "Top is now below bottom, so no cells remain.", state: "top=1, bottom=0" }, { title: "Finish", detail: "All six cells were visited once.", state: "out=[1,2,3,6,5,4]" }
      ], result: "[1, 2, 3, 6, 5, 4]" },
      { title: "Search a sorted grid", problem: "Determine whether 7 is present.", input: "m = [[1,4,7],[2,5,8],[3,6,9]], target = 7", steps: [
        { title: "Start top-right", detail: "This corner already holds the target.", state: "position=(0,2), value=7" }, { title: "Match", detail: "Comparison is equal.", state: "found=true" }, { title: "No move", detail: "A match needs no row or column discard.", state: "position=(0,2)" }, { title: "Return", detail: "Report that the value exists.", state: "result=true" }, { title: "Verify", detail: "The matched cell is in row zero, column two.", state: "m[0][2]=7" }
      ], result: "true" }
    ],
    pitfalls: ["Using row count where column count is needed, or assuming a rectangle is square.", "Visiting a final row or column twice after boundaries cross.", "Applying square transpose code to a rectangular matrix.", "Using corner search when rows and columns are not sorted as required.", "Reading m[0] before checking for an empty matrix."],
    related: ["Array / String", "Graph BFS", "Binary Search"]
  },
  {
    category: "Hashmap",
    tagline: "Store key-to-value facts for fast lookup, counting, and grouping.",
    overview: [
      "A hashmap associates keys with values and helps answer whether something appeared, how often it appears, or which group it belongs to. Insertion and lookup are expected constant time, making maps useful instead of repeatedly scanning a list.",
      "Decide what fact to remember and choose a key that captures it. A frequency map stores counts, a complement map stores earlier positions, and a grouping map collects items under a canonical signature. The map's contents should directly support the next decision.",
      "Hashmaps rely on hashing and equality. Collisions are handled internally, and poor hash behavior can affect performance, so constant time is an expectation, not a guarantee. Keys need stable equality while stored; changing fields that affect a key's hash can make it unreachable.",
      "Space is proportional to distinct keys. If the domain is small and known, an array of counters may be simpler. Consider duplicate semantics, ordering, and whether to store the earliest, latest, or any matching position."
    ],
    layman: { analogy: "A hashmap is like labeled drawers: knowing a label lets you quickly open the drawer containing the note you need.", plainEnglish: ["Choose a label representing the fact to find again.", "Store a count, position, or collection behind that label.", "Check what is stored before adding the current item when order matters.", "For a tiny fixed label range, simple counters may be enough."] },
    whenToUse: ["The prompt asks about duplicates, frequencies, or prior appearances.", "You need to find a complement while scanning once.", "Items must be grouped by a shared signature.", "Repeated linear searches would make a simple solution quadratic.", "The answer depends on distinct values or occurrences."],
    keyIdeas: [
      { term: "Key", meaning: "The lookup label used to find an associated value." },
      { term: "Value", meaning: "Information linked to a key, such as a count or index." },
      { term: "Frequency map", meaning: "A mapping from each observed item to its occurrence count." },
      { term: "Collision", meaning: "Different keys produce the same hash bucket and still require equality checks." },
      { term: "Expected time", meaning: "A typical bound assuming hashes are well distributed, not a universal guarantee." },
      { term: "Canonical key", meaning: "A normalized form used to group equivalent items together." }
    ],
    algorithms: [
      { name: "Frequency counting", layman: "Keep a tally beside each label and add one whenever it appears.", how: ["Create an empty map from values to counts.", "Visit each input value once.", "Increase its count, treating a missing count as zero.", "Use or return the resulting counts."], code: `static java.util.Map<Integer, Integer> frequencies(int[] a) {\n    java.util.Map<Integer, Integer> count = new java.util.HashMap<>();\n    for (int x : a) count.put(x, count.getOrDefault(x, 0) + 1);\n    return count;\n}`, time: "O(n) expected", space: "O(u)", useWhen: "Use for counts and duplicate multiplicities in a broad value domain." },
      { name: "One-pass complement lookup", layman: "For each number, ask whether its missing partner is already on your list, then record this number for later.", how: ["Map previously seen values to indexes.", "At each position, calculate the complement needed to reach target.", "If it is stored, return that index and current index.", "Otherwise store the current value and index.", "Return a sentinel pair if no solution exists."], code: `static int[] twoSum(int[] a, int target) {\n    java.util.Map<Integer, Integer> index = new java.util.HashMap<>();\n    for (int i = 0; i < a.length; i++) {\n        int need = target - a[i];\n        if (index.containsKey(need)) return new int[] {index.get(need), i};\n        index.put(a[i], i);\n    }\n    return new int[] {-1, -1};\n}`, time: "O(n) expected", space: "O(n)", useWhen: "Use for target pairs in unsorted data when positions must be distinct." },
      { name: "Group by canonical signature", layman: "Put items in a drawer labeled by a description that ignores the differences that do not matter.", how: ["Create a map from normalized signature to a list of original items.", "Sort each word's characters to form an anagram-independent key.", "Append the word to the list for that key.", "Return the grouped lists."], code: `static java.util.List<java.util.List<String>> groupAnagrams(String[] words) {\n    java.util.Map<String, java.util.List<String>> groups = new java.util.HashMap<>();\n    for (String word : words) {\n        char[] chars = word.toCharArray();\n        java.util.Arrays.sort(chars);\n        String key = new String(chars);\n        groups.computeIfAbsent(key, k -> new java.util.ArrayList<>()).add(word);\n    }\n    return new java.util.ArrayList<>(groups.values());\n}`, time: "O(n × k log k)", space: "O(n × k)", useWhen: "Use to group words containing the same characters in different orders." }
    ],
    examples: [
      { title: "Count values", problem: "Count each value's occurrences.", input: "a = [2, 1, 2]", steps: [
        { title: "Start", detail: "No keys have been seen.", state: "map={}" }, { title: "Read 2", detail: "First occurrence creates count one.", state: "map={2:1}" }, { title: "Read 1", detail: "Create its independent count.", state: "map={2:1,1:1}" }, { title: "Read 2 again", detail: "Increment the existing count.", state: "map={2:2,1:1}" }, { title: "Finish", detail: "Two distinct values were recorded.", state: "distinct=2" }
      ], result: "2 occurs twice; 1 occurs once." },
      { title: "Find a complement", problem: "Find two positions totaling 9.", input: "a = [4, 5, 1], target = 9", steps: [
        { title: "Read index 0", detail: "4 needs 5; no earlier 5 exists, so remember 4.", state: "map={4:0}" }, { title: "Read index 1", detail: "5 needs 4, already recorded at zero.", state: "need=4, map={4:0}" }, { title: "Match", detail: "The two values total the target.", state: "answer=[0,1]" }, { title: "Return", detail: "Stop immediately after the match.", state: "stopped at index=1" }, { title: "Verify", detail: "The indexes differ and 4 plus 5 is 9.", state: "4+5=9" }
      ], result: "[0, 1]" }
    ],
    pitfalls: ["In pair search, inserting current value before checking can reuse one position.", "Treating expected constant lookup as a worst-case guarantee.", "Mutating a key after inserting it when equality or hash depends on its fields.", "Forgetting a map has one value per key unless that value is a list or count.", "Choosing a signature that does not fully describe the grouping rule."],
    related: ["Array / String", "Sliding Window", "Intervals"]
  },
  {
    category: "Intervals",
    tagline: "Reason about ranges by sorting endpoints and maintaining the active boundary.",
    overview: [
      "An interval is a continuous span between endpoints, such as a meeting time or numeric range. Problems ask whether spans overlap, how to combine them, or how many resources are required. First decide the endpoint convention: closed intervals include both ends; half-open intervals include the start but exclude the end.",
      "Sorting by start puts intervals in an order where only nearby ranges can interact. A merge scan compares the next start with the end of the current combined interval. If they overlap, extend the end; otherwise emit the finished range and begin another.",
      "For insertion, existing ranges may already be sorted and disjoint. Append those entirely before the new range, merge overlaps into it, then append the remainder. Each existing interval is considered once.",
      "Boundary equality changes correctness. Closed [1,3] and [3,5] overlap; half-open [1,3) and [3,5) do not. State the convention and apply it consistently in sorting, overlap checks, and resource counting."
    ],
    layman: { analogy: "Draw appointment blocks on a calendar: overlapping blocks join into one busy stretch, while a gap makes a separate stretch.", plainEnglish: ["Put ranges in order by where they begin.", "Compare the next range with the one currently being built.", "If ranges overlap, extend the current end.", "Decide whether sharing an endpoint counts as overlap."] },
    whenToUse: ["The input contains pairs representing start and end points.", "The task asks to merge, insert, or count overlapping ranges.", "Scheduling or availability is described in time blocks.", "Sorting by start or end makes comparisons local.", "The prompt asks whether ranges touch, intersect, or leave a gap."],
    keyIdeas: [
      { term: "Endpoint", meaning: "A start or end value bounding an interval." },
      { term: "Closed interval", meaning: "A range including both endpoints." },
      { term: "Half-open interval", meaning: "A range including its start but excluding its end." },
      { term: "Overlap", meaning: "Ranges share at least one point under the stated convention." },
      { term: "Sort by start", meaning: "Order intervals by left endpoint to enable a forward merge scan." },
      { term: "Active interval", meaning: "The combined range currently being extended or emitted." }
    ],
    algorithms: [
      { name: "Merge overlapping intervals", layman: "Sort calendar blocks and stretch the current block whenever the next one reaches it.", how: ["Return an empty result for empty input.", "Sort by start endpoint.", "Use the first interval as the current merged range.", "If the next start is at most current end, extend current end.", "Otherwise emit current and start the next; emit the final range."], code: `static int[][] merge(int[][] a) {\n    if (a.length == 0) return new int[0][2];\n    java.util.Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));\n    java.util.List<int[]> out = new java.util.ArrayList<>();\n    int start = a[0][0], end = a[0][1];\n    for (int i = 1; i < a.length; i++) {\n        if (a[i][0] <= end) end = Math.max(end, a[i][1]);\n        else { out.add(new int[] {start, end}); start = a[i][0]; end = a[i][1]; }\n    }\n    out.add(new int[] {start, end});\n    return out.toArray(new int[out.size()][]);\n}`, time: "O(n log n)", space: "O(n) output", useWhen: "Use for closed intervals when overlapping ranges should be combined." },
      { name: "Insert into sorted disjoint intervals", layman: "Copy blocks before the new appointment, stretch it across every block it meets, then copy the rest.", how: ["Append each interval ending strictly before the new start.", "Copy the new interval into mutable start and end values.", "Expand across intervals starting at or before the current end.", "Append the merged interval.", "Append remaining intervals unchanged."], code: `static int[][] insert(int[][] a, int[] added) {\n    java.util.List<int[]> out = new java.util.ArrayList<>();\n    int i = 0, start = added[0], end = added[1];\n    while (i < a.length && a[i][1] < start) out.add(a[i++]);\n    while (i < a.length && a[i][0] <= end) {\n        start = Math.min(start, a[i][0]); end = Math.max(end, a[i][1]); i++;\n    }\n    out.add(new int[] {start, end});\n    while (i < a.length) out.add(a[i++]);\n    return out.toArray(new int[out.size()][]);\n}`, time: "O(n)", space: "O(n) output", useWhen: "Use with sorted, pairwise-disjoint closed intervals when adding one range." },
      { name: "Minimum meeting rooms", layman: "Keep the finish times of occupied rooms; reuse the room that becomes free earliest, or open another.", how: ["Sort meetings by start time.", "Keep a min-heap of end times for currently occupied rooms.", "Before a meeting, remove every room ending at or before its start.", "Add this meeting's end time to the heap.", "Track the largest heap size."], code: `static int minMeetingRooms(int[][] meetings) {\n    java.util.Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));\n    java.util.PriorityQueue<Integer> ends = new java.util.PriorityQueue<>();\n    int best = 0;\n    for (int[] meeting : meetings) {\n        while (!ends.isEmpty() && ends.peek() <= meeting[0]) ends.poll();\n        ends.offer(meeting[1]);\n        best = Math.max(best, ends.size());\n    }\n    return best;\n}`, time: "O(n log n)", space: "O(n)", useWhen: "Use for half-open meetings, where an end at t frees a room starting at t." }
    ],
    examples: [
      { title: "Merge calendar ranges", problem: "Combine closed intervals that overlap.", input: "intervals = [[1,3],[2,5],[7,8]]", steps: [
        { title: "Sort", detail: "The intervals are already start-ordered.", state: "ordered=[[1,3],[2,5],[7,8]]" }, { title: "Begin", detail: "Use the first interval as current.", state: "current=[1,3], output=[]" }, { title: "Merge", detail: "[2,5] starts before current ends, so extend to 5.", state: "current=[1,5]" }, { title: "Find gap", detail: "[7,8] starts after 5; emit [1,5] and begin a new range.", state: "output=[[1,5]], current=[7,8]" }, { title: "Finish", detail: "Emit the last current range.", state: "output=[[1,5],[7,8]]" }
      ], result: "[[1, 5], [7, 8]]" },
      { title: "Insert a range", problem: "Insert [2,5] into sorted disjoint closed intervals.", input: "intervals = [[1,2],[6,9]], added = [2,5]", steps: [
        { title: "Check first", detail: "[1,2] is not strictly before the new range; endpoint 2 touches.", state: "i=0, output=[]" }, { title: "Merge first", detail: "Expand start to 1.", state: "merged=[1,5], i=1" }, { title: "Check next", detail: "The next start 6 exceeds merged end 5.", state: "next=[6,9]" }, { title: "Append merged", detail: "Add the combined interval.", state: "output=[[1,5]]" }, { title: "Append remainder", detail: "Copy the untouched interval.", state: "output=[[1,5],[6,9]]" }
      ], result: "[[1, 5], [6, 9]]" }
    ],
    pitfalls: ["Not specifying whether equal endpoints overlap.", "Using a subtraction comparator that can overflow; prefer Integer.compare.", "Merging unsorted input with a one-direction scan.", "Mutating input intervals unexpectedly.", "Treating a half-open meeting end/start tie as overlapping."],
    related: ["Array / String", "Hashmap", "Heap"]
  },
  {
    category: "Stack",
    tagline: "Use last-in, first-out storage when the newest unresolved item must be handled first.",
    overview: [
      "A stack is a last-in, first-out collection: the most recently added item is removed first. This models nested structure and deferred decisions. Parentheses, function calls, undo history, and expressions naturally leave the newest unfinished piece at the top.",
      "In array scans, a monotonic stack stores indexes whose answers are unknown. When a new value resolves older values, pop them and record the answer. Every index is pushed and popped at most once, giving linear time despite a nested while loop.",
      "For postfix expressions, operands are pushed; an operator pops its required operands, computes, and pushes the result. Operand order matters for subtraction and division. For nested syntax, each closing token must match the most recent unmatched opening token.",
      "Stacks are simple but require empty checks and deliberate pop ordering. Use a dynamic array or deque. Choose an increasing or decreasing invariant based on which future value resolves, and decide whether equal values should remain."
    ],
    layman: { analogy: "A stack is a pile of plates: put a new plate on top and take the top one off first.", plainEnglish: ["The latest unfinished item is the next one to handle.", "A closing bracket must match the most recent unmatched opener.", "Keep unresolved positions until a later value answers them.", "Check that the pile is not empty before taking something off."] },
    whenToUse: ["The prompt includes nested parentheses, tags, or paired delimiters.", "An item waits for its next greater or smaller neighbor to the right.", "Operations undo the most recent action first.", "An expression is postfix or requires operator precedence handling.", "Nested structure must be processed without recursive calls."],
    keyIdeas: [
      { term: "LIFO", meaning: "Last in, first out: the most recently pushed item is removed first." },
      { term: "Top", meaning: "The item currently available for inspection or removal." },
      { term: "Push / pop", meaning: "Add an item to the top / remove the current top item." },
      { term: "Monotonic stack", meaning: "A stack kept in increasing or decreasing value order." },
      { term: "Unresolved index", meaning: "A position whose next-greater or next-smaller answer is unknown." },
      { term: "Delimiter matching", meaning: "Checking that closers match the latest unmatched opener." }
    ],
    algorithms: [
      { name: "Balanced bracket validation", layman: "Put open brackets on a pile; each close must match and remove the top opener.", how: ["Create an empty stack of opening brackets.", "Push every opening bracket encountered.", "For a closer, fail if the stack is empty or its top has the wrong kind.", "Pop a matching opener.", "Succeed only if the stack is empty at the end."], code: `static boolean validBrackets(String s) {\n    java.util.Deque<Character> stack = new java.util.ArrayDeque<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '[' || c == '{') stack.push(c);\n        else {\n            if (stack.isEmpty()) return false;\n            char open = stack.pop();\n            if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) return false;\n        }\n    }\n    return stack.isEmpty();\n}`, time: "O(n)", space: "O(n)", useWhen: "Use to validate correctly nested parentheses, brackets, or braces." },
      { name: "Next greater value to right", layman: "Keep waiting positions on a pile; a taller new value answers those waiting below it.", how: ["Initialize answers to -1 and create an index stack.", "Scan values left to right.", "While the top index has a smaller value, pop it and assign the current value as its answer.", "Push the current index because its answer is not yet known.", "Leave remaining answers at -1."], code: `static int[] nextGreater(int[] a) {\n    int[] answer = new int[a.length];\n    java.util.Arrays.fill(answer, -1);\n    java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();\n    for (int i = 0; i < a.length; i++) {\n        while (!stack.isEmpty() && a[stack.peek()] < a[i]) answer[stack.pop()] = a[i];\n        stack.push(i);\n    }\n    return answer;\n}`, time: "O(n)", space: "O(n)", useWhen: "Use when each position needs its first strictly greater value on the right." },
      { name: "Evaluate reverse Polish notation", layman: "Push numbers; at an operator, take the top two, calculate, and put the answer back.", how: ["Create a stack of integer values.", "Push a token when it is an operand.", "For an operator, pop right operand first, then left.", "Apply the operator and push the result.", "Return the sole remaining value."], code: `static int evalRpn(String[] tokens) {\n    java.util.Deque<Integer> stack = new java.util.ArrayDeque<>();\n    for (String t : tokens) {\n        if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {\n            int right = stack.pop(), left = stack.pop();\n            if (t.equals("+")) stack.push(left + right);\n            else if (t.equals("-")) stack.push(left - right);\n            else if (t.equals("*")) stack.push(left * right);\n            else stack.push(left / right);\n        } else stack.push(Integer.parseInt(t));\n    }\n    return stack.pop();\n}`, time: "O(n)", space: "O(n)", useWhen: "Use to evaluate a valid postfix expression." }
    ],
    examples: [
      { title: "Validate nested brackets", problem: "Check whether bracket pairs are correctly nested.", input: "s = \"([])\"", steps: [
        { title: "Read (", detail: "Push the opening parenthesis.", state: "stack=[(]" }, { title: "Read [", detail: "Push the newer opening square bracket.", state: "stack=[[, (]" }, { title: "Read ]", detail: "It matches and removes the top bracket.", state: "stack=[(]" }, { title: "Read )", detail: "It matches and removes the remaining opener.", state: "stack=[]" }, { title: "Finish", detail: "No unmatched open brackets remain.", state: "valid=true" }
      ], result: "true" },
      { title: "Next greater values", problem: "Find the first strictly greater value to the right of each item.", input: "a = [2, 1, 3]", steps: [
        { title: "Read 2", detail: "Its answer is unknown; push index zero.", state: "stack=[0], answer=[-1,-1,-1]" }, { title: "Read 1", detail: "It does not resolve 2, so push index one.", state: "stack=[1,0]" }, { title: "3 resolves 1", detail: "3 is greater than the value at the top index.", state: "answer[1]=3, stack=[0]" }, { title: "3 resolves 2", detail: "3 is also greater than value 2.", state: "answer[0]=3, stack=[]" }, { title: "Finish", detail: "Index two has no right neighbor, so its answer remains -1.", state: "answer=[3,3,-1]" }
      ], result: "[3, 3, -1]" }
    ],
    pitfalls: ["Popping from an empty stack before checking it.", "Accepting a closer that does not match the newest opener.", "Reversing left and right operands for subtraction or division.", "Using <= in next-greater logic when equal values do not count as greater.", "Forgetting unresolved positions; initialize answers to the required default."],
    related: ["Array / String", "Intervals", "Linked List"]
  },
  {
    category: "Linked List",
    tagline: "Use node links to traverse and rearrange sequences without indexed access.",
    overview: [
      "A linked list is a chain of nodes where each node stores a value and a reference to the next node. Unlike an array, reaching an arbitrary position requires following links from a known node. In exchange, insertion or removal near a known node can change only a few links.",
      "Pointer manipulation is the core skill. To reverse a list, save the next node before redirecting the current link. To merge sorted lists, connect the smaller front node to the result. A dummy head gives a stable starting point and avoids special handling for the first result node.",
      "Fast and slow pointers reveal structure without extra storage. They can locate a midpoint, detect a cycle, or help find its entrance. A cycle means traversal may never reach null, so account for it when the input contract allows cyclic lists.",
      "The trade-off is sequential access and per-node reference storage. Correctness depends on not losing a reference while rewiring. Draw a few nodes, name the pointers, and preserve a path to the unprocessed remainder before changing links."
    ],
    layman: { analogy: "A linked list is a treasure hunt where each note points to the next location; you must follow directions rather than jump to note ten.", plainEnglish: ["Each item tells you where to find the next.", "Save the next destination before changing a direction.", "A temporary starting node can simplify building a result.", "Use a stopping rule because the chain might loop instead of ending."] },
    whenToUse: ["The input is explicitly a singly or doubly linked list.", "The task requires reversing, merging, splitting, or reordering nodes.", "It asks for the middle or a cycle without extra memory.", "Items are inserted or removed around a known node.", "Node identity must be preserved rather than copied into an array."],
    keyIdeas: [
      { term: "Node", meaning: "An object holding a value and a reference to another node." },
      { term: "Head", meaning: "The reference to the first node, or null for an empty list." },
      { term: "Next link", meaning: "The reference from one node to the following node." },
      { term: "Dummy head", meaning: "A temporary node before a result that simplifies first-node handling." },
      { term: "Fast/slow pointers", meaning: "References moving at different speeds to find midpoint or cycle structure." },
      { term: "Cycle", meaning: "A link path that revisits a node rather than reaching null." }
    ],
    algorithms: [
      { name: "Iterative list reversal", layman: "Walk along the chain, turn each arrow backward, and keep a note of where the unvisited chain continues.", how: ["Set previous to null and current to head.", "Save current.next before changing the link.", "Point current.next back to previous.", "Advance previous to current and current to saved next.", "Return previous when current reaches null."], code: `static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }\nstatic ListNode reverseList(ListNode head) {\n    ListNode prev = null, current = head;\n    while (current != null) {\n        ListNode next = current.next;\n        current.next = prev;\n        prev = current; current = next;\n    }\n    return prev;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use to reverse node order in place without allocating a replacement list." },
      { name: "Floyd cycle detection", layman: "Let one runner take one link and another take two; if the path loops, the fast one eventually catches the slow one.", how: ["Initialize slow and fast at head.", "Advance slow one link and fast two links while possible.", "If they meet at a non-null node, a cycle exists.", "If fast reaches null or its next is null, there is no cycle."], code: `static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }\nstatic boolean hasCycle(ListNode head) {\n    ListNode slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next; fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`, time: "O(n)", space: "O(1)", useWhen: "Use to detect a singly linked list loop without storing visited nodes." },
      { name: "Merge sorted lists with dummy head", layman: "Choose the smaller front node from two ordered chains and attach it to a result chain starting at a temporary marker.", how: ["Create a dummy node and let tail point to it.", "While both lists remain, compare their front values.", "Attach the smaller node to tail and advance that input.", "Advance tail after attaching.", "Attach the remaining chain and return dummy.next."], code: `static class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }\nstatic ListNode mergeTwoLists(ListNode a, ListNode b) {\n    ListNode dummy = new ListNode(0), tail = dummy;\n    while (a != null && b != null) {\n        if (a.val <= b.val) { tail.next = a; a = a.next; }\n        else { tail.next = b; b = b.next; }\n        tail = tail.next;\n    }\n    tail.next = (a != null) ? a : b;\n    return dummy.next;\n}`, time: "O(n + m)", space: "O(1) extra", useWhen: "Use to merge ascending lists by reusing their existing nodes." }
    ],
    examples: [
      { title: "Reverse a three-node chain", problem: "Reverse links in a singly linked list.", input: "1 -> 2 -> 3 -> null", steps: [
        { title: "Start", detail: "No node precedes the head.", state: "prev=null, current=1" }, { title: "Reverse 1", detail: "Save 2, then point 1 to null.", state: "1->null, prev=1, current=2" }, { title: "Reverse 2", detail: "Save 3, then point 2 back to 1.", state: "2->1, prev=2, current=3" }, { title: "Reverse 3", detail: "Save null, then point 3 back to 2.", state: "3->2, prev=3, current=null" }, { title: "Finish", detail: "Current is null; previous is the new head.", state: "head=3 -> 2 -> 1 -> null" }
      ], result: "3 -> 2 -> 1 -> null" },
      { title: "Merge sorted chains", problem: "Merge two sorted lists by reusing nodes.", input: "a = 1 -> 4, b = 2 -> 3", steps: [
        { title: "Start", detail: "Tail follows a dummy before result values.", state: "result=[], a=1, b=2" }, { title: "Take 1", detail: "1 is smaller; append it and advance a.", state: "result=[1], a=4, b=2" }, { title: "Take 2", detail: "2 is smaller; append it and advance b.", state: "result=[1,2], a=4, b=3" }, { title: "Take 3", detail: "3 is smaller than 4; append it and b becomes empty.", state: "result=[1,2,3], a=4, b=null" }, { title: "Attach remainder", detail: "Append the remaining chain beginning with 4.", state: "result=[1,2,3,4]" }
      ], result: "1 -> 2 -> 3 -> 4" }
    ],
    pitfalls: ["Changing current.next before saving it, losing the unprocessed chain.", "Returning dummy instead of dummy.next.", "Advancing tail before connecting the chosen node.", "Assuming every list ends at null when cycles are possible.", "Comparing values when a task requires preserving node identity."],
    related: ["Two Pointers", "Stack", "Array / String"]
  }
];
