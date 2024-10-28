<template>
  <header>
    <div class="wrapper">
      <div class="button-container">
        <button @click="updateValue('sample')" id="sample-btn">
          Sample Data
        </button>
        <button @click="updateValue('bank')" id="bank-btn">Bank Data</button>
        <button @click="updateValue('company')" id="company-btn">
          Company Data
        </button>
      </div>
      <TreeGraph :data="treeData" :linkType="randomLinkType" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useDataStore } from '@/stores';
import TreeGraph from '../components/TreeGraph/TreeGraph.vue';
import { buildTreeData } from '@/utils/transformTreeData';
import type { TreeNode } from '@/utils/d3tree';

const defaultTreeNode: TreeNode = {
  name: 'A',
  children: [],
};

const dataStore = useDataStore();
const treeData = ref<TreeNode>(defaultTreeNode);
const linkTypes = ['line', 'path'] as const;
const randomLinkType = ref<'line' | 'path'>(linkTypes[0]);

const loadData = async () => {
  try {
    await dataStore.fetchDataAction();
  } catch (error) {
    console.error('Error loading tree data:', error);
  }
};

watch(
  () => dataStore.data,
  (newData) => {
    if (newData) {
      treeData.value = buildTreeData(newData);
      randomLinkType.value =
        linkTypes[Math.floor(Math.random() * linkTypes.length)];
    }
  },
);

const updateValue = (param: string) => {
  dataStore.fetchDataAction(param);
};

onMounted(loadData);
</script>

<style scoped>
.button-container {
  margin-top: 20px;
}

.button-container button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #2b866a;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-container button:hover {
  background-color: #0056b3;
}
</style>
