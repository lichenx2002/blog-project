import { Identifiable } from './common';

export interface Tag extends Identifiable {
  id: number;
  name: string;
  slug: string;
  color: string;
  count?: number;
}
