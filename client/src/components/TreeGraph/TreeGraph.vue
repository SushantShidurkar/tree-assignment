<template>
  <div>
    <div ref="treeContainer" class="tree-container"></div>
    <div v-if="selectedNode">
      <InfoPanel
        :selectedNodeData="selectedNode"
        @closePanel="handleClosePanel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDataStore } from '@/stores';
import { createD3Tree } from '@/utils/d3tree';
import type { TreeNode, TreeConfig } from '@/models/model';
import InfoPanel from '../InfoPanel/InfoPanel.vue';

const props = defineProps<{
  data: TreeNode;
  linkType: 'line' | 'path';
}>();

const treeContainer = ref<HTMLDivElement | null>(null);
const selectedNode = ref<TreeNode | null>(null);
const dataStore = useDataStore();
let deSelectNode: () => void;

const config: TreeConfig = {
  width: 600,
  height: 400,
  margin: { top: 20, right: 90, bottom: 30, left: 90 },
};

const handleNodeClick = (nodeData: TreeNode) => {
  selectedNode.value = nodeData;
};

watch(
  () => props.data,
  (newData) => {
    if (treeContainer.value && newData) {
      const treeFunctions = createD3Tree(
        treeContainer.value,
        newData,
        config,
        props.linkType,
        handleNodeClick,
      );
      deSelectNode = treeFunctions.deSelectNode;
      handleClosePanel();
    }
  },
  { immediate: true },
);

const handleClosePanel = () => {
  if (deSelectNode) {
    deSelectNode();
  }
  selectedNode.value = null;
  dataStore.deselectNode();
};

defineExpose({ handleNodeClick, handleClosePanel });
</script>

<style scoped>
.tree-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>
