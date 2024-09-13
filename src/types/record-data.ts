export interface RecordData {
  barcode: string[];
  community: {
    have: number;
		want: number;
  };
	country: string;
  format: string[];
  genre: string[];
  id: number;
  label: string[];
  master_id: number;
  master_url: string;
  resource_url: string;
  style: string[];
  thumb: string;
  title: string;
  type: string;
  uri: string;
  user_data: {
		in_collection: boolean;
		in_wantlist: boolean
  };
  catno: string;
  cover_image: string;
	year: number;
}