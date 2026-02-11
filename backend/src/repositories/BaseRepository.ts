/**
 * BaseRepository — Abstract base class for all repositories.
 *
 * Demonstrates the Inheritance OOP principle: every concrete repository
 * extends this class and inherits the `assertId` utility while
 * fulfilling the abstract data-access contracts.
 *
 * Design Pattern: Template Method — subclasses provide entity-specific
 * implementations of findById, findAll, and create. Shared utilities
 * (like assertId) are inherited and available to all repositories
 * without duplication.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseRepository<T = any, CreateInput = any> {
  /**
   * Find a single record by its primary key.
   * Returns null when no record matches.
   */
  abstract findById(id: string): Promise<T | null>;

  /**
   * Return all records. Concrete implementations may accept an
   * optional filters parameter (method overload in subclass).
   */
  abstract findAll(filters?: Record<string, unknown>): Promise<T[]>;

  /**
   * Persist a new record and return the created entity.
   */
  abstract create(data: CreateInput): Promise<T>;

  /**
   * Shared utility: validate that an ID string is non-empty.
   * Available to every repository via inheritance — no duplication.
   */
  protected assertId(id: string, entity: string): void {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error(`Invalid ${entity} ID: "${id}"`);
    }
  }
}
