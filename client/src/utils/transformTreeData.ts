import type { TreeNode } from '@/models/model';

export function buildTreeData(
  data: { name: string; parent: string; description: string }[],
): TreeNode {
  const root: TreeNode = { name: 'root', children: [] };
  const nodes: { [key: string]: TreeNode } = {};
  data.forEach((item) => {
    const node = {
      name: item.name,
      description: item.description,
      children: [],
    };
    nodes[item.name] = node;
    if (item.parent === '') {
      root.children!.push(node);
    } else {
      const parent = nodes[item.parent];
      parent.children = parent.children || [];
      parent.children.push(node);
    }
  });
  return root.children![0];
}
