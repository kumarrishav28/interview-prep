import type { TheoryTopic } from './types';

export const theoryC: TheoryTopic[] = [
  {
    category: "Kadane's Algorithm",
    tagline: `Find the strongest contiguous stretch in one pass by keeping only the best sum ending here.`,
    overview: [
      `Kadane's algorithm solves the maximum subarray problem: given numbers, find a non-empty contiguous range whose sum is largest. Contiguous matters: values cannot be skipped. The standard formulation permits negative values and still returns a non-empty range.`,
      `At each position, an optimal range ending there either starts with this value or extends the optimal range ending at the previous position. If the previous running sum hurts more than it helps, discard it and restart. Track that ending-here sum and the best answer seen anywhere.`,
      `This recurrence is a compact dynamic program. Each element is read once, yielding O(n) time and O(1) extra space. To return the range as well as its sum, remember the tentative start on each restart and save its endpoints whenever the global best improves.`,
      `It is ideal for one unconstrained maximum-sum interval, but fixed-length, multiple-segment, and circular variants need modifications. Clarify whether empty ranges are allowed, and use a wide sum type if values or input length can make an int overflow.`
    ],
    layman: { analogy: `Imagine walking across daily profits and losses. Carry a running trip total; if carrying prior losses makes it worse than starting fresh today, reset, while remembering your best trip so far.`, plainEnglish: [`The selected answer must be adjacent positions; you cannot skip a bad middle value.`, `At each number, compare starting a new stretch with extending the current stretch.`, `Keep the best sum so far separately from the current stretch's sum.`, `Initialize from an actual value so an all-negative input returns its largest member.`] },
    whenToUse: [`The prompt asks for the maximum or minimum sum of a contiguous subarray.`, `Values may be positive and negative and quadratic range enumeration is too slow.`, `The answer is one uninterrupted interval, not an arbitrary subset.`, `The problem asks for the best run of changes, such as gains from consecutive daily deltas.`, `A single pass with constant auxiliary storage is desired.`],
    keyIdeas: [
      { term: `Subarray`, meaning: `A contiguous, non-empty slice of an array.` }, { term: `Ending-here sum`, meaning: `Largest sum among subarrays whose final element is the current one.` },
      { term: `Restart`, meaning: `Discard the previous stretch and begin at this element if extending is worse.` }, { term: `Global best`, meaning: `The greatest ending-here sum seen at any position.` },
      { term: `Recurrence`, meaning: `endingHere = max(value, endingHere + value); best = max(best, endingHere).` }, { term: `Non-empty rule`, meaning: `The chosen range contains at least one element, including for all-negative input.` }
    ],
    algorithms: [
      { name: `Standard maximum subarray`, layman: `Keep the prior stretch only when adding it improves today's total; otherwise restart today.`, how: [`Initialize current and overall sums from the first element.`, `For each later value, compare it with extending the current stretch.`, `Keep the larger as the best sum ending at this position.`, `Update the overall answer.`, `Return the overall answer.`], code: `public static int maxSubArray(int[] nums) {
    int endingHere = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        endingHere = Math.max(nums[i], endingHere + nums[i]);
        best = Math.max(best, endingHere);
    }
    return best;
}`, time: `O(n), one pass.`, space: `O(1).`, useWhen: `Use for the largest sum of any non-empty contiguous subarray.` },
      { name: `Maximum subarray with bounds`, layman: `When a stretch sets a record, write down its beginning and end as well as its sum.`, how: [`Initialize current and best sums and a tentative start at index zero.`, `At each index compare restarting with extending.`, `If restarting, move the tentative start to this index.`, `When current beats best, save sum and inclusive endpoints.`, `Return the recorded range.`], code: `public static int[] maxSubArrayBounds(int[] a) {
    int end = a[0], best = a[0], start = 0, bs = 0, be = 0;
    for (int i = 1; i < a.length; i++) {
        if (a[i] > end + a[i]) { end = a[i]; start = i; }
        else end += a[i];
        if (end > best) { best = end; bs = start; be = i; }
    }
    return new int[] {best, bs, be};
}`, time: `O(n).`, space: `O(1).`, useWhen: `Use when the sum and the selected range endpoints are required.` },
      { name: `Maximum circular subarray`, layman: `A best loop either stays in one piece or wraps around, leaving out one weakest middle stretch.`, how: [`Compute total sum, maximum subarray sum, and minimum subarray sum.`, `If maximum sum is negative, return it: all values are negative.`, `Otherwise, the wraparound candidate is total minus minimum subarray.`, `Compare the ordinary and wraparound candidates.`, `Return the larger valid sum.`], code: `public static int maxCircularSubarray(int[] a) {
    int total=a[0], maxEnd=a[0], max=a[0], minEnd=a[0], min=a[0];
    for (int i=1;i<a.length;i++) {
        int x=a[i]; total+=x;
        maxEnd=Math.max(x,maxEnd+x); max=Math.max(max,maxEnd);
        minEnd=Math.min(x,minEnd+x); min=Math.min(min,minEnd);
    }
    return max < 0 ? max : Math.max(max,total-min);
}`, time: `O(n), one pass.`, space: `O(1).`, useWhen: `Use when a segment may wrap from the end of a circular array to its beginning.` }
    ],
    examples: [
      { title: `A profitable run`, problem: `Find the largest-sum non-empty consecutive range.`, input: `[-2, 3, -1, 4, -5]`, steps: [
        { title: `Start`, detail: `Initialize from the first value.`, state: `end=-2, best=-2` }, { title: `Index 1`, detail: `Start fresh at 3 rather than extending to 1.`, state: `end=3, best=3` },
        { title: `Index 2`, detail: `Extending gives 2, better than -1 alone.`, state: `end=2, best=3` }, { title: `Index 3`, detail: `Extend to 6, a new record.`, state: `end=6, best=6` },
        { title: `Index 4`, detail: `Extend to 1; it does not beat the record.`, state: `end=1, best=6` }], result: `6, from [3, -1, 4].` },
      { title: `Every day loses`, problem: `Find a non-empty best range when all values are negative.`, input: `[-8, -3, -6, -2]`, steps: [
        { title: `Start`, detail: `Do not initialize the answer to zero.`, state: `end=-8, best=-8` }, { title: `Index 1`, detail: `Restart at -3 instead of extending to -11.`, state: `end=-3, best=-3` },
        { title: `Index 2`, detail: `Restart at -6; the best remains -3.`, state: `end=-6, best=-3` }, { title: `Index 3`, detail: `Restart at -2, the least negative value.`, state: `end=-2, best=-2` },
        { title: `Finish`, detail: `The best range is a single element.`, state: `best=-2` }], result: `-2, from [-2].` }
    ],
    pitfalls: [`Initializing best to zero permits an empty range and fails on all-negative input.`, `A subsequence can skip values; a subarray cannot.`, `Updating the running sum without the global best loses earlier peaks.`, `Use long if sums may exceed int range.`, `Circular complement must not select an empty range for all-negative input.`],
    related: [`Array / String`, `1D DP`, `Sliding Window`]
  },  {
    category: `Binary Search`, tagline: `Discard half of an ordered search space whenever comparison proves it cannot contain the answer.`,
    overview: [`Binary search finds a value or boundary in a monotonic search space. In a sorted array, comparisons tell which half can still contain the target; a more general predicate may change only once from false to true.`, `A loop maintains a consistent interval and shrinks it until the target is found or the candidates are exhausted. Lower bound finds the first value at least target; upper bound finds the first value greater than target. These provide insertion points and duplicate ranges.`, `In answer-space search, the unknown answer is searched directly. A feasibility test determines whether a candidate works, and monotonicity places all feasible candidates on one side. The predicate and its proof are often the hardest parts.`, `Search takes O(log n) checks, but requires sorted data or a genuinely monotonic test. Off-by-one bounds, midpoint overflow, and stopping at an arbitrary duplicate are common. Indexed access should also be efficient.`],
    layman: { analogy: `Like looking up a name in a dictionary: open near the middle, keep the alphabetic half that could contain it, and repeat.`, plainEnglish: [`Order or monotonicity makes whole portions safe to discard.`, `The remaining range must continue to contain every valid answer.`, `Bounds shrink until a match or exact boundary is reached.`, `For first/last match, keep searching after finding an equal value.`] },
    whenToUse: [`Input is sorted and the task asks whether a value exists or where it belongs.`, `Duplicates exist and first or last occurrence is requested.`, `A yes/no decision changes monotonically with a candidate answer.`, `An optimum is bounded and there is a feasibility check.`, `A rotated sorted array or peak search retains useful order in one half.`],
    keyIdeas: [{term:`Search interval`,meaning:`Still-possible candidates, kept consistently inclusive or half-open.`},{term:`Monotonic predicate`,meaning:`A test changing direction at most once across the search order.`},{term:`Lower bound`,meaning:`First index with value greater than or equal to target.`},{term:`Upper bound`,meaning:`First index with value strictly greater than target.`},{term:`Feasibility`,meaning:`Whether a trial answer satisfies all original constraints.`},{term:`Invariant`,meaning:`Reason every valid answer remains in the maintained interval.`}],
    algorithms: [
      { name:`Exact search`, layman:`Look at the middle card and keep only the side where the ordered target can be.`, how:[`Set bounds to first and last indices.`,`Compute a midpoint using low + (high-low)/2.`,`Return if its value equals target.`,`Move low past a smaller midpoint or high before a larger one.`,`Return -1 when bounds cross.`], code:`public static int binarySearch(int[] a,int target){
    int low=0,high=a.length-1;
    while(low<=high){
        int mid=low+(high-low)/2;
        if(a[mid]==target)return mid;
        if(a[mid]<target)low=mid+1;else high=mid-1;
    }
    return -1;
}`, time:`O(log n).`, space:`O(1).`, useWhen:`Use on sorted random-access data when any matching index is sufficient.` },
      { name:`Lower and upper bounds`, layman:`Find where values first stop being too small, then where they become too large.`, how:[`Search the half-open interval [0,n).`,`For lower bound, values at least target move the high bound left.`,`Smaller values move low past mid.`,`At convergence low is the first value >= target.`,`Use strict > instead to find upper bound.`], code:`public static int lowerBound(int[] a,int x){
    int lo=0,hi=a.length;
    while(lo<hi){int m=lo+(hi-lo)/2;if(a[m]>=x)hi=m;else lo=m+1;}
    return lo;
}
public static int upperBound(int[] a,int x){
    int lo=0,hi=a.length;
    while(lo<hi){int m=lo+(hi-lo)/2;if(a[m]>x)hi=m;else lo=m+1;}
    return lo;
}`, time:`O(log n) each.`, space:`O(1).`, useWhen:`Use for insertion points, duplicate ranges, and count = upperBound - lowerBound.` },
      { name:`Search the answer`, layman:`Try a capacity; if it works, try smaller, otherwise try larger.`, how:[`Choose bounds containing the optimum.`,`Define a monotone feasibility test.`,`Test the midpoint.`,`When feasible, record it and search toward the better boundary.`,`Return the converged first feasible value.`], code:`public static int minCapacity(int[] jobs,int days){
    int lo=0,hi=0;
    for(int x:jobs){lo=Math.max(lo,x);hi+=x;}
    while(lo<hi){
        int cap=lo+(hi-lo)/2, used=1, load=0;
        for(int x:jobs){if(load+x>cap){used++;load=0;}load+=x;}
        if(used<=days)hi=cap;else lo=cap+1;
    }
    return lo;
}`, time:`O(n log S), S is answer range size.`, space:`O(1).`, useWhen:`Use when minimizing a maximum load and feasibility improves as capacity grows.` }
    ],
    examples:[
      {title:`Find a sorted value`,problem:`Return an index containing 7.`,input:`[1,3,5,7,9,11], target=7`,steps:[{title:`Initial`,detail:`All indices are candidates.`,state:`low=0, high=5`},{title:`Mid 2`,detail:`5 is too small; discard through index 2.`,state:`low=3, high=5`},{title:`Mid 4`,detail:`9 is too large; discard index 4 onward.`,state:`low=3, high=3`},{title:`Check`,detail:`a[3] equals 7.`,state:`mid=3, a[mid]=7`},{title:`Return`,detail:`Found target.`,state:`index=3`}],result:`Index 3.`},
      {title:`Find duplicate range`,problem:`Use bounds to find all 4s.`,input:`[1,2,4,4,4,7]`,steps:[{title:`Lower 1`,detail:`Mid 3 is >=4; retain left side.`,state:`low=0, high=3`},{title:`Lower 2`,detail:`Mid 1 is <4; move right.`,state:`low=2, high=3`},{title:`Lower done`,detail:`First qualifying index is 2.`,state:`lower=2`},{title:`Upper scan`,detail:`Strict boundary passes all three 4s.`,state:`low=5, high=6`},{title:`Upper done`,detail:`Index 5 is first value >4.`,state:`upper=5; range=[2,5)`}],result:`Indices 2,3,4; count 3.`}
    ],
    pitfalls:[`Every iteration must strictly shrink the interval.`,`Do not mix inclusive and half-open boundary rules.`,`An arbitrary equal match is not necessarily first or last.`,`Use safe midpoint arithmetic.`,`Answer search needs a proved monotone predicate and correct bounds.`,`Linked-list midpoint access is not constant time.`],
    related:[`Array / String`,`Divide & Conquer`,`Matrix`]
  },  {
    category:`Heap`, tagline:`Keep the next most useful item immediately accessible in a partially ordered structure.`,
    overview:[`A heap is a complete binary tree stored compactly in an array. In a min-heap each parent is no greater than its children, so the minimum is the root; a max-heap reverses the relation. It is only partially ordered, not a sorted array.`,`Insertion appends then sifts upward; removing the root replaces it with the final item and sifts downward. Both cost O(log n), while peeking costs O(1). Bottom-up heapification builds a heap in O(n).`,`Heaps are useful when repeatedly selecting an extreme without sorting everything. A bounded heap supports top-K, two heaps maintain a streaming median, and a heap of stream heads merges sorted lists.`,`A heap does not support fast arbitrary search or arbitrary-key updates without extra indexing. Java PriorityQueue is a min-heap by default; choose comparator direction deliberately. Use a heap for changing priorities, not full ordered traversal.`],
    layman:{analogy:`A tournament bracket displays the current champion at its top. The champion is easy to retrieve, though the bracket does not rank every other contestant.`,plainEnglish:[`The root is always the smallest or largest by its rule.`,`Adding or removing the root repairs a tree path.`,`Other items are not fully sorted.`,`A bounded heap can keep only the strongest candidates.`]},
    whenToUse:[`Repeatedly request the next smallest or largest item.`,`Need top-K or bottom-K without sorting all n values.`,`Priorities must be handled as data arrives.`,`Merge multiple sorted streams by current head.`,`A greedy choice requires quick access to the next minimum or maximum.`],
    keyIdeas:[{term:`Min-heap`,meaning:`Parent is no larger than its children; minimum is root.`},{term:`Max-heap`,meaning:`Parent is no smaller than children; maximum is root.`},{term:`Sift up`,meaning:`Move an inserted item toward root while it outranks its parent.`},{term:`Sift down`,meaning:`Move a replacement root toward a child until order is restored.`},{term:`Priority queue`,meaning:`Collection supporting insertion and removal of the highest-priority item.`},{term:`Bounded heap`,meaning:`A fixed-size heap that discards the weakest retained candidate.`}],
    algorithms:[
      {name:`Top K largest`,layman:`Keep K finalists with the weakest at the top so a better newcomer can replace it.`,how:[`Create an empty min-heap.`,`Insert each input value.`,`If its size exceeds K, remove the minimum.`,`After scanning, the heap contains the K largest.`,`Remove or sort the retained values if output order matters.`],code:`public static int[] topKLargest(int[] nums,int k){
    java.util.PriorityQueue<Integer> h=new java.util.PriorityQueue<>();
    for(int x:nums){h.offer(x);if(h.size()>k)h.poll();}
    int[] out=new int[h.size()];
    for(int i=0;i<out.length;i++)out[i]=h.poll();
    return out;
}`,time:`O(n log k + k log k) including output removal.`,space:`O(k).`,useWhen:`Use when K is small relative to n and the K largest values are needed.`},
      {name:`Running median`,layman:`Split values into lower and upper halves, keeping each half's middle value at its root.`,how:[`Keep lower half in max-heap and upper half in min-heap.`,`Insert each number into the appropriate half.`,`Move a root until lower has the same size or one extra.`,`For odd count the lower root is median.`,`For even count average both roots.`],code:`public static double[] runningMedians(int[] a){
    java.util.PriorityQueue<Integer> lo=new java.util.PriorityQueue<>(java.util.Collections.reverseOrder());
    java.util.PriorityQueue<Integer> hi=new java.util.PriorityQueue<>();
    double[] ans=new double[a.length];
    for(int i=0;i<a.length;i++){
        if(lo.isEmpty()||a[i]<=lo.peek())lo.offer(a[i]);else hi.offer(a[i]);
        if(lo.size()>hi.size()+1)hi.offer(lo.poll());
        if(hi.size()>lo.size())lo.offer(hi.poll());
        ans[i]=lo.size()==hi.size()?((long)lo.peek()+hi.peek())/2.0:lo.peek();
    }
    return ans;
}`,time:`O(n log n) total.`,space:`O(n) stored values and results.`,useWhen:`Use when a stream needs its median after each insertion.`},
      {name:`K-way sorted merge`,layman:`Take the smallest current list head, then reveal the next value from that same list.`,how:[`Put each non-empty list's first value and source index into a min-heap.`,`Remove the global minimum and append it.`,`Offer the following value from that source list.`,`Repeat until no candidates remain.`,`Return collected values.`],code:`public static int[] mergeSorted(int[][] lists){
    java.util.PriorityQueue<int[]> h=new java.util.PriorityQueue<>((a,b)->Integer.compare(a[0],b[0]));
    int n=0;for(int s=0;s<lists.length;s++){n+=lists[s].length;if(lists[s].length>0)h.offer(new int[]{lists[s][0],s,0});}
    int[] out=new int[n];int p=0;
    while(!h.isEmpty()){int[] x=h.poll();out[p++]=x[0];int s=x[1],i=x[2]+1;if(i<lists[s].length)h.offer(new int[]{lists[s][i],s,i});}
    return out;
}`,time:`O(N log k), N total values, k lists.`,space:`O(k) heap, excluding output.`,useWhen:`Use to merge sorted lists or streams efficiently.`}
    ],
    examples:[{title:`Keep the three largest`,problem:`Return top 3 values.`,input:`[4,1,7,3,9,2], k=3`,steps:[{title:`4`,detail:`First candidate.`,state:`heap=[4]`},{title:`1`,detail:`Two retained.`,state:`heap=[1,4]`},{title:`7`,detail:`Fill capacity; 1 is weakest.`,state:`heap=[1,4,7]`},{title:`3`,detail:`Size 4, remove 1.`,state:`heap=[3,4,7]`},{title:`9`,detail:`Remove weakest 3.`,state:`heap=[4,7,9]`},{title:`2`,detail:`Newcomer is rejected.`,state:`heap=[4,7,9]`}],result:`Top three are 4, 7, 9.`},
    {title:`Merge two lists`,problem:`Merge ascending lists.`,input:`A=[1,4,7], B=[2,3,8]`,steps:[{title:`Seed`,detail:`Offer both heads.`,state:`heap=[1A,2B]`},{title:`Take 1`,detail:`Append 1 and offer A's 4.`,state:`out=[1], heap=[2B,4A]`},{title:`Take 2`,detail:`Append 2 and offer B's 3.`,state:`out=[1,2], heap=[3B,4A]`},{title:`Take 3`,detail:`Append 3 and offer B's 8.`,state:`out=[1,2,3], heap=[4A,8B]`},{title:`Take 4`,detail:`Append 4 and offer A's 7.`,state:`out=[1,2,3,4], heap=[7A,8B]`},{title:`Drain`,detail:`Remove both remaining values.`,state:`out=[1,2,3,4,7,8], heap=[]`}],result:`[1,2,3,4,7,8].`}],
    pitfalls:[`Java PriorityQueue is a min-heap by default.`,`A heap is not globally sorted.`,`Top-K largest needs a min-heap of size K.`,`Use Integer.compare in comparators to avoid subtraction overflow.`,`Two median heaps need both size balance and lower <= upper invariant.`,`Define behavior for empty input and invalid K.`],related:[`Array / String`,`Math`,`Graph General`,`Intervals`]
  },  {
    category:`Bit Manipulation`,tagline:`Treat an integer as a row of switches and inspect or update those switches directly.`,
    overview:[`Bit manipulation operates on binary integer representations. AND, OR, XOR, complement, and shifts inspect, set, clear, or combine positions. It can encode compact state, parity, subsets, and low-level arithmetic without converting to strings.`,`A bit mask targets selected positions. For zero-based bit i, 1 shifted left i creates its mask; AND tests, OR sets, AND with the inverted mask clears, and XOR toggles. Shifts move patterns, subject to language width and signed-number rules.`,`XOR has useful laws: x XOR x is zero and x XOR zero is x. Equal pairs therefore cancel, enabling a one-pass single-number solution under exact frequency assumptions. Bit counts support parity, subset enumeration, and small-set DP.`,`These tricks can save memory and work but may be less readable than direct logic. Java int is signed 32-bit; the sign bit and shift-distance rules matter. Use long and 1L for wider masks, unsigned shift where needed, and clear names.`],
    layman:{analogy:`Imagine a panel of tiny on/off switches. A mask is a stencil that lets you inspect or change selected switches at once.`,plainEnglish:[`Each binary position can represent one yes/no fact.`,`A mask singles out one or more positions.`,`Combining with a mask checks, turns on, turns off, or flips those choices.`,`Exclusive-or cancels identical pairs.`]},
    whenToUse:[`The task asks about parity, an unpaired value, or binary representation.`,`A small set of boolean states must fit in a compact integer.`,`Subsets of a small collection must be enumerated or tested.`,`The problem involves powers of two, flags, permissions, or toggling.`,`You need to count set bits or locate a set-bit position.`],
    keyIdeas:[{term:`Bit`,meaning:`A binary digit, either zero or one.`},{term:`Mask`,meaning:`A bit pattern targeting selected positions.`},{term:`AND (&)`,meaning:`A bit remains one only if both corresponding bits are one.`},{term:`OR (|)`,meaning:`A bit is one if either corresponding bit is one.`},{term:`XOR (^)`,meaning:`A bit is one when the inputs differ; equal pairs cancel.`},{term:`Shift`,meaning:`Move bits; signed and unsigned right shifts differ on negative values.`},{term:`Population count`,meaning:`The number of one bits in a value.`}],
    algorithms:[
      {name:`XOR single value`,layman:`Each matching pair cancels, leaving the value that appeared alone.`,how:[`Start accumulator at zero.`,`XOR each input into it.`,`Each duplicate pair contributes zero.`,`Zero leaves the unpaired value unchanged.`,`Return accumulator.`],code:`public static int singleNumber(int[] a){int x=0;for(int v:a)x^=v;return x;}`,time:`O(n).`,space:`O(1).`,useWhen:`Exactly one value occurs once and every other value occurs twice.`},
      {name:`Test, set, clear, toggle`,layman:`Use a one-switch pattern to inspect or change one yes/no setting.`,how:[`Create mask = 1 shifted left by bit index.`,`AND tests whether that flag is on.`,`OR turns it on.`,`AND with complement turns it off.`,`XOR flips it.`],code:`public static int updateBit(int value,int bit,int op){
    int mask=1<<bit;
    if(op==0)return (value&mask)==0?0:1;
    if(op==1)return value|mask;
    if(op==2)return value&~mask;
    return value^mask;
}`,time:`O(1) fixed width.`,space:`O(1).`,useWhen:`Use for compact flags; op 0 tests, 1 sets, 2 clears, other values toggle.`},
      {name:`Enumerate subsets`,layman:`Give every possible group a row of switches and read the selected items from each row.`,how:[`For n items there are 2^n masks.`,`Visit masks from zero to 2^n-1.`,`For each item, AND its one-bit mask with the current mask.`,`Include it if the test is nonzero.`,`Process the represented subset.`],code:`public static int subsetSumCount(int[] a,int target){
    int n=a.length,count=0,limit=1<<n;
    for(int mask=0;mask<limit;mask++){
        int sum=0;for(int i=0;i<n;i++)if((mask&(1<<i))!=0)sum+=a[i];
        if(sum==target)count++;
    }
    return count;
}`,time:`O(n * 2^n).`,space:`O(1) auxiliary.`,useWhen:`Use exhaustive enumeration only for small n.`}
    ],
    examples:[{title:`Cancel duplicate pairs`,problem:`Find the single value while all others occur twice.`,input:`[4,1,2,1,2]`,steps:[{title:`Initialize`,detail:`XOR identity is zero.`,state:`x=0`},{title:`Read 4`,detail:`Zero XOR 4 is 4.`,state:`x=4`},{title:`Read 1`,detail:`4 XOR 1 is 5.`,state:`x=5`},{title:`Read 2`,detail:`5 XOR 2 is 7.`,state:`x=7`},{title:`Read second 1`,detail:`The 1 pair cancels.`,state:`x=6`},{title:`Read second 2`,detail:`The 2 pair cancels, leaving 4.`,state:`x=4`}],result:`4.`},
    {title:`Decode a subset mask`,problem:`Determine selected items and whether B is selected.`,input:`items=[A,B,C], mask=5 (binary 101)`,steps:[{title:`A bit`,detail:`Bit zero is set.`,state:`mask & 001 = 001`},{title:`B bit`,detail:`Bit one is clear.`,state:`mask & 010 = 000`},{title:`C bit`,detail:`Bit two is set.`,state:`mask & 100 = 100`},{title:`Collect`,detail:`Include only positions with nonzero test.`,state:`selected=[A,C]`},{title:`Answer`,detail:`B's bit test is zero.`,state:`B=false`}],result:`Mask 5 means {A,C}; B is not selected.`}],
    pitfalls:[`Java shift distances wrap modulo operand width; 1 << 32 is not a distinct bit.`,`Use long and 1L for 64-bit masks.`,`Use >>> when zero-fill right shifting is needed.`,`XOR cancellation depends on exact occurrence assumptions.`,`1 << n overflows for large n; subset enumeration is exponential.`,`Parenthesize bit expressions for clarity.`],related:[`Math`,`Array / String`,`Backtracking`,`1D DP`]
  },  {
    category:`Math`,tagline:`Use mathematical structure to replace repeated work with exact, efficient calculations.`,
    overview:[`Interview math includes divisibility, greatest common divisors, prime structure, modular arithmetic, counting, and numeric bounds. The aim is to find invariants that reduce work or prove that a candidate cannot succeed.`,`The Euclidean algorithm computes gcd by replacing a pair with the smaller value and the remainder: gcd(a,b)=gcd(b,a mod b). It terminates quickly. For positive values, lcm(a,b)=a/gcd(a,b)*b; divide first to reduce overflow risk.`,`Modulo keeps values bounded while preserving congruence. Addition, subtraction, and multiplication can be reduced modulo m; division is not generally valid unless an inverse exists. Large intermediate products may overflow before reduction.`,`The right technique depends on assumptions: positivity, signed range, overflow limits, and exact versus modular output. Prove the formula and handle zero, negative values, and extremes explicitly; mathematical correctness includes numeric representation.`],
    layman:{analogy:`To cut two ropes into largest equal pieces, repeatedly replace the longer length by its leftover after dividing by the shorter, rather than testing every possible piece length.`,plainEnglish:[`Look for repeated structure such as common factors or remainders.`,`Reduce large calculations while preserving the property needed.`,`Check zero, negative inputs, and products that may overflow.`,`A short proof establishes that the formula covers all valid cases.`]},
    whenToUse:[`The prompt mentions divisibility, common factors, multiples, primes, or fractions.`,`A large answer is required modulo a fixed number.`,`A repeating process can be reduced using an invariant.`,`Constraints suggest a formula or number-theoretic method instead of simulation.`,`Integer roots, overflow-safe comparisons, or digit properties matter.`],
    keyIdeas:[{term:`GCD`,meaning:`Greatest positive integer dividing both inputs.`},{term:`Euclidean algorithm`,meaning:`Repeated replacement (a,b) -> (b,a mod b) until remainder is zero.`},{term:`LCM`,meaning:`Least common multiple; for positive inputs a/gcd(a,b)*b.`},{term:`Modulo`,meaning:`Remainder class used to bound values and represent congruence.`},{term:`Overflow`,meaning:`A result exceeds the numeric type's representable range.`},{term:`Invariant`,meaning:`A property preserved by every transformation.`}],
    algorithms:[
      {name:`Euclidean GCD and LCM`,layman:`Replace a pair by the smaller number and the remainder of dividing the larger by it.`,how:[`Take absolute values for non-negative inputs.`,`While second value is nonzero, compute first modulo second.`,`Replace pair by second and remainder.`,`The remaining first value is GCD.`,`For LCM divide before multiplying; define zero behavior.`],code:`public static long gcd(long a,long b){
    a=Math.abs(a);b=Math.abs(b);
    while(b!=0){long r=a%b;a=b;b=r;}
    return a;
}
public static long lcm(long a,long b){
    if(a==0||b==0)return 0;
    return Math.abs((a/gcd(a,b))*b);
}`,time:`O(log(min(a,b))) remainder steps.`,space:`O(1).`,useWhen:`Use for reducing fractions, common divisibility, or least common multiples.`},
      {name:`Fast modular exponentiation`,layman:`Build a large power by repeated squaring, multiplying only for set binary digits of the exponent.`,how:[`Reduce base modulo m and initialize result to 1 modulo m.`,`While exponent is positive, inspect its low bit.`,`Multiply result by base when the bit is set.`,`Square base modulo m and shift exponent right.`,`Return residue.`],code:`public static long modPow(long base,long exp,long mod){
    if(mod<=0||exp<0)throw new IllegalArgumentException();
    base=Math.floorMod(base,mod);long ans=1%mod;
    while(exp>0){if((exp&1L)!=0)ans=(ans*base)%mod;base=(base*base)%mod;exp>>=1;}
    return ans;
}`,time:`O(log exponent) multiplications.`,space:`O(1); products must fit long.`,useWhen:`Use when exponentiation is huge and the answer is needed modulo m.`},
      {name:`Sieve of Eratosthenes`,layman:`List candidates and cross out multiples of each prime, beginning at its square.`,how:[`Mark values 2 through n-1 as possible primes.`,`For each p with p*p<n, skip if already crossed out.`,`Cross off multiples starting at p*p.`,`Smaller multiples already had a smaller prime factor.`,`Count or collect the remaining marks.`],code:`public static int countPrimes(int n){
    if(n<=2)return 0;
    boolean[] p=new boolean[n];java.util.Arrays.fill(p,true);p[0]=p[1]=false;
    for(int x=2;x<=(n-1)/x;x++)if(p[x])for(int j=x*x;j<n;j+=x)p[j]=false;
    int count=0;for(boolean v:p)if(v)count++;return count;
}`,time:`O(n log log n).`,space:`O(n).`,useWhen:`Use to list primes below a manageable limit or answer many bounded primality queries.`}
    ],
    examples:[{title:`Reduce a fraction`,problem:`Find gcd(48,18) and simplify 48/18.`,input:`a=48, b=18`,steps:[{title:`Remainder 1`,detail:`48 divided by 18 leaves 12.`,state:`(18,12)`},{title:`Remainder 2`,detail:`18 divided by 12 leaves 6.`,state:`(12,6)`},{title:`Remainder 3`,detail:`12 divided by 6 leaves 0.`,state:`(6,0)`},{title:`GCD`,detail:`The nonzero value is the gcd.`,state:`gcd=6`},{title:`Reduce`,detail:`Divide numerator and denominator by 6.`,state:`48/6=8, 18/6=3`}],result:`gcd=6; reduced fraction 8/3.`},
    {title:`Modular power`,problem:`Compute 3^5 mod 7 by repeated squaring.`,input:`base=3, exponent=5, mod=7`,steps:[{title:`Initialize`,detail:`Set residue and reduced base.`,state:`ans=1, base=3, exp=5`},{title:`Odd 5`,detail:`Multiply answer by 3; square base modulo 7.`,state:`ans=3, base=2, exp=2`},{title:`Even 2`,detail:`Skip multiplication and square 2 modulo 7.`,state:`ans=3, base=4, exp=1`},{title:`Odd 1`,detail:`Multiply by 4 modulo 7.`,state:`ans=5, base=2, exp=0`},{title:`Finish`,detail:`No exponent bits remain.`,state:`ans=5`}],result:`3^5 mod 7 = 5.`}],
    pitfalls:[`Math.abs(Long.MIN_VALUE) stays negative because its positive magnitude cannot fit.`,`LCM may overflow; dividing first reduces but does not eliminate that risk.`,`Java remainder can be negative; use floorMod for normalized residues.`,`Modular division requires an inverse and is not ordinary division.`,`Residue multiplication can overflow before modulo; use safe multiplication for large bounds.`,`Sieve multiplication and array limits must be bounded safely.`],related:[`Bit Manipulation`,`Array / String`,`1D DP`]
  },  {
    category:`1D DP`,tagline:`Solve overlapping choices along a sequence by remembering the best answer for each prefix or position.`,
    overview:[`One-dimensional dynamic programming applies when a problem's state is indexed by one changing quantity, often a position or capacity. Each state describes a smaller prefix or suffix; a recurrence derives the current answer from previous states.`,`A sound solution defines state meaning, recurrence, base cases, and evaluation order. Stair counts depend on earlier steps; a non-adjacent reward choice compares taking the current value plus an older state with skipping it. Repeated subproblems make naive recursion wasteful.`,`Top-down memoization follows recursion and caches computed states; bottom-up tabulation fills states in dependency order. If only a fixed number of previous states are needed, rolling variables can replace the table. Knapsack loop direction controls whether an item may be reused.`,`DP is not automatically clearer or faster: state spaces can grow, and compression can hide dependencies. Verify base cases and order with small inputs. If the chosen items must be returned, preserve predecessor or decision information.`],
    layman:{analogy:`Imagine climbing stairs where each landing's best route depends on a few earlier landings. Write each answer once and reuse it rather than recounting every route.`,plainEnglish:[`State precisely what each stored answer means.`,`Identify smaller answers that can contribute to the current one.`,`Cache or fill those answers before they are needed again.`,`Keep only recent answers if older ones can no longer matter.`]},
    whenToUse:[`Each next sequence answer depends on earlier positions.`,`The prompt asks for ways, minimum cost, maximum reward, or feasibility over choices.`,`A naive recursion revisits the same position or remaining capacity.`,`Choices have adjacency, capacity, or no-reuse constraints.`,`A single prefix or capacity dimension captures all information needed.`],
    keyIdeas:[{term:`State`,meaning:`Precise meaning of an answer stored at a position or capacity.`},{term:`Recurrence`,meaning:`Rule deriving a state from smaller states.`},{term:`Base case`,meaning:`Smallest state known without recurrence.`},{term:`Memoization`,meaning:`Top-down recursion that caches computed states.`},{term:`Tabulation`,meaning:`Bottom-up table filled in dependency order.`},{term:`Rolling variables`,meaning:`Only recent states still needed by future calculations.`},{term:`Loop direction`,meaning:`Capacity traversal direction controlling whether an item can be reused.`}],
    algorithms:[
      {name:`Top-down memoization`,layman:`Ask for the last stair's answer, recursively solve earlier stairs, and record each result once.`,how:[`Define a recursive function for the current position.`,`Return direct base-case answers.`,`Return the cache when the state was solved.`,`Compute from smaller states and store the result.`,`Start at the requested state.`],code:`public static int climbMemo(int n){
    int[] memo=new int[n+1];java.util.Arrays.fill(memo,-1);
    return ways(n,memo);
}
private static int ways(int n,int[] memo){
    if(n==0)return 1;if(n<0)return 0;if(memo[n]!=-1)return memo[n];
    return memo[n]=ways(n-1,memo)+ways(n-2,memo);
}`,time:`O(n) distinct states.`,space:`O(n) cache and recursion stack.`,useWhen:`Use when recursion is natural or only a subset of states is reachable.`},
      {name:`Bottom-up rolling state`,layman:`Walk upward while carrying the last two landing counts.`,how:[`Handle smallest n directly.`,`Initialize answers for first positions.`,`Advance so prerequisites are already known.`,`Compute the next value from the recurrence.`,`Shift remembered values and return the last.`],code:`public static int climbStairs(int n){
    if(n<0)return 0;if(n<=1)return 1;
    int twoBack=1,oneBack=1;
    for(int i=2;i<=n;i++){int cur=oneBack+twoBack;twoBack=oneBack;oneBack=cur;}
    return oneBack;
}`,time:`O(n).`,space:`O(1).`,useWhen:`Use when a state depends on a fixed number of preceding states.`},
      {name:`0/1 knapsack`,layman:`For each item update capacity from large to small so it cannot be selected twice in that pass.`,how:[`Let dp[c] be the best value at capacity c.`,`Initialize zero when selecting nothing is allowed.`,`Process each item once.`,`Scan capacity downward from limit to item weight.`,`Compare skipping with adding item value to the prior-capacity state.`],code:`public static int knapsack01(int[] w,int[] v,int cap){
    int[] dp=new int[cap+1];
    for(int i=0;i<w.length;i++)for(int c=cap;c>=w[i];c--)
        dp[c]=Math.max(dp[c],dp[c-w[i]]+v[i]);
    return dp[cap];
}`,time:`O(nC), n items and capacity C.`,space:`O(C).`,useWhen:`Use for capacity optimization when each item is selectable at most once.`}
    ],
    examples:[{title:`Ways up five stairs`,problem:`Count routes with one- or two-step moves.`,input:`n=5`,steps:[{title:`Ground`,detail:`There is one way to stay at step zero.`,state:`dp[0]=1`},{title:`Step 1`,detail:`One single-step route.`,state:`dp[1]=1`},{title:`Step 2`,detail:`Arrive from step 1 or 0.`,state:`dp[2]=1+1=2`},{title:`Step 3`,detail:`Sum ways at 2 and 1.`,state:`dp[3]=2+1=3`},{title:`Step 4`,detail:`Sum ways at 3 and 2.`,state:`dp[4]=3+2=5`},{title:`Step 5`,detail:`Sum ways at 4 and 3.`,state:`dp[5]=5+3=8`}],result:`8 ways.`},
    {title:`Choose non-neighbor rewards`,problem:`Maximize the sum without choosing adjacent entries.`,input:`[2,7,9,3,1]`,steps:[{title:`Index 0`,detail:`Take the first value.`,state:`dp=[2]`},{title:`Index 1`,detail:`Choose max(2,7).`,state:`dp=[2,7]`},{title:`Index 2`,detail:`Take 9 plus dp[0]=2 gives 11.`,state:`dp=[2,7,11]`},{title:`Index 3`,detail:`Take 3+dp[1]=10 or skip for 11.`,state:`dp=[2,7,11,11]`},{title:`Index 4`,detail:`Take 1+dp[2]=12, better than skip.`,state:`dp=[2,7,11,11,12]`},{title:`Finish`,detail:`Selected values are 2, 9, and 1.`,state:`sum=12`}],result:`12.`}],
    pitfalls:[`A vague state meaning leads to an invalid recurrence.`,`Incorrect base cases shift all subsequent values.`,`Ascending capacity in 0/1 knapsack can reuse an item repeatedly.`,`Rolling storage is unsafe if discarded states remain dependencies.`,`Deep memo recursion can overflow the call stack.`,`A value-only compressed table cannot reconstruct choices without extra information.`],related:[`Multidimensional DP`,`Array / String`,`Math`,`Backtracking`]
  },  {
    category:`Multidimensional DP`,tagline:`Represent each independent position or constraint as a state dimension, then combine smaller states.`,
    overview:[`Multidimensional dynamic programming indexes states by two or more changing quantities: row and column, two string positions, or item index and remaining capacity. Each coordinate captures information required by future choices. A recurrence combines smaller states in an order that respects dependencies.`,`Grid tasks often use dp[r][c] for paths or cost to a cell. Sequence comparisons use dp[i][j] for prefixes of two strings; matching and differing characters have distinct transitions. Knapsack can use item index plus capacity, with extra dimensions for additional resources.`,`A table over dimensions of sizes m and n generally costs O(mn) time and space. If each row depends only on the previous row, storage may be compressed, but in-place updates must preserve old values used by the recurrence.`,`The key challenge is an exact cell definition and correct boundaries. Plausible transitions may double-count paths or reuse items. Work a small input by hand, distinguish prefix length i from character index i-1, and verify evaluation order.`],
    layman:{analogy:`Imagine a map with rows and columns, or a chart comparing two words. Each square stores the best result for the smaller pieces that meet there.`,plainEnglish:[`Use a table coordinate for each independently changing piece of information.`,`Give each cell a precise meaning, such as best cost for these two prefixes.`,`Compute a cell only after its prerequisite cells are ready.`,`Compress memory only after identifying which previous rows future cells need.`]},
    whenToUse:[`The problem involves two sequences, grid coordinates, or multiple capacities.`,`A grid asks for path count, reachability, or cost.`,`The prompt asks for longest common subsequence or edit distance.`,`Decisions depend on both item index and remaining capacity.`,`A one-dimensional state loses information needed to distinguish prefixes or constraints.`],
    keyIdeas:[{term:`State coordinates`,meaning:`Indices or quantities that identify a subproblem.`},{term:`Prefix state`,meaning:`Answer for first i or j items/characters, excluding the next index.`},{term:`Transition`,meaning:`Equation combining smaller states for a cell.`},{term:`Boundary state`,meaning:`Row or column for empty prefixes or grid edges.`},{term:`Evaluation order`,meaning:`Traversal that computes every dependency first.`},{term:`Space compression`,meaning:`Retain only rows or columns still needed.`},{term:`Edit operation`,meaning:`Insertion, deletion, or replacement represented by a prefix transition.`}],
    algorithms:[
      {name:`Grid path count`,layman:`A square receives paths from directly above and directly left.`,how:[`Create a table for each grid location.`,`Set open start to one route.`,`Visit cells row by row.`,`Blocked cells remain zero; open cells add top and left counts.`,`Return destination count.`],code:`public static long uniquePaths(int[][] blocked){
    int r=blocked.length,c=blocked[0].length;long[][] dp=new long[r][c];
    if(blocked[0][0]!=0)return 0;dp[0][0]=1;
    for(int i=0;i<r;i++)for(int j=0;j<c;j++){
        if(blocked[i][j]!=0){dp[i][j]=0;continue;}
        if(i>0)dp[i][j]+=dp[i-1][j];if(j>0)dp[i][j]+=dp[i][j-1];
    }
    return dp[r-1][c-1];
}`,time:`O(rows * columns).`,space:`O(rows * columns).`,useWhen:`Use for right/down paths with obstacles; adapt predecessor cells for other moves.`},
      {name:`Longest common subsequence`,layman:`Compare two prefixes; matching final letters extend the diagonal's best sequence.`,how:[`Make (m+1) by (n+1) table for prefix lengths.`,`Empty-prefix row and column are zero.`,`When final characters match, take diagonal plus one.`,`Otherwise take larger of skipping one character from either prefix.`,`Return full-prefix cell.`],code:`public static int lcsLength(String a,String b){
    int m=a.length(),n=b.length();int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++)for(int j=1;j<=n;j++)
        if(a.charAt(i-1)==b.charAt(j-1))dp[i][j]=dp[i-1][j-1]+1;
        else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
    return dp[m][n];
}`,time:`O(mn).`,space:`O(mn), reducible to O(min(m,n)) for length only.`,useWhen:`Use for longest order-preserving sequence shared by two strings or arrays.`},
      {name:`Edit distance`,layman:`For each pair of prefixes, match equal endings or pay for replace, remove, or insert.`,how:[`Create a table for prefix lengths i and j.`,`Set dp[i][0]=i and dp[0][j]=j.`,`Matching final characters copy the diagonal.`,`Otherwise add one to minimum replace, delete, and insert predecessor.`,`Return full-prefix value.`],code:`public static int editDistance(String a,String b){
    int m=a.length(),n=b.length();int[][] dp=new int[m+1][n+1];
    for(int i=0;i<=m;i++)dp[i][0]=i;for(int j=0;j<=n;j++)dp[0][j]=j;
    for(int i=1;i<=m;i++)for(int j=1;j<=n;j++)
        if(a.charAt(i-1)==b.charAt(j-1))dp[i][j]=dp[i-1][j-1];
        else dp[i][j]=1+Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1]));
    return dp[m][n];
}`,time:`O(mn).`,space:`O(mn), reducible to O(min(m,n)) for distance only.`,useWhen:`Use for unit-cost insertion, deletion, and replacement between strings.`}
    ],
    examples:[{title:`Route around an obstacle`,problem:`Count right/down paths from top-left to bottom-right.`,input:`blocked=[[0,0,0],[0,1,0],[0,0,0]]; 1=blocked`,steps:[{title:`Start`,detail:`One way to stand at open start.`,state:`row0=[1,0,0]`},{title:`Top row`,detail:`Only right movement contributes.`,state:`row0=[1,1,1]`},{title:`First column`,detail:`Each open cell below start inherits from above.`,state:`row1 col0=1; row2 col0=1`},{title:`Center obstacle`,detail:`No paths enter blocked cell.`,state:`row1=[1,0,0]`},{title:`Row 1 col 2`,detail:`Top has one path; left obstacle has zero.`,state:`row1=[1,0,1]`},{title:`Bottom row`,detail:`Values accumulate from above and left.`,state:`row2=[1,1,2]`}],result:`2 paths reach destination.`},
    {title:`LCS of two short strings`,problem:`Find longest common subsequence length.`,input:`a="abc", b="ac"`,steps:[{title:`Empty prefixes`,detail:`Either empty prefix has match length zero.`,state:`row0=[0,0,0]`},{title:`Prefix a`,detail:`a matches a then remains a match when b's c is added.`,state:`row1=[0,1,1]`},{title:`Prefix ab`,detail:`b mismatches; best remains one for both columns.`,state:`row2=[0,1,1]`},{title:`Prefix abc, col a`,detail:`c mismatches a; best remains one.`,state:`dp[3][1]=1`},{title:`Prefix abc, col ac`,detail:`c matches c; extend diagonal dp[2][1]=1.`,state:`dp[3][2]=2`},{title:`Final table`,detail:`All rows computed from prefixes.`,state:`[[0,0,0],[0,1,1],[0,1,1],[0,1,2]]`}],result:`LCS length 2; subsequence "ac".`}],
    pitfalls:[`Confusing character index with prefix length shifts table access; +1 dimensions help.`,`Seed the grid start once and handle obstacles without inheriting counts.`,`Blocked cells must remain zero.`,`LCS mismatch takes max(top,left), not their sum.`,`Edit distance operations use three different predecessor cells.`,`In-place compression must preserve the old diagonal before overwriting it.`],related:[`1D DP`,`Array / String`,`Matrix`,`Backtracking`]
  }
];