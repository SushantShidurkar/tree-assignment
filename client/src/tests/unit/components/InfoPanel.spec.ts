import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue';
import type { TreeNode } from '@/models/model';

describe('InfoPanel', () => {
  it('renders with selected node data', () => {
    const selectedNodeData: TreeNode = {
      name: 'Node 1',
      description: 'first node',
    };

    const wrapper = mount(InfoPanel, {
      props: {
        selectedNodeData,
      },
    });

    expect(wrapper.find('.panel-title').text()).toBe('Node 1');
    expect(wrapper.find('.panel-description').text()).toBe('first node');
  });

  it('renders default state when no node is selected', () => {
    const wrapper = mount(InfoPanel, {
      props: {
        selectedNodeData: null,
      },
    });

    expect(wrapper.find('.panel-title').text()).toBe('Please select a Node');
    expect(wrapper.find('.panel-description').text()).toBe('No node selected.');
  });

  it('emits closePanel event when close button is clicked', async () => {
    const wrapper = mount(InfoPanel, {
      props: {
        selectedNodeData: null,
      },
    });

    const closeButton = wrapper.find('.close-btn');
    await closeButton.trigger('click');

    expect(wrapper.emitted('closePanel')).toBeTruthy();
  });
});
