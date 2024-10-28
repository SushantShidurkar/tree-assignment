import { describe, it, expect } from 'vitest';
import { buildTreeData } from '@/utils/transformTreeData';
import type { TreeNode } from '@/models/model';

describe('buildTreeData', () => {
  it('should build a tree structure from flat data', () => {
    const data = [
      { name: 'A', parent: '', description: 'Root node' },
      { name: 'B', parent: 'A', description: 'Child of A' },
      { name: 'C', parent: 'A', description: 'Child of A' },
      { name: 'D', parent: 'B', description: 'Child of B' },
    ];

    const expected: TreeNode = {
      name: 'A',
      description: 'Root node',
      children: [
        {
          name: 'B',
          description: 'Child of A',
          children: [
            {
              name: 'D',
              description: 'Child of B',
              children: [],
            },
          ],
        },
        {
          name: 'C',
          description: 'Child of A',
          children: [],
        },
      ],
    };

    const result = buildTreeData(data);
    expect(result).toEqual(expected);
  });

  it('should return undefined if there are no nodes', () => {
    const data: { name: string; parent: string; description: string }[] = [];
    const result = buildTreeData(data);
    expect(result).toBeUndefined();
  });

  it('should handle a single node', () => {
    const data = [{ name: 'A', parent: '', description: 'Single root node' }];

    const expected: TreeNode = {
      name: 'A',
      description: 'Single root node',
      children: [],
    };

    const result = buildTreeData(data);
    expect(result).toEqual(expected);
  });

  it('should handle nodes with missing parents', () => {
    const data = [
      { name: 'A', parent: '', description: 'Root node' },
      { name: 'B', parent: 'A', description: 'Child of A' },
      { name: 'C', parent: '', description: 'Isolated node' },
    ];

    const expected: TreeNode = {
      name: 'A',
      description: 'Root node',
      children: [
        {
          name: 'B',
          description: 'Child of A',
          children: [],
        },
      ],
    };

    const result = buildTreeData(data);
    expect(result).toEqual(expected);
  });
  it('should correctly add children to a parent that already has children', () => {
    const data = [
      { name: 'A', parent: '', description: 'Root node' },
      { name: 'B', parent: 'A', description: 'First child of A' },
      { name: 'C', parent: 'A', description: 'Second child of A' },
      { name: 'D', parent: 'B', description: 'Child of B' },
      { name: 'E', parent: 'A', description: 'Third child of A' },
    ];

    const expected: TreeNode = {
      name: 'A',
      description: 'Root node',
      children: [
        {
          name: 'B',
          description: 'First child of A',
          children: [
            {
              name: 'D',
              description: 'Child of B',
              children: [],
            },
          ],
        },
        {
          name: 'C',
          description: 'Second child of A',
          children: [],
        },
        {
          name: 'E',
          description: 'Third child of A',
          children: [],
        },
      ],
    };

    const result = buildTreeData(data);
    expect(result).toEqual(expected);
  });
});
