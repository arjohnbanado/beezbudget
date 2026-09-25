export interface ProblemDetails {
  /**
   * URI identifying the type of problem.
   */
  type: string;

  /**
   * Short, human-readable summary.
   */
  title: string;

  /**
   * HTTP status code.
   */
  status: number;

  /**
   * Human-readable explanation specific
   * to this occurrence.
   */
  detail: string;

  /**
   * URI reference identifying this
   * particular occurrence.
   */
  instance: string;

  /**
   * BeezBudget-specific machine-readable
   * error code.
   */
  code: string;

  /**
   * Time the error response was generated.
   */
  timestamp: string;

  /**
   * Problem-specific extension members.
   */
  [key: string]: unknown;
}
