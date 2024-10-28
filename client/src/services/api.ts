import axios, { AxiosError } from 'axios';
const API_BASE_URL = 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchData = async <TreeData>(
  dataSet: string,
): Promise<TreeData> => {
  try {
    const response = await apiClient.get<TreeData>(`/api/data/${dataSet}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      throw new Error(`Error fetching data: ${errorMessage}`);
    } else {
      throw new Error(`Unexpected error: ${(error as Error).message}`);
    }
  }
};
