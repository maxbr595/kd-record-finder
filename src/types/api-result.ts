import { Nullable } from './basic-types';

export interface APIResult {
  success: boolean;
  message: Nullable<string>;
}