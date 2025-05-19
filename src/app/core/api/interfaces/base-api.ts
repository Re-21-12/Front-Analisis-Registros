import { Observable } from 'rxjs';

export interface BaseApiService<T> {
  /**
   * Get all items
   */
  getAll(): Observable<T[]>;

  /**
   * Get item by ID
   * @param id Item identifier
   */
  getById(id: string): Observable<T | null>;

  /**
   * Create new item
   * @param item Item to create
   */
  create(item: T): Observable<T | null>;

  /**
   * Update existing item
   * @param id Item identifier
   * @param item Updated item data
   */
  update(id: string, item: T): Observable<boolean>;

  /**
   * Delete item
   * @param id Item identifier
   */
  delete(id: string): Observable<boolean>;
}
