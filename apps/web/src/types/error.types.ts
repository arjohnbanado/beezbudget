/**
 * Standardized structure for error responses returned by the BeezBudget backend.
 * Unifies AppError, HTTPError, and ValidationError models.
 */
export interface ApiErrorResponse {
  detail?: string;
  [key: string]: any;
}
