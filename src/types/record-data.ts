export interface RecordData {
  country: string;
  year: number;
  format: string[];
  label: string[];
  type: string;
  genre: string[];
  style: string[];
  id: number;
  barcode: string[];
  user_data: {
    master_id: number;
    master_url: string;
    uri: string;
    catno: string;
    title: string;
    thumb: string;
    cover_image: string;
    resource_url: string;
  };
  community: {
    have: number;
    want: number;
  };
}