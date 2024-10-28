import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import TreeGraph from '@/components/TreeGraph/TreeGraph.vue';
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue';
import { createD3Tree } from '@/utils/d3tree';
import type { TreeNode } from '@/models/model';

vi.mock('@/utils/d3tree', () => {
  // Mocking SVGTextElement
  global.SVGTextElement = class {
    getBBox() {
      return { width: 100, height: 20 };
    }
  } as unknown as new () => SVGTextElement;

  return {
    createD3Tree: vi.fn(() => ({
      deSelectNode: vi.fn(),
    })),
  };
});

vi.mock(
  import('@/components/InfoPanel/InfoPanel.vue'),
  async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
    };
  },
);
const mockFetchDataAction = vi.fn();
vi.mock('@/stores', () => {
  return {
    useDataStore: () => ({
      data: null,
      loading: false,
      error: null,
      selectedNode: null,
      fetchDataAction: mockFetchDataAction,
      deselectNode: vi.fn(),
    }),
  };
});

describe('TreeGraph', () => {
  it('renders the tree container', () => {
    const data: TreeNode = {
      name: 'Root',
      description: 'This is the root node.',
    };
    const wrapper = mount(TreeGraph, {
      props: {
        data,
        linkType: 'line',
      },
    });

    expect(wrapper.find('.tree-container').exists()).toBe(true);
  });

  it('shows InfoPanel when a node is selected', async () => {
    const data: TreeNode = {
      name: 'Root',
      description: 'This is the root node.',
    };
    const wrapper = mount(TreeGraph, {
      props: {
        data,
        linkType: 'line',
      },
    });

    await wrapper.vm.handleNodeClick(data);
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(InfoPanel).exists()).toBe(true);
  });

  it('closes the InfoPanel and deselects the node', async () => {
    const data: TreeNode = {
      name: 'Root',
      description: 'This is the root node.',
    };
    const wrapper = mount(TreeGraph, {
      props: {
        data,
        linkType: 'line',
      },
    });

    await wrapper.vm.handleNodeClick(data);
    await wrapper.vm.$nextTick();

    await wrapper.vm.handleClosePanel();

    expect(wrapper.findComponent(InfoPanel).exists()).toBe(false);
  });

  it('reacts to prop data changes', async () => {
    const initialData: TreeNode = {
      name: 'Root',
      description: 'This is the root node.',
    };
    const newData: TreeNode = {
      name: 'New Root',
      description: 'This is the new root node.',
    };

    const wrapper = mount(TreeGraph, {
      props: {
        data: initialData,
        linkType: 'line',
      },
    });

    await wrapper.setProps({ data: newData });
    expect(createD3Tree).toHaveBeenCalledWith(
      expect.anything(),
      newData,
      expect.anything(),
      'line',
      expect.any(Function),
    );
  });
});
