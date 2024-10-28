import { describe, it, expect } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { fetchData, apiClient } from '@/services/api';
import { mockData } from '@/tests/mocks/mockData';

const mock = new MockAdapter(apiClient);

describe('fetchData', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should return data on successful API call', async () => {
    mock.onGet('/api/data/testDataset').reply(200, { data: mockData });

    const result: any = await fetchData('testDataset');
    expect(result.data).toEqual(mockData);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe('/api/data/testDataset');
  });

  it('should throw an error if the API call fails', async () => {
    const errorMessage = 'Network Error';

    mock.onGet('/api/data/testDataset').reply(500, { message: errorMessage });

    await expect(fetchData('testDataset')).rejects.toThrow(
      `Error fetching data: ${errorMessage}`,
    );
  });

  it('should throw an unexpected error if not an Axios error', async () => {
    mock.onGet('/api/data/testDataset').reply(() => {
      throw new Error('This is an unexpected error');
    });

    await expect(fetchData('testDataset')).rejects.toThrow(
      'Unexpected error: This is an unexpected error',
    );
  });

  it('should throw an error with a custom message if response contains a message', async () => {
    const customErrorMessage = 'Custom error from server';

    mock
      .onGet('/api/data/testDataset')
      .reply(500, { message: customErrorMessage });

    await expect(fetchData('testDataset')).rejects.toThrow(
      `Error fetching data: ${customErrorMessage}`,
    );
  });
});
