import { defineStore } from 'pinia';
import { APIGet } from '../api';
import { APIResult } from '../types/api-result';
import { RecordData } from '../types/record-data';

const initialFilterState = {
  selectedYears: [] as number[],
  selectedGenres: [] as string[],
  selectedFormats: [] as string[],
  selectedCountries: [] as string[],
};

//initial state is hndig voor resetten van state, als het ooit nodig is
const initialState = {
  records: {} as Record<number, RecordData[]>,
  loading: false,
  years: [] as number[],
  genres: [] as string[],
  formats: [] as string[],
  countries: [] as string[],
  ...initialFilterState
}

export const useDiscogsStore = defineStore('discogs', {
  state: () => ({
    ...initialState
  }),
  
  getters: {
    uniqueRecords: (state) => {
      return Object.values(state.records)
        .map(group => group[0])
        .filter(record => {
					//return items die matchen met het filter
          const yearMatch = state.selectedYears.length === 0 || (record.year && state.selectedYears.includes(record.year));
          const genreMatch = state.selectedGenres.length === 0 || (record.genre && record.genre.some(g => state.selectedGenres.includes(g)));
          const formatMatch = state.selectedFormats.length === 0 || (record.format && record.format.some(f => state.selectedFormats.includes(f)));
          const countryMatch = state.selectedCountries.length === 0 || (record.country && state.selectedCountries.includes(record.country));
          
          return yearMatch && genreMatch && formatMatch && countryMatch;
        });
    },
    
    groupedVariants: (state) => (masterId: number) => {
      const variants = state.records[masterId] || [];
      const groups: Record<string, RecordData[]> = {};
      
      variants.forEach(variant => {
        const year = variant.year?.toString() ?? 'Unknown';
        if (!groups[year]) groups[year] = [];
        groups[year].push(variant);
      });
      //voor de volgorde van het juiste jaar van releases
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }
  },
  
  actions: {
    async searchRecords(query: string): Promise<APIResult> {
			this.clearFilters()
      this.loading = true;

      const { statusCode, data } = await APIGet(`/database/search?q=${query}`);
      
      if (statusCode === 200 && data) {
        const allRecords = data.results as RecordData[];
        this.records = this.groupRecordsByMasterId(allRecords);
        this.updateFilterOptions(allRecords);
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
    },
		updateFilterOptions(records: RecordData[]) {
			const years: number[] = [];
			const genres: string[] = [];
			const formats: string[] = [];
			const countries: string[] = [];
		
			records.forEach(record => {
				if (record.year && !years.includes(record.year)) {
					years.push(record.year);
				}
				
				record.genre?.forEach(genre => {
					if (!genres.includes(genre)) {
						genres.push(genre);
					}
				});
				
				record.format?.forEach(format => {
					if (!formats.includes(format)) {
						formats.push(format);
					}
				});
				
				if (record.country && !countries.includes(record.country)) {
					countries.push(record.country);
				}
			});
		
			this.years = years.sort((a, b) => a - b);
			this.genres = genres.sort();
			this.formats = formats.sort();
			this.countries = countries.sort();
		},

    clearFilters() {
      Object.assign(this, initialFilterState);
    },
  },
});