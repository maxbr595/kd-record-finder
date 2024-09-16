import { defineStore } from 'pinia';
import { APIGet } from '../api';
import { APIResult } from '../types/api-result';
import { RecordData } from '../types/record-data';
//initial state is hndig voor resetten van state, als het ooit nodig is
const initialState = {
	records: {} as Record<number, RecordData[]>,
  loading: false,
}

export const useDiscogsStore = defineStore('discogs', {
  state: () => ({
    ...initialState
  }),
  
  getters: {
    uniqueRecords: (state) => Object.values(state.records).map(group => group[0]),
    
    groupedVariants: (state) => (masterId: number) => {
      const variants = state.records[masterId] || [];
      const groups: Record<string, RecordData[]> = {};
      
      variants.forEach(variant => {
        const year = variant.year?.toString() ?? 'Unknown';
        if (!groups[year]) groups[year] = [];
        groups[year].push(variant);
      });
      
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }
  },
  
  actions: {
    async searchRecords(query:string): Promise<APIResult> {
      this.loading = true;
      const { statusCode, data } = await APIGet(`/database/search?q=${query}`);
      
      if (statusCode === 200 && data) {
        const allRecords = data.results as RecordData[];
        this.records = this.groupRecordsByMasterId(allRecords);
        this.loading = false;
        return Promise.resolve({ success: true, message: 'Records ophalen gelukt' });
      }
      
      this.loading = false;
      return Promise.resolve({ success: false, message: 'Records ophalen mislukt' });
    },
    
    groupRecordsByMasterId(records: RecordData[]) {
			const grouped: Record<number, RecordData[]> = {};
		
			for (const record of records) {
				const masterId = record.master_id || record.id;
		
				if (!grouped[masterId]) {
					grouped[masterId] = [];
				}
				grouped[masterId].push(record);
			}
			return grouped;
		}
  },
});