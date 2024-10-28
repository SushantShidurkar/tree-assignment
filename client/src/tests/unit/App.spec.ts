import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { useDataStore } from '@/stores';
import { describe, it, expect } from 'vitest';
import App from '@/App.vue';

// for error originating from App
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

describe('App Component', () => {
  let dataStoreMock: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    dataStoreMock = useDataStore();
  });
  it('renders the TreeView component', () => {
    const wrapper = mount(App);

    const treeView = wrapper.findComponent({ name: 'TreeView' });
    expect(treeView.exists()).toBe(true);
  });
});
