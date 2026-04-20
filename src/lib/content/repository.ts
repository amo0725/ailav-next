import type { Content } from './types';

export interface ContentRepository {
  read(): Promise<Content>;
  write(content: Content): Promise<void>;
}
