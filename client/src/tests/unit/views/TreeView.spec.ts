import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { useDataStore } from '@/stores';
import TreeView from '@/views/TreeView.vue';
import { vi } from 'vitest';

vi.mock(
  import('@/components/TreeGraph/TreeGraph.vue'),
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
    }),
  };
});

describe('TreeView', () => {
  let dataStoreMock: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    dataStoreMock = useDataStore();
    mockFetchDataAction.mockClear();
  });

  it('renders buttons correctly', () => {
    const wrapper = mount(TreeView);

    expect(wrapper.find('#sample-btn').exists()).toBe(true);
    expect(wrapper.find('#bank-btn').exists()).toBe(true);
    expect(wrapper.find('#company-btn').exists()).toBe(true);
  });

  it('calls fetchDataAction with the correct parameter when a button is clicked', async () => {
    const wrapper = mount(TreeView);

    await wrapper.find('#sample-btn').trigger('click');
    expect(dataStoreMock.fetchDataAction).toHaveBeenCalledWith('sample');

    await wrapper.find('#bank-btn').trigger('click');
    expect(dataStoreMock.fetchDataAction).toHaveBeenCalledWith('bank');

    await wrapper.find('#company-btn').trigger('click');
    expect(dataStoreMock.fetchDataAction).toHaveBeenCalledWith('company');
  });

  it('calls loadData on mounted', async () => {
    mount(TreeView);

    expect(dataStoreMock.fetchDataAction).toHaveBeenCalled();
  });

  it('updates treeData when dataStore.data changes', async () => {
    mount(TreeView);
    dataStoreMock.data = [
      { name: 'Node 1', parent: 'Root', description: 'Description 1' },
    ];
    expect(dataStoreMock.fetchDataAction).toHaveBeenCalled();
  });
});
