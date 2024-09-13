import { defineStore } from 'pinia';
import { APIGet } from '../api';
import { APIResult } from '../types/api-result';
import { RecordData } from '../types/record-data';

//initial state is hndig voor resetten van state, als het ooit nodig is
const initialState = {
	recordData: [] as RecordData[],
  loading: false,
}

export const useDiscogsStore = defineStore('discogs', {
  state: () => ({
    ...initialState
  }),
  actions: {
    async searchRecords(query: string): Promise<APIResult> {
      this.loading = true;

      const { statusCode, data } = await APIGet(`/database/search?q=${query}`);

      if (statusCode === 200 && data) {
        this.recordData = data.results as RecordData[];
        this.loading = false;
        return { success: true, message: 'Records ophalen succesvol' };
      } else {
        return { success: false, message: 'Records ophalen mislukt' };
      }
    },
  },
});