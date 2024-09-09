import axios from 'axios';
import { Nullable } from './types/basic-types';

const url = 'https://api.discogs.com';

export async function APIGet(endpoint: string): Promise<{ statusCode: number; data?: Nullable<any> }> {
  try {
    const response = await axios.get(`${url}${endpoint}`, {
      params: {
        token: 'token_here',
      },
    });

    return {
      statusCode: response.status,
      data: response.data,
    };
  } catch (error:any) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        statusCode: error.response.status,
      };
    } else {
      return {
        statusCode: 500,
      };
    }
  }
}
