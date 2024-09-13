import axios from 'axios';
import { Nullable } from './types/basic-types';

const url = 'https://api.discogs.com';
//token komt uit env bestand zodat het dynamisch is
const token = import.meta.env.VITE_DISCOGS_API_TOKEN;

export async function APIGet(endpoint: string): Promise<{ statusCode: number; data?: Nullable<any> }> {
  try {
    const response = await axios.get(`${url}${endpoint}`, {
      params: {
        token: token,
      },
    });

    return {
      statusCode: response.status,
      data: response.data,
    };
  } catch (error: any) {
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