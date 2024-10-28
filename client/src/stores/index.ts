import { defineStore } from 'pinia';
import { fetchData } from '../services/api';
import type { TreeData, TreeNode } from '@/models/model';

interface DataState {
  data: TreeNode[] | null;
  loading: boolean;
  error: string | null;
  selectedNode: TreeNode | null;
}
export const useDataStore = defineStore('data', {
  state: (): DataState => ({
    data: null,
    loading: false,
    error: null,
    selectedNode: null,
  }),

  actions: {
    async fetchDataAction(dataSet: string = 'sample') {
      this.loading = true;
      this.error = null;
      let responseData: TreeData;
      try {
        responseData = await fetchData(dataSet);
        this.data = responseData.data;
      } catch (err) {
        this.error = (err as Error).message;
      } finally {
        this.loading = false;
      }
    },

    setSelectedNode(node: TreeNode | null) {
      this.selectedNode = node;
    },

    deselectNode() {
      this.selectedNode = null;
    },
  },
});
