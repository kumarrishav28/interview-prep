import { categorySlug } from '../../theorySlug';
import { theoryA } from './theoryA';
import { theoryB } from './theoryB';
import { theoryC } from './theoryC';
import type { TheoryTopic } from './types';

const order = [
  'Array / String',
  'Two Pointers',
  'Sliding Window',
  'Matrix',
  'Hashmap',
  'Intervals',
  'Stack',
  'Linked List',
  'Binary Tree General',
  'Binary Tree BFS',
  'Binary Search Tree',
  'Graph General',
  'Graph BFS',
  'Trie',
  'Backtracking',
  'Divide & Conquer',
  "Kadane's Algorithm",
  'Binary Search',
  'Heap',
  'Bit Manipulation',
  'Math',
  '1D DP',
  'Multidimensional DP',
];

const all = [...theoryA, ...theoryB, ...theoryC];

export const theoryTopics: TheoryTopic[] = order
  .map((category) => all.find((topic) => topic.category === category))
  .filter((topic): topic is TheoryTopic => Boolean(topic));

export const theorySlugs = theoryTopics.map((topic) => categorySlug(topic.category));
