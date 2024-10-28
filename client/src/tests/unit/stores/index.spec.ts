import { setActivePinia, createPinia } from 'pinia';
import { useDataStore } from '@/stores/index';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '@/services/api';
import { mockData } from '@/tests/mocks/mockData';

const mock = new MockAdapter(apiClient);

describe('Data Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  afterEach(() => {
    mock.reset();
  });

  it('initializes with default state', () => {
    const store = useDataStore();
    expect(store.data).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.selectedNode).toBeNull();
  });

  it('fetches data and updates the state', async () => {
    const store = useDataStore();

    mock.onGet('/api/data/sample').reply(200, { data: mockData });

    await store.fetchDataAction('sample');
    // await nextTick();
    expect(store.loading).toBe(false);
    expect(store.data).toEqual(mockData);
    expect(store.error).toBeNull();
  });

  it('handles fetch errors gracefully', async () => {
    const store = useDataStore();
    const errorMessage = 'Failed to fetch data';

    mock.onGet('/api/data/sample').reply(500, { message: errorMessage });

    await store.fetchDataAction('sample');

    expect(store.loading).toBe(false);
    expect(store.data).toBeNull();
    expect(store.error).toBe('Error fetching data: Failed to fetch data');
  });

  it('sets and deselects a node correctly', () => {
    const store = useDataStore();
    const mockNode = {
      name: 'Node 1',
      parent: 'Root',
      description: 'Description 1',
    };

    store.setSelectedNode(mockNode);
    expect(store.selectedNode).toEqual(mockNode);

    store.deselectNode();
    expect(store.selectedNode).toBeNull();
  });
});
