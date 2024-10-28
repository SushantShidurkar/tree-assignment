export interface TreeConfig {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

export interface TreeNode {
  name: string;
  description?: string;
  children?: TreeNode[];
}

export interface TreeData {
  data: TreeNode[];
}

export interface DataItem {
  name: string;
  description: string;
  parent: string;
}
