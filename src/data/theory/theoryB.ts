import type { TheoryTopic } from './types';

export const theoryB: TheoryTopic[] = [
  {
    category: 'Binary Tree General', tagline: 'Use recursive structure and traversal order to reason about every node exactly once.',
    overview: [
      `A binary tree is a hierarchy in which each node has at most a left child and a right child. Its shape may be uneven, so a node's path from the root matters. General tree problems do not promise sorted values; do not apply binary-search-tree assumptions without an explicit invariant.`,
      `Depth-first search follows a branch before returning to its parent. Preorder processes a node before its children, inorder between its children, and postorder after them. Recursion mirrors the structure: solve each child subtree and combine the returned answers at the parent.`,
      `Design a helper by defining what it returns for one subtree, what an empty subtree returns, and how the parent combines child results. This approach handles height, balance, path sums, and lowest common ancestor. Iterative traversal replaces recursive calls with an explicit stack.`,
      `A full traversal costs O(n). Recursive DFS uses O(h) stack space for height h, while BFS can hold O(w) nodes for maximum width w. Recursion is concise but a very long, skewed tree may exceed the call-stack limit.`
    ],
    layman: { analogy: `Imagine inspecting a family tree: visit a person before descendants, between the two branches, or after both branches.`, plainEnglish: [`Start at the root and choose when to process a node relative to its children.`, `Ask each child branch for an answer, then combine those answers.`, `An empty branch has a simple answer that ends recursion cleanly.`, `Use an explicit stack when you want to manage return trips yourself.`] },
    whenToUse: [`The input is a root with left and right children.`, `The task asks for height, depth, path properties, or node count.`, `You must inspect every node without relying on sorted values.`, `A parent answer depends on answers from both subtrees.`, `The prompt requests preorder, inorder, postorder, or a root-to-leaf path.`],
    keyIdeas: [{term:`Root`,meaning:`The entry point of the tree.`},{term:`Leaf`,meaning:`A node with no children.`},{term:`Subtree`,meaning:`A node together with all its descendants.`},{term:`Depth`,meaning:`Number of edges from root to a node.`},{term:`Height`,meaning:`Maximum distance from a node to a leaf, measured consistently in edges or nodes.`},{term:`Traversal order`,meaning:`When a node is processed relative to its children.`}],
    algorithms: [
      { name:`Recursive DFS traversal`, layman:`Visit one node, completely inspect its left branch and then its right branch.`, how:[`Return when the node is absent.`,`Process the node now for preorder.`,`Recursively visit the left child.`,`Process the node here for inorder.`,`Visit right, then process here for postorder.`], code:`// Assumes the usual TreeNode class with val, left, and right fields.
void preorder(TreeNode node, java.util.List<Integer> out) {
    if (node == null) return;
    out.add(node.val);
    preorder(node.left, out);
    preorder(node.right, out);
}`, time:`O(n), each node once.`, space:`O(h) recursion stack.`, useWhen:`Use preorder to serialize structure; move the processing line for inorder or postorder.` },
      { name:`Compute height bottom-up`, layman:`Ask each branch how tall it is, then add a level above the taller answer.`, how:[`Treat an empty subtree as height zero when counting nodes.`,`Compute left height.`,`Compute right height.`,`Return one plus the larger height.`], code:`// Assumes TreeNode has left and right fields.
int height(TreeNode node) {
    if (node == null) return 0;
    int leftHeight = height(node.left);
    int rightHeight = height(node.right);
    return 1 + Math.max(leftHeight, rightHeight);
}`, time:`O(n).`, space:`O(h).`, useWhen:`Use for maximum depth or properties combined from child results.` },
      { name:`Lowest common ancestor`, layman:`Find the first shared meeting point when walking upward from either target.`, how:[`Return null for an empty branch; return the node if it is either target.`,`Search left for either target.`,`Search right for either target.`,`If both sides find a target, the current node is their shared ancestor.`,`Otherwise return the side that found a target.`], code:`// Assumes TreeNode and that both targets are in the tree.
TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`, time:`O(n) worst case.`, space:`O(h) recursion stack.`, useWhen:`Use when values have no ordering and both target nodes are present.` }
    ],
    examples: [
      { title:`Height of a small tree`, problem:`Find height for root 1, children 2 and 3, with 2's left child 4.`, input:`root = [1,2,3,4]`, steps:[
        {title:`Start at 1`,detail:`Ask for heights of both subtrees.`,state:`call height(1)`},{title:`Inspect 2`,detail:`Node 2 has child 4 and no right child.`,state:`call height(2)`},{title:`Reach 4`,detail:`Both child calls return zero.`,state:`height(4)=1`},{title:`Finish 2`,detail:`Child heights are one and zero.`,state:`height(2)=2`},{title:`Finish 1`,detail:`Right child 3 has height one.`,state:`height(1)=1+max(2,1)=3`}
      ], result:`Height is 3 nodes, or 2 edges to the deepest leaf.` },
      { title:`Preorder sequence`, problem:`Visit root 1, left child 2 with children 4 and 5, then right child 3.`, input:`root = [1,2,3,4,5]`, steps:[
        {title:`Visit root`,detail:`Preorder processes before children.`,state:`output=[1]`},{title:`Go left`,detail:`Visit 2 before its descendants.`,state:`output=[1,2]`},{title:`Visit 2's left`,detail:`Node 4 is a leaf.`,state:`output=[1,2,4]`},{title:`Visit 2's right`,detail:`Return and process 5.`,state:`output=[1,2,4,5]`},{title:`Return to root`,detail:`Visit root's right child last.`,state:`output=[1,2,4,5,3]`}
      ], result:`Preorder is [1, 2, 4, 5, 3].` }
    ],
    pitfalls:[`Assuming BST ordering when none is given.`,`Forgetting the empty-node base case or its identity answer.`,`Mixing height measured in edges and height measured in nodes.`,`Doing parent work before child answers exist in a bottom-up calculation.`,`Ignoring recursion depth on a long one-sided tree.`], related:[`Binary Tree BFS`,`Binary Search Tree`,`Divide & Conquer`]
  },
  {
    category:`Binary Tree BFS`, tagline:`Process a tree one level at a time with a first-in-first-out queue.`,
    overview:[
      `Breadth-first search explores all nodes at one depth before moving deeper. A queue gives that order naturally: remove the earliest discovered node, then append its children. In trees this is called level-order traversal.`,
      `To preserve levels, capture the queue size at the start of a round and process exactly that many nodes. Children appended during that round belong to the next level. This supports level sums, averages, right-side views, and other row-based tasks.`,
      `BFS is useful when the shallowest match is the answer: its first discovery has minimum depth. A true tree needs no visited set because each node has one parent (except the root); graph-shaped inputs do require cycle protection.`,
      `BFS visits O(n) nodes and stores up to O(w) nodes, where w is the maximum width. It avoids deep recursive calls but can hold many nodes on a broad level.`
    ],
    layman:{analogy:`Picture a school assembly: call everyone in the first row, then the next row, instead of following one person down a hallway.`,plainEnglish:[`Put the root at the back of a waiting line.`,`Remove the front node and add its children to the back.`,`Remember how many nodes are in the current row.`,`The first leaf reached is the shallowest leaf.`]},
    whenToUse:[`The prompt asks for level order or values grouped by depth.`,`You need the shortest root-to-target distance.`,`The desired view selects the first or last node in each row.`,`You need to compare or aggregate nodes at equal depth.`,`You want to avoid deep recursive calls.`],
    keyIdeas:[{term:`Queue`,meaning:`A first-in-first-out collection for processing nodes in discovery order.`},{term:`Level`,meaning:`Nodes at the same distance from the root.`},{term:`Frontier`,meaning:`Discovered nodes awaiting expansion.`},{term:`Level boundary`,meaning:`Queue size captured before processing one depth.`},{term:`Width`,meaning:`Largest number of nodes on any one level.`},{term:`Shortest path`,meaning:`A path with fewest edges, discovered first by unweighted BFS.`}],
    algorithms:[
      {name:`Level-order traversal`,layman:`Work through the waiting line in batches, one tree row per batch.`,how:[`Return an empty result for no root.`,`Enqueue the root.`,`Capture the queue size before processing a row.`,`Remove exactly that many nodes, recording values and adding children.`,`Append the row and continue.`],code:`// Assumes TreeNode has val, left, and right fields.
java.util.List<java.util.List<Integer>> levels(TreeNode root) {
    java.util.List<java.util.List<Integer>> answer = new java.util.ArrayList<>();
    if (root == null) return answer;
    java.util.Queue<TreeNode> queue = new java.util.ArrayDeque<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int count = queue.size();
        java.util.List<Integer> level = new java.util.ArrayList<>();
        for (int i = 0; i < count; i++) {
            TreeNode node = queue.remove(); level.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        answer.add(level);
    }
    return answer;
}`,time:`O(n).`,space:`O(w), excluding returned values.`,useWhen:`Use for grouped values, level sums, averages, and tree views.`},
      {name:`Minimum depth`,layman:`Stop at the first leaf encountered while checking rows from top to bottom.`,how:[`Return zero for an empty tree.`,`Queue root and set depth to one.`,`Process a complete level before incrementing depth.`,`Return when a removed node has no children.`,`Otherwise enqueue existing children.`],code:`// Assumes TreeNode has left and right fields.
int minDepth(TreeNode root) {
    if (root == null) return 0;
    java.util.Queue<TreeNode> queue = new java.util.ArrayDeque<>(); queue.add(root);
    int depth = 1;
    while (!queue.isEmpty()) {
        int count = queue.size();
        for (int i = 0; i < count; i++) {
            TreeNode node = queue.remove();
            if (node.left == null && node.right == null) return depth;
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        depth++;
    }
    return depth;
}`,time:`O(n) worst case.`,space:`O(w).`,useWhen:`Use when the closest leaf is needed; one missing child does not make a leaf.`},
      {name:`Right-side view`,layman:`From each row keep the last node visible when looking from the right.`,how:[`Initialize queue with root if present.`,`Capture the row size.`,`Process nodes left to right.`,`Record the final node in that row.`,`Append children for the next row.`],code:`// Assumes TreeNode has val, left, and right fields.
java.util.List<Integer> rightSideView(TreeNode root) {
    java.util.List<Integer> out = new java.util.ArrayList<>();
    if (root == null) return out;
    java.util.Queue<TreeNode> q = new java.util.ArrayDeque<>(); q.add(root);
    while (!q.isEmpty()) {
        int count = q.size();
        for (int i = 0; i < count; i++) {
            TreeNode node = q.remove();
            if (i == count - 1) out.add(node.val);
            if (node.left != null) q.add(node.left);
            if (node.right != null) q.add(node.right);
        }
    }
    return out;
}`,time:`O(n).`,space:`O(w).`,useWhen:`Use for one representative per level; reverse child order for left-side view.`}
    ],
    examples:[
      {title:`Build the levels`,problem:`Group root 3, children 9 and 20, and 20's children 15 and 7.`,input:`root=[3,9,20,null,null,15,7]`,steps:[{title:`Queue root`,detail:`First row contains 3.`,state:`queue=[3]`},{title:`Remove 3`,detail:`Record it and enqueue children.`,state:`level=[3], queue=[9,20]`},{title:`Capture size`,detail:`Two nodes belong to the next row.`,state:`count=2`},{title:`Remove 9`,detail:`It has no children.`,state:`level=[9], queue=[20]`},{title:`Remove 20`,detail:`Add 15 and 7 for next row.`,state:`level=[9,20], queue=[15,7]`},{title:`Finish leaves`,detail:`Remove both leaves.`,state:`level=[15,7], queue=[]`}],result:`Levels are [[3],[9,20],[15,7]].`},
      {title:`Find closest leaf`,problem:`Root 1 has left child 2 with child 3 and right child 4.`,input:`root=[1,2,4,3]`,steps:[{title:`Start`,detail:`Root begins at depth one.`,state:`queue=[1], depth=1`},{title:`Expand root`,detail:`Add 2 and 4.`,state:`queue=[2,4], depth=2`},{title:`Check 2`,detail:`It has a child, so it is not a leaf.`,state:`queue=[4,3]`},{title:`Check 4`,detail:`It has no children and ends the search.`,state:`current=4, depth=2`},{title:`Return`,detail:`The first leaf occurs at depth two.`,state:`minimum depth=2`}],result:`Minimum depth is 2 nodes (one edge).`}
    ],
    pitfalls:[`Capturing queue size dynamically rather than at row start.`,`Using a stack, which turns the walk into DFS.`,`Treating a node with one absent child as a leaf.`,`Enqueuing null into ArrayDeque, which rejects null.`,`Adding an absent root to the queue.`],related:[`Binary Tree General`,`Graph BFS`,`Binary Search Tree`]
  },
  {
    category:`Binary Search Tree`,tagline:`Exploit left-smaller, right-larger ordering to search and validate efficiently.`,
    overview:[
      `A binary search tree (BST) is a binary tree whose keys follow an ordering invariant: all keys in the left subtree precede the node and all keys in the right subtree follow it. The rule applies to whole subtrees, not only immediate children. Duplicate handling must be specified.`,
      `Search and insertion compare the target with the current key and discard or descend into one side. A balanced BST supports O(log n) operations, but an unbalanced tree can degrade to a chain and O(n).`,
      `Inorder traversal lists keys in sorted order. Validation should propagate lower and upper bounds so a node cannot be locally plausible but globally misplaced. The same order supports successor, kth-smallest, and range queries.`,
      `A plain BST does not guarantee balance. Use a self-balancing tree for predictable performance under arbitrary insertion order, and define inclusive versus exclusive bounds consistently where duplicates are allowed.`
    ],
    layman:{analogy:`Think of a library shelf with a divider: smaller books go left, larger books go right.`,plainEnglish:[`Compare the target with the current key.`,`If smaller, ignore everything to the right; if larger, ignore the left.`,`Walking left-node-right lists values in order.`,`A lopsided tree loses the speed advantage, like one long pile.`]},
    whenToUse:[`The input explicitly guarantees BST ordering.`,`The task asks to search, insert, delete, or find a successor.`,`You need kth-smallest or ordered traversal without separately sorting.`,`A range query can discard a subtree by its key bounds.`,`The prompt asks if a tree obeys a global ordering invariant.`],
    keyIdeas:[{term:`BST invariant`,meaning:`Left-subtree keys precede a node and right-subtree keys follow it, according to duplicate policy.`},{term:`Inorder`,meaning:`Visit left, node, right; this produces sorted keys in a BST.`},{term:`Bounds`,meaning:`Inherited limits that a node must obey due to all ancestors.`},{term:`Successor`,meaning:`Smallest key strictly greater than a given key.`},{term:`Balanced tree`,meaning:`A tree whose height stays proportional to log n.`},{term:`Skewed tree`,meaning:`A chain-shaped tree with height close to n.`}],
    algorithms:[
      {name:`Search for a key`,layman:`At each divider, choose the only side where the value could still be.`,how:[`Begin at the root.`,`If the current node is absent, the key is missing.`,`Return on equality.`,`Move left for smaller target and right for larger.`,`Repeat until found or reaching null.`],code:`// Assumes TreeNode has val, left, and right fields.
TreeNode search(TreeNode root, int target) {
    TreeNode node = root;
    while (node != null && node.val != target)
        node = target < node.val ? node.left : node.right;
    return node;
}`,time:`O(h): O(log n) balanced, O(n) skewed.`,space:`O(1) iterative.`,useWhen:`Use only when the BST invariant is guaranteed.`},
      {name:`Validate with inherited bounds`,layman:`Carry the narrowest permitted number range down each branch.`,how:[`Start without a lower or upper bound.`,`An empty subtree is valid.`,`Reject a value outside its inherited open interval.`,`Pass current value as left child's upper bound.`,`Pass current value as right child's lower bound.`],code:`// Assumes TreeNode has int val, left, and right.
boolean isValidBST(TreeNode root) { return valid(root, Long.MIN_VALUE, Long.MAX_VALUE); }
boolean valid(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
}`,time:`O(n).`,space:`O(h) stack.`,useWhen:`Use for strict ordering; change bounds consistently for duplicates.`},
      {name:`Kth-smallest by inorder`,layman:`Read the ordered shelf from left to right and stop at position k.`,how:[`Initialize a stack and current pointer at root.`,`Push the full left spine.`,`Pop the next-smallest node and decrement k.`,`Return its key when k becomes zero.`,`Continue from the popped node's right child.`],code:`// Assumes TreeNode; k is valid.
int kthSmallest(TreeNode root, int k) {
    java.util.Deque<TreeNode> stack = new java.util.ArrayDeque<>();
    TreeNode node = root;
    while (node != null || !stack.isEmpty()) {
        while (node != null) { stack.push(node); node = node.left; }
        node = stack.pop();
        if (--k == 0) return node.val;
        node = node.right;
    }
    throw new IllegalArgumentException("k out of range");
}`,time:`O(h+k), O(n) worst case.`,space:`O(h).`,useWhen:`Use when only one ranked value is needed, rather than materializing all keys.`}
    ],
    examples:[
      {title:`Search an ordered tree`,problem:`Search for 6 in a BST rooted at 8, with left 3, right 10, and 3's right child 6.`,input:`root=[8,3,10,null,6], target=6`,steps:[{title:`Compare at root`,detail:`6 < 8, so go left.`,state:`node=8 -> left`},{title:`Compare at 3`,detail:`6 > 3, so go right.`,state:`node=3 -> right`},{title:`Reach 6`,detail:`Current key matches target.`,state:`node.val=target`},{title:`Stop`,detail:`No other branch is needed.`,state:`found=true`},{title:`Return`,detail:`Return the matching node.`,state:`result=node(6)` }],result:`Search succeeds at value 6.`},
      {title:`Validate global bounds`,problem:`Check root 5, children 3 and 8, with 8's left child 4.`,input:`root=[5,3,8,null,null,4]`,steps:[{title:`Check root`,detail:`5 has no inherited bounds.`,state:`valid(5,-inf,+inf)`},{title:`Check left`,detail:`3 is below 5.`,state:`valid(3,-inf,5)=true`},{title:`Check right`,detail:`8 is above 5.`,state:`valid(8,5,+inf)=true`},{title:`Check 8's left`,detail:`4 must be above inherited lower bound 5.`,state:`valid(4,5,8)`},{title:`Reject`,detail:`4 is below the bound even though it is below parent 8.`,state:`4 <= 5`}],result:`The tree is not a valid BST.`}
    ],
    pitfalls:[`Checking only parent-child comparisons, not ancestor bounds.`,`Using int bounds that cannot represent values outside int range.`,`Leaving duplicate policy undefined.`,`Assuming plain BST operations always take O(log n).`,`Confusing zero-based index with one-based k.`],related:[`Binary Tree General`,`Binary Tree BFS`,`Heap`]
  },
  {
    category:`Graph General`,tagline:`Model connections explicitly, then choose traversal and connectivity tools to match.`,
    overview:[
      `A graph consists of vertices and edges. Edges may be directed or undirected, weighted or unweighted, and graphs may contain cycles or disconnected components. Adjacency lists use O(V+E) space and suit sparse graphs; matrices use O(V²) space but provide constant-time edge lookup.`,
      `DFS explores a neighbor and its descendants before returning, while BFS processes distance layers. Mark visited vertices so cycles cannot send traversal around forever. For directed cycle detection, distinguish a currently active recursion path from a fully processed vertex.`,
      `Other graph patterns include topological sorting of a directed acyclic graph, union-find for evolving undirected connectivity, and graph cloning. Cloning requires a map from each original vertex to exactly one copy so cycles and shared neighbors are preserved.`,
      `DFS/BFS and topological sorting are O(V+E); union-find is near constant amortized per operation. Choose the method based on direction, weights, and whether an actual path is needed. Validate indexing and edge direction at the representation boundary.`
    ],
    layman:{analogy:`Treat cities as dots and roads as lines; one-way streets are arrows and a route follows connected roads.`,plainEnglish:[`Write down each place's direct connections.`,`Mark seen places so a loop does not repeat forever.`,`Use a deep walk to explore a route or a layer walk to explore nearby places first.`,`For groups merging over time, keep a representative for each group.`]},
    whenToUse:[`The input describes nodes, edges, roads, dependencies, or relationships.`,`You need reachability or number of connected groups.`,`The task mentions cycles, prerequisites, or valid ordering.`,`Connectivity queries repeat while undirected edges are added.`,`You must copy nodes while preserving connections.`],
    keyIdeas:[{term:`Vertex`,meaning:`A node or entity.`},{term:`Edge`,meaning:`Connection between vertices; direction and weight may matter.`},{term:`Adjacency list`,meaning:`A list of neighbors for each vertex.`},{term:`Component`,meaning:`A maximal mutually reachable group in an undirected graph.`},{term:`Cycle`,meaning:`A path returning to an already encountered vertex.`},{term:`Topological order`,meaning:`An order placing prerequisites before dependents.`},{term:`Union-find`,meaning:`A structure for merging sets and checking membership in the same set.`}],
    algorithms:[
      {name:`DFS connected components`,layman:`Start at an unseen place and walk every route reachable from it.`,how:[`Create a visited array.`,`Scan every vertex.`,`An unseen vertex begins a new component.`,`Run DFS with an explicit stack, marking neighbors as discovered.`,`Continue until every vertex is visited.`],code:`int countComponents(int n, java.util.List<java.util.List<Integer>> graph) {
    boolean[] seen = new boolean[n]; int components = 0;
    for (int start = 0; start < n; start++) {
        if (seen[start]) continue;
        components++;
        java.util.ArrayDeque<Integer> stack = new java.util.ArrayDeque<>();
        stack.push(start); seen[start] = true;
        while (!stack.isEmpty()) {
            int u = stack.pop();
            for (int v : graph.get(u)) if (!seen[v]) { seen[v] = true; stack.push(v); }
        }
    }
    return components;
}`,time:`O(V+E).`,space:`O(V).`,useWhen:`Use adjacency lists for reachability and component counting.`},
      {name:`Topological sort`,layman:`Start with tasks having no prerequisites, then release dependents as tasks finish.`,how:[`Count incoming edges for every vertex.`,`Queue vertices with zero incoming edges.`,`Remove one available vertex and append it to the order.`,`Reduce indegree of its outgoing neighbors; queue any that reaches zero.`,`If not all vertices are output, there is a directed cycle.`],code:`java.util.List<Integer> topologicalOrder(int n, java.util.List<java.util.List<Integer>> graph) {
    int[] indegree = new int[n];
    for (int u = 0; u < n; u++) for (int v : graph.get(u)) indegree[v]++;
    java.util.Queue<Integer> q = new java.util.ArrayDeque<>();
    for (int v = 0; v < n; v++) if (indegree[v] == 0) q.add(v);
    java.util.List<Integer> order = new java.util.ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.remove(); order.add(u);
        for (int v : graph.get(u)) if (--indegree[v] == 0) q.add(v);
    }
    return order.size() == n ? order : java.util.Collections.emptyList();
}`,time:`O(V+E).`,space:`O(V).`,useWhen:`Use on directed dependencies; an empty result signals a cycle.`},
      {name:`Union-find connectivity`,layman:`Keep one representative per group and join groups by linking their representatives.`,how:[`Initialize each vertex as its own parent.`,`Find a root and compress the path while returning.`,`For each undirected edge, find both roots.`,`If roots differ, attach smaller set under larger and decrement count.`,`Return the remaining component count.`],code:`int countComponentsUF(int n, int[][] edges) {
    int[] parent = new int[n], size = new int[n];
    for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
    int count = n;
    for (int[] e : edges) {
        int a = find(parent, e[0]), b = find(parent, e[1]);
        if (a == b) continue;
        if (size[a] < size[b]) { int t = a; a = b; b = t; }
        parent[b] = a; size[a] += size[b]; count--;
    }
    return count;
}
int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]);
    return parent[x];
}`,time:`O((V+E) alpha(V)) amortized.`,space:`O(V).`,useWhen:`Use for undirected connectivity as edges are added when no path itself is required.`}
    ],
    examples:[
      {title:`Count components`,problem:`Count groups among five vertices with edges 0-1, 1-2, and 3-4.`,input:`n=5, edges=[[0,1],[1,2],[3,4]]`,steps:[{title:`Start scan`,detail:`Vertex 0 is unseen and starts a group.`,state:`components=1, stack=[0]`},{title:`Explore 0`,detail:`Discover neighbor 1.`,state:`seen={0,1}, stack=[1]`},{title:`Explore 1`,detail:`Discover 2; then its neighbors are seen.`,state:`seen={0,1,2}`},{title:`Continue scan`,detail:`1 and 2 are seen; 3 starts another group.`,state:`components=2, stack=[3]`},{title:`Explore 3-4`,detail:`Visit 4 and finish.`,state:`seen={0,1,2,3,4}`}],result:`There are 2 components.`},
      {title:`Order prerequisites`,problem:`Order tasks with edges 0->2, 1->2, 2->3.`,input:`n=4`,steps:[{title:`Count indegrees`,detail:`0 and 1 need none; 2 needs both; 3 needs 2.`,state:`indegree=[0,0,2,1]`},{title:`Seed queue`,detail:`Both independent tasks are available.`,state:`queue=[0,1]`},{title:`Remove 0`,detail:`One prerequisite of 2 is cleared.`,state:`order=[0], indegree[2]=1`},{title:`Remove 1`,detail:`Now task 2 becomes available.`,state:`order=[0,1], queue=[2]`},{title:`Release 2 and 3`,detail:`Removing 2 makes 3 available; all tasks complete.`,state:`order=[0,1,2,3]`}],result:`One valid order is [0,1,2,3].`}
    ],
    pitfalls:[`Forgetting reverse adjacency for undirected edges.`,`Marking only when popped and accumulating duplicate stack entries.`,`Ignoring cycles in topological sorting.`,`Mishandling parallel edges in indegree counts.`,`Using union-find for directed reachability.`],related:[`Graph BFS`,`Backtracking`,`Divide & Conquer`]
  },
  {
    category:`Graph BFS`,tagline:`Use a queue to find minimum-edge distances in unweighted graphs and grids.`,
    overview:[
      `Graph BFS starts from one or more vertices and explores in nondecreasing distance from the starts. In an unweighted graph, the first time a vertex is reached gives its shortest path length. A queue stores the frontier; distances or a visited set prevent repeated work.`,
      `For one source, enqueue it at distance zero. For multiple sources, enqueue all at zero; this finds each vertex's nearest source. A parent array can reconstruct one shortest route after distances are found.`,
      `A grid is a graph where open cells are vertices and allowed moves are edges. Bounds and obstacle checks are grid-specific details. Unequal nonnegative edge costs require a weighted shortest-path algorithm rather than ordinary BFS.`,
      `Adjacency-list BFS costs O(V+E) time and O(V) space. Grid BFS takes O(rows*columns), with a constant number of neighbors per cell. It may use substantial frontier memory, but directly solves equal-cost shortest paths.`
    ],
    layman:{analogy:`Imagine ripples spreading from a pebble: each new ripple reaches places one step farther away.`,plainEnglish:[`Put starting places into a waiting line.`,`Expand locations in discovery order.`,`Record distance the first time a place is seen.`,`Stop when the target is reached or all reachable places are processed.`]},
    whenToUse:[`An unweighted graph asks for the fewest edges or moves.`,`The input is a grid with legal moves and obstacles.`,`You need distance to the nearest one of several sources.`,`The task asks whether a destination is reachable and how many steps it takes.`,`A shortest path must be reconstructed in an unweighted graph.`],
    keyIdeas:[{term:`Distance`,meaning:`Number of edges from a source in an unweighted graph.`},{term:`Frontier`,meaning:`Queue of discovered vertices awaiting expansion.`},{term:`Multi-source BFS`,meaning:`BFS seeded by several distance-zero vertices.`},{term:`Parent pointer`,meaning:`Previous vertex on a selected shortest path.`},{term:`Visited`,meaning:`Marker ensuring a vertex is enqueued at most once.`},{term:`Manhattan neighbors`,meaning:`Four orthogonally adjacent cells in a grid.`}],
    algorithms:[
      {name:`Single-source distances`,layman:`Expand outward from one place and label each place when first discovered.`,how:[`Initialize distances to -1 for unseen.`,`Set source distance to zero and enqueue it.`,`Remove the next vertex.`,`For each unseen neighbor, assign distance plus one and enqueue it.`,`Continue until queue is empty or target is reached.`],code:`int[] shortestDistances(java.util.List<java.util.List<Integer>> graph, int source) {
    int[] dist = new int[graph.size()]; java.util.Arrays.fill(dist, -1);
    java.util.Queue<Integer> q = new java.util.ArrayDeque<>();
    dist[source] = 0; q.add(source);
    while (!q.isEmpty()) {
        int u = q.remove();
        for (int v : graph.get(u)) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.add(v); }
    }
    return dist;
}`,time:`O(V+E).`,space:`O(V).`,useWhen:`Use for shortest edge counts from one source in an unweighted graph.`},
      {name:`Multi-source distances`,layman:`Let several starting points send ripples together; first arrival marks the nearest.`,how:[`Initialize all distances unseen.`,`Set each valid source to zero and enqueue it once.`,`Remove locations one by one.`,`Assign unseen neighbors current distance plus one.`,`Continue until all reachable vertices have distances.`],code:`int[] nearestSourceDistances(java.util.List<java.util.List<Integer>> graph, int[] sources) {
    int[] dist = new int[graph.size()]; java.util.Arrays.fill(dist, -1);
    java.util.Queue<Integer> q = new java.util.ArrayDeque<>();
    for (int s : sources) if (dist[s] == -1) { dist[s] = 0; q.add(s); }
    while (!q.isEmpty()) {
        int u = q.remove();
        for (int v : graph.get(u)) if (dist[v] == -1) { dist[v] = dist[u] + 1; q.add(v); }
    }
    return dist;
}`,time:`O(V+E).`,space:`O(V).`,useWhen:`Use when every vertex needs distance to its closest source in a set.`},
      {name:`Shortest path in a grid`,layman:`Spread step by step through open squares until reaching the destination.`,how:[`Reject a blocked start or target.`,`Initialize a distance grid and enqueue the start.`,`Try each orthogonal neighbor.`,`Skip out-of-range, blocked, or already visited cells.`,`Return target distance or -1 if unreachable.`],code:`int shortestGridPath(int[][] open, int sr, int sc, int tr, int tc) {
    int rows = open.length, cols = open[0].length;
    if (open[sr][sc] == 0 || open[tr][tc] == 0) return -1;
    int[][] dist = new int[rows][cols];
    for (int[] row : dist) java.util.Arrays.fill(row, -1);
    int[] dr = {-1,1,0,0}, dc = {0,0,-1,1};
    java.util.Queue<int[]> q = new java.util.ArrayDeque<>();
    dist[sr][sc] = 0; q.add(new int[]{sr,sc});
    while (!q.isEmpty()) {
        int[] p = q.remove(); int r=p[0], c=p[1];
        if (r == tr && c == tc) return dist[r][c];
        for (int d=0; d<4; d++) {
            int nr=r+dr[d], nc=c+dc[d];
            if (nr>=0 && nr<rows && nc>=0 && nc<cols && open[nr][nc]==1 && dist[nr][nc]==-1) {
                dist[nr][nc]=dist[r][c]+1; q.add(new int[]{nr,nc});
            }
        }
    }
    return -1;
}`,time:`O(rows*columns).`,space:`O(rows*columns).`,useWhen:`Use for equal-cost moves; cells use 1=open, 0=blocked, and grid is nonempty.`}
    ],
    examples:[
      {title:`Shortest graph distance`,problem:`Find distances from 0 with edges 0-1, 0-2, 1-3, 2-3.`,input:`graph=[[1,2],[0,3],[0,3],[1,2]]`,steps:[{title:`Seed`,detail:`Source distance is zero.`,state:`queue=[0], dist=[0,-1,-1,-1]`},{title:`Expand 0`,detail:`Discover 1 and 2 at one step.`,state:`queue=[1,2], dist=[0,1,1,-1]`},{title:`Expand 1`,detail:`Discover 3 at distance two.`,state:`queue=[2,3], dist=[0,1,1,2]`},{title:`Expand 2`,detail:`Its neighbors were already discovered.`,state:`queue=[3]`},{title:`Finish`,detail:`No further vertices remain.`,state:`queue=[], dist=[0,1,1,2]`}],result:`Distances are [0,1,1,2].`},
      {title:`Navigate an open grid`,problem:`Find a path from top-left to bottom-right; the center of a 3x3 grid is blocked.`,input:`[[1,1,1],[1,0,1],[1,1,1]]`,steps:[{title:`Start`,detail:`Mark source distance zero.`,state:`queue=[(0,0)], dist=0`},{title:`Expand source`,detail:`Reach right and down.`,state:`queue=[(0,1),(1,0)], distance=1`},{title:`Top branch`,detail:`Reach (0,2); center is blocked.`,state:`queue=[(1,0),(0,2)], dist(0,2)=2`},{title:`Left branch`,detail:`Reach (2,0).`,state:`queue=[(0,2),(2,0)], dist(2,0)=2`},{title:`Go around`,detail:`Reach (1,2) and (2,1).`,state:`both distance=3`},{title:`Reach target`,detail:`Either branch discovers (2,2).`,state:`dist(2,2)=4`}],result:`Minimum route length is 4 moves.`}
    ],
    pitfalls:[`Using BFS for unequal weights.`,`Marking only on removal, permitting duplicate queue entries.`,`Failing to seed every start in multi-source problems.`,`Confusing edge count with vertex count in path length.`,`Indexing grid before verifying bounds.`],related:[`Graph General`,`Binary Tree BFS`,`Matrix`]
  },
  {
    category:`Trie`,tagline:`Share common prefixes in a tree-shaped index for fast word and prefix lookup.`,
    overview:[
      `A trie stores strings one character at a time. The root represents the empty prefix; each edge represents a character. Words sharing a prefix reuse the same initial path, so prefix questions avoid repeatedly comparing the same beginnings.`,
      `Nodes usually hold a map or array of child links and a marker for a complete word. Insertion creates missing links, then marks the final node. Exact search also checks the marker, while prefix search needs only to find the path.`,
      `Tries suit dictionaries, autocomplete, and word search on grids. With a fixed alphabet, operations take O(L) for word length L. Memory can be high when words share few prefixes; maps reduce unused child slots but add overhead.`,
      `Define case normalization and allowed characters. Prefix enumeration may visit many descendants, so account for output size. In board search, a missing trie edge provides an immediate pruning condition.`
    ],
    layman:{analogy:`A filing cabinet arranged by letter: open the C drawer, then A, then T to find words beginning with CAT.`,plainEnglish:[`Follow one branch for each character.`,`Create a missing branch when adding a word.`,`Mark the end so a prefix is not mistaken for a full word.`,`A prefix needs a path; a word needs a path and end mark.`]},
    whenToUse:[`Repeated word or prefix lookup is needed.`,`Many words share prefixes and autocomplete is requested.`,`A board search should prune paths that match no dictionary prefix.`,`You need to enumerate words starting with a prefix.`,`The character alphabet is sufficiently constrained.`],
    keyIdeas:[{term:`Trie node`,meaning:`Prefix state with outgoing character links and often an end marker.`},{term:`Prefix path`,meaning:`Links spelling the characters consumed so far.`},{term:`Terminal marker`,meaning:`Flag that a complete word ends at the node.`},{term:`Alphabet`,meaning:`Allowed characters that determine child storage.`},{term:`Prefix lookup`,meaning:`Checks path existence without requiring a terminal marker.`},{term:`Pruning`,meaning:`Stops exploration when the current prefix path is absent.`}],
    algorithms:[
      {name:`Insert a word`,layman:`Walk its letters, build missing hallways, and mark the final room.`,how:[`Start at root.`,`For each character, look for a child link.`,`Create a node when the link is absent.`,`Move to that child.`,`Mark the last node as a complete word.`],code:`// Assumes TrieNode has Map<Character, TrieNode> children and String word.
void insert(TrieNode root, String text) {
    TrieNode node = root;
    for (char ch : text.toCharArray()) {
        node.children.putIfAbsent(ch, new TrieNode());
        node = node.children.get(ch);
    }
    node.word = text;
}`,time:`O(L) expected with hash-map links.`,space:`O(L) new nodes worst case.`,useWhen:`Use to add words while sharing existing prefixes.`},
      {name:`Search word or prefix`,layman:`Follow each letter; for a whole word, also check its end marker.`,how:[`Begin at root.`,`Follow matching child for every character.`,`Fail when a child is absent.`,`A prefix query succeeds once its path is found.`,`An exact-word query additionally requires terminal marker.`],code:`// Assumes TrieNode has Map<Character, TrieNode> children and String word.
boolean contains(TrieNode root, String text, boolean requireWord) {
    TrieNode node = root;
    for (char ch : text.toCharArray()) { node = node.children.get(ch); if (node == null) return false; }
    return !requireWord || node.word != null;
}`,time:`O(L) expected.`,space:`O(1) auxiliary.`,useWhen:`Set requireWord true for membership, false for prefix lookup.`},
      {name:`Trie-pruned board search`,layman:`As you walk neighboring squares, stop if the letters cannot begin a dictionary word.`,how:[`Insert dictionary words in a trie.`,`DFS from each board cell with the root as prefix state.`,`Follow matching trie child; stop if absent.`,`Record when the reached trie node is terminal.`,`Mark a cell used, explore neighbors, then restore it.`],code:`// Assumes TrieNode children map and String word; # is not a board character.
void searchBoard(char[][] board, int r, int c, TrieNode parent, java.util.Set<String> found) {
    char ch = board[r][c]; if (ch == '#') return;
    TrieNode node = parent.children.get(ch); if (node == null) return;
    if (node.word != null) found.add(node.word);
    board[r][c] = '#'; int[] dr={-1,1,0,0}, dc={0,0,-1,1};
    for (int d=0; d<4; d++) {
        int nr=r+dr[d], nc=c+dc[d];
        if (nr>=0 && nr<board.length && nc>=0 && nc<board[0].length) searchBoard(board,nr,nc,node,found);
    }
    board[r][c] = ch;
}`,time:`Worst O(R*C*4^L), usually cut by trie pruning.`,space:`O(L) path stack, excluding trie and results.`,useWhen:`Use when searching many dictionary words on one rectangular board.`}
    ],
    examples:[
      {title:`Insert and search a prefix`,problem:`Insert cat, then check word cat and prefix ca.`,input:`words=[cat]`,steps:[{title:`Begin`,detail:`Start before any characters.`,state:`node=root`},{title:`Add c`,detail:`Create or follow c link.`,state:`path=c`},{title:`Add a`,detail:`Follow a below c.`,state:`path=c-a`},{title:`Add t`,detail:`Mark final node terminal.`,state:`path=c-a-t, word=true`},{title:`Check cat`,detail:`Path exists and final node is terminal.`,state:`contains(cat)=true`},{title:`Check ca`,detail:`Prefix path exists without its own terminal marker.`,state:`startsWith(ca)=true`}],result:`Both queries succeed; only cat is marked as a full word.`},
      {title:`Prune impossible board path`,problem:`Search dictionary word cat on adjacent cells c-a-x.`,input:`board=[[c,a,x]], dictionary=[cat]`,steps:[{title:`Start c`,detail:`Trie has a c child.`,state:`path=c`},{title:`Move to a`,detail:`c has child a.`,state:`path=c-a`},{title:`Try x`,detail:`Only t follows c-a.`,state:`child(x)=null`},{title:`Prune`,detail:`No word begins c-a-x.`,state:`no deeper calls`},{title:`Finish`,detail:`No route spells cat.`,state:`found={}`}],result:`No dictionary word is found.`}
    ],
    pitfalls:[`Treating any prefix path as a complete word.`,`Leaving character normalization or alphabet undefined.`,`Failing to restore a board cell after recursion.`,`Choosing a temporary board marker that is a legal character.`,`Ignoring node memory and output cost in complexity.`],related:[`Hashmap`,`Backtracking`,`Graph General`]
  },
  {
    category:`Backtracking`,tagline:`Explore candidate choices recursively, undo each choice, and prune branches that cannot succeed.`,
    overview:[
      `Backtracking searches for combinations, arrangements, paths, or constraint solutions. At each decision, choose one candidate, explore the resulting partial solution, then undo it so another branch can reuse the state. The key invariant is that mutable state exactly represents the current path of choices.`,
      `A typical template checks whether the partial state is complete, iterates over legal choices, applies a choice, recurses, and removes it. Pruning rejects a partial state as soon as it cannot lead to a valid answer. Many such problems remain exponential in the worst case, but good pruning often reduces practical search.`,
      `Subsets, permutations, combinations, N-Queens, and grid word search are common. Combinations advance a starting index to avoid reordered duplicates; permutations track used elements. For duplicate values, sorting and skipping equal choices at the same recursion depth can avoid repeated outputs.`,
      `Runtime often equals the number of candidates generated times the work to copy each answer. Recursion depth is commonly O(n), plus output storage. Save a copy of the working path: later undo steps mutate it.`
    ],
    layman:{analogy:`Imagine trying outfits: pick one item, see whether the outfit can be completed, then put it back before trying another.`,plainEnglish:[`Make one legal choice at a time.`,`Save a copy when a full answer is ready.`,`Undo each choice so the next branch starts cleanly.`,`Stop early when a partial answer cannot work.`]},
    whenToUse:[`The prompt asks to list valid combinations, arrangements, or paths.`,`A solution is built through sequential choices under constraints.`,`You need any one valid arrangement among possibilities.`,`You can reject a partial candidate before completing it.`,`Input size permits exploring a search tree.`],
    keyIdeas:[{term:`Choice`,meaning:`A candidate action available in the current state.`},{term:`Partial state`,meaning:`Choices made so far, such as a path or selected subset.`},{term:`Base case`,meaning:`A complete answer or a state that cannot be extended.`},{term:`Undo`,meaning:`Restore state after a recursive call so a sibling can use it.`},{term:`Pruning`,meaning:`Reject a branch that cannot produce a valid answer.`},{term:`Duplicate avoidance`,meaning:`Rules preventing equivalent choices from generating repeated results.`}],
    algorithms:[
      {name:`Choose-explore-unchoose`,layman:`Try one option, investigate it fully, then restore state before the next option.`,how:[`Check whether current state is a complete answer.`,`If complete, append a copy of path.`,`Loop over legal choices.`,`Apply a choice and recurse with updated state.`,`Undo the choice before continuing.`],code:`void subsets(int n, int start, java.util.List<Integer> path, java.util.List<java.util.List<Integer>> out) {
    out.add(new java.util.ArrayList<>(path));
    for (int value=start; value<=n; value++) {
        path.add(value);
        subsets(n, value+1, path, out);
        path.remove(path.size()-1);
    }
}`,time:`O(n*2^n), including copies.`,space:`O(n) recursion and path, excluding output.`,useWhen:`This method generates all subsets of values 1 through n.`},
      {name:`Permutations with used markers`,layman:`Fill each position with one item not already used in this arrangement.`,how:[`If path holds all items, save its copy.`,`Try every unused input index.`,`Mark index used and append its value.`,`Recurse to fill the next position.`,`Remove value and clear used marker on return.`],code:`void permute(int[] nums, boolean[] used, java.util.List<Integer> path, java.util.List<java.util.List<Integer>> out) {
    if (path.size()==nums.length) { out.add(new java.util.ArrayList<>(path)); return; }
    for (int i=0; i<nums.length; i++) {
        if (used[i]) continue;
        used[i]=true; path.add(nums[i]);
        permute(nums, used, path, out);
        path.remove(path.size()-1); used[i]=false;
    }
}`,time:`O(n*n!) including result copying.`,space:`O(n) path, markers, and recursion, excluding output.`,useWhen:`Use when each input position appears once; add duplicate skipping if values repeat.`},
      {name:`Combination sum with pruning`,layman:`Choose numbers while tracking the remainder; stop when it becomes impossible.`,how:[`Save the path when remaining target is zero.`,`Stop if remaining target is negative.`,`Try candidates from the current start index.`,`Subtract chosen value and recurse from the same index when reuse is allowed.`,`Undo the path choice before continuing.`],code:`void combinationSum(int[] a, int start, int remain, java.util.List<Integer> path, java.util.List<java.util.List<Integer>> out) {
    if (remain==0) { out.add(new java.util.ArrayList<>(path)); return; }
    if (remain<0) return;
    for (int i=start; i<a.length; i++) {
        path.add(a[i]);
        combinationSum(a, i, remain-a[i], path, out);
        path.remove(path.size()-1);
    }
}`,time:`Exponential worst case; depends on target and positive candidate values.`,space:`O(target/minCandidate) recursion for positive candidates, excluding output.`,useWhen:`Use when candidates are positive and may be reused; sorting can enable stronger pruning.`}
    ],
    examples:[
      {title:`Generate subsets`,problem:`List all subsets of [1,2] by increasing choices.`,input:`nums=[1,2]`,steps:[{title:`Save empty path`,detail:`The current path is a valid subset.`,state:`path=[], out=[[]]`},{title:`Choose 1`,detail:`Recurse from next index.`,state:`path=[1]`},{title:`Save [1]`,detail:`Record it and choose 2.`,state:`out=[[],[1]], path=[1,2]`},{title:`Save [1,2]`,detail:`No values remain; undo 2.`,state:`out=[[],[1],[1,2]], path=[1]`},{title:`Choose root 2`,detail:`Undo 1 and take 2 at root.`,state:`path=[2]`},{title:`Finish`,detail:`Save [2], then undo.`,state:`out=[[],[1],[1,2],[2]], path=[]`}],result:`Subsets: [], [1], [1,2], [2].`},
      {title:`Build permutations`,problem:`Enumerate arrangements of distinct values A and B.`,input:`nums=[A,B]`,steps:[{title:`Start`,detail:`Neither input position is used.`,state:`path=[], used=[false,false]`},{title:`Choose A`,detail:`Mark index zero and fill next position.`,state:`path=[A], used=[true,false]`},{title:`Choose B`,detail:`The path now uses both inputs.`,state:`path=[A,B], used=[true,true]`},{title:`Save first`,detail:`Copy the complete path.`,state:`out=[[A,B]]`},{title:`Backtrack`,detail:`Remove B and A and clear their marks.`,state:`path=[], used=[false,false]`},{title:`Choose B then A`,detail:`The other first choice yields reverse order.`,state:`path=[B,A], out=[[A,B],[B,A]]`}],result:`Permutations are [A,B] and [B,A].`}
    ],
    pitfalls:[`Forgetting to undo every state change.`,`Appending the mutable path rather than a copy.`,`Using wrong start index, creating duplicates or missing reuse.`,`Failing to prune impossible partial states.`,`Ignoring duplicate values when unique outputs are required.`],related:[`Trie`,`Graph General`,`Divide & Conquer`]
  },
  {
    category:`Divide & Conquer`,tagline:`Split a problem into independent smaller parts, solve them, and combine their answers.`,
    overview:[
      `Divide and conquer divides a problem into smaller instances of the same kind, solves those instances recursively, then combines their answers. It is effective when subproblems are independent and combining them is manageable. Binary search, merge sort, and tree algorithms are familiar examples.`,
      `A recurrence describes work, often as T(n)=aT(n/b)+f(n), where a is the number of subproblems, n/b their approximate size, and f(n) division and merge work. The Master Theorem can estimate complexity if the recurrence accurately represents the algorithm.`,
      `Unlike dynamic programming, divide and conquer usually does not reuse overlapping subproblem results. If the same states repeat, memoization may help. The decomposition must progress toward a base case and preserve enough information for the combine step.`,
      `Merge sort is O(n log n) with O(n) temporary storage; iterative binary search is O(log n) time and O(1) extra space. Recursive methods also consume stack space. A correctness argument shows the parts cover the input and the combination yields a whole-problem answer.`
    ],
    layman:{analogy:`Sort a huge pile of papers by splitting into small piles, sorting each, then merging the sorted piles.`,plainEnglish:[`Break the large task into smaller tasks of the same kind.`,`Stop splitting when a small task can be answered directly.`,`Solve each piece and combine its answer with the rest.`,`If smaller tasks repeat, consider storing answers instead.`]},
    whenToUse:[`The problem splits into smaller instances with similar structure.`,`Subproblems are independent or combine cleanly.`,`The input is sorted or can be divided around a midpoint.`,`A whole answer can be built from a few child answers.`,`The task asks for sorting, selection, or recursive range processing.`],
    keyIdeas:[{term:`Divide`,meaning:`Split the original instance into smaller instances.`},{term:`Conquer`,meaning:`Solve each smaller instance, often recursively.`},{term:`Combine`,meaning:`Assemble subproblem answers into the whole answer.`},{term:`Base case`,meaning:`Small instance solved directly to stop recursion.`},{term:`Recurrence`,meaning:`Equation describing work as a function of input size.`},{term:`Overlapping subproblems`,meaning:`Repeated smaller states that may favor dynamic programming.`},{term:`Merge`,meaning:`Combine sorted arrays while preserving order.`}],
    algorithms:[
      {name:`Merge sort`,layman:`Sort small piles, then pick the smaller front item while combining two sorted piles.`,how:[`Return for fewer than two elements.`,`Split range into halves.`,`Recursively sort each half.`,`Merge by taking the smaller front value.`,`Copy any remaining values.`],code:`void mergeSort(int[] a) {
    if (a.length<2) return;
    int mid=a.length/2;
    int[] left=java.util.Arrays.copyOfRange(a,0,mid);
    int[] right=java.util.Arrays.copyOfRange(a,mid,a.length);
    mergeSort(left); mergeSort(right);
    int i=0,j=0,k=0;
    while (i<left.length && j<right.length) a[k++]=left[i]<=right[j]?left[i++]:right[j++];
    while (i<left.length) a[k++]=left[i++];
    while (j<right.length) a[k++]=right[j++];
}`,time:`O(n log n).`,space:`O(n) temporary arrays and O(log n) recursion.`,useWhen:`Use for predictable worst-case sorting time and stable merging.`},
      {name:`Binary search`,layman:`Keep halving a sorted range according to which side could contain the answer.`,how:[`Set inclusive left and right bounds.`,`Compute midpoint without overflow.`,`Return if midpoint matches target.`,`Discard the half that cannot contain it.`,`Return -1 when range is empty.`],code:`int binarySearch(int[] a, int target) {
    int left=0, right=a.length-1;
    while (left<=right) {
        int mid=left+(right-left)/2;
        if (a[mid]==target) return mid;
        if (a[mid]<target) left=mid+1; else right=mid-1;
    }
    return -1;
}`,time:`O(log n).`,space:`O(1) iterative.`,useWhen:`Use on sorted values or a monotonic predicate with clear boundaries.`},
      {name:`Maximum subarray by divide and conquer`,layman:`The best run is wholly left, wholly right, or crosses the split.`,how:[`A one-element range returns that value.`,`Split the range in half.`,`Recursively find best result in each half.`,`Scan outward from the split for best crossing sum.`,`Return the maximum of all three candidates.`],code:`int maxSubArray(int[] a) { return maxSubArray(a,0,a.length-1); }
int maxSubArray(int[] a, int lo, int hi) {
    if (lo==hi) return a[lo];
    int mid=lo+(hi-lo)/2;
    int left=maxSubArray(a,lo,mid), right=maxSubArray(a,mid+1,hi);
    int sum=0, lc=Integer.MIN_VALUE;
    for (int i=mid;i>=lo;i--) { sum+=a[i]; lc=Math.max(lc,sum); }
    sum=0; int rc=Integer.MIN_VALUE;
    for (int i=mid+1;i<=hi;i++) { sum+=a[i]; rc=Math.max(rc,sum); }
    return Math.max(Math.max(left,right),lc+rc);
}`,time:`O(n log n).`,space:`O(log n) call stack.`,useWhen:`Use for a nonempty array; Kadane's algorithm is usually faster at O(n).`}
    ],
    examples:[
      {title:`Merge sorted halves`,problem:`Sort [4,1,3,2] by splitting it into [4,1] and [3,2].`,input:`a=[4,1,3,2]`,steps:[{title:`Split array`,detail:`Divide into ranges of length two.`,state:`left=[4,1], right=[3,2]`},{title:`Split left`,detail:`Single elements are sorted.`,state:`[4] and [1]`},{title:`Merge left`,detail:`Take 1 before 4.`,state:`leftSorted=[1,4]`},{title:`Merge right`,detail:`Sort [3] and [2].`,state:`rightSorted=[2,3]`},{title:`Merge full`,detail:`Take 1, then 2, 3, and 4.`,state:`output=[1,2,3,4]`}],result:`Sorted array is [1,2,3,4].`},
      {title:`Binary search by halving`,problem:`Find 7 in sorted [1,3,5,7,9].`,input:`a=[1,3,5,7,9], target=7`,steps:[{title:`Initial range`,detail:`Search indices zero through four.`,state:`left=0, right=4`},{title:`Check middle`,detail:`Index 2 has 5, below target.`,state:`mid=2, left=3, right=4`},{title:`Check new middle`,detail:`Index 3 holds 7.`,state:`mid=3`},{title:`Stop`,detail:`The matching index is found.`,state:`result=3`},{title:`Return`,detail:`No range remains to inspect.`,state:`done`}],result:`Target 7 is at index 3.`}
    ],
    pitfalls:[`No base case or recursive call that fails to shrink input.`,`Leaving out or duplicating an element at a split boundary.`,`Forgetting remaining elements during merge.`,`Applying binary search without sorted or monotonic structure.`,`Recomputing overlapping states that should be memoized.`],related:[`Binary Tree General`,`Backtracking`,`1D DP`]
  }
];

