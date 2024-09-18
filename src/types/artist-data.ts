import { Nullable } from "./basic-types";

export interface ArtistData {
  id: number;
	year: number;
	master_id: Nullable<number>;
	master_url: Nullable<string>;
  type: 'artist';
  title: string;
  resource_url: string;
  uri: string;
  thumb: string;
  cover_image: string;
	user_data: {
		in_collection: boolean;
		in_wantlist: boolean
  };
}