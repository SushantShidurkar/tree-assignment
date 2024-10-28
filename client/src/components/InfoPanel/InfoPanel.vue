<template>
  <div class="info-panel">
    <button @click="closePanel" class="close-btn">&times;</button>
    <h2 class="panel-title">{{ currentNodeData.name }}</h2>
    <p class="panel-description">{{ currentNodeData.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TreeNode } from '@/models/model';

const defaultSelectedNodeData: TreeNode = {
  name: 'Please select a Node',
  description: 'No node selected.',
};

const props = defineProps<{
  selectedNodeData: TreeNode | null;
}>();

const emit = defineEmits<{
  (e: 'closePanel'): void;
}>();

const closePanel = () => {
  emit('closePanel');
};

const currentNodeData = computed(() => {
  return props.selectedNodeData ?? defaultSelectedNodeData;
});
</script>

<style scoped>
.info-panel {
  height: auto;
  width: max-content;
  background: #fff;
  color: black;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  position: relative;
  padding: 10px;
  font-size: 20px;
}

.close-btn {
  position: absolute;
  background-color: #ff4757;
  right: 0;
  top: 0;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease;
}

.panel-title {
  font-size: 24px;
  margin: 0;
  color: #333;
}

.panel-description {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}
</style>
