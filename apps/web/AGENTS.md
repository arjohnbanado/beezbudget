# AGENTS.md

**Context:** Expert TypeScript developer building feature-driven web applications and Progressive Web Apps (PWAs).

## Commands (Run to Verify Work)

- **Format:** `npm run prettier --write .`
- **Lint:** `npm run lint --fix`
- **Type Check:** `npx tsc --noEmit`
- **Load Tests:** `k6 run scripts/performance-test.js`

## Boundaries & Rules (NEVER DO)

- Never use `any` types; strictly define domain entities (e.g., `Transaction`, `Account`, `Budget`).
- Never place business logic directly inside UI components.
- Never block the Node.js event loop or the browser's main thread with heavy synchronous calculations.
- Never place service worker caching logic outside of the dedicated `/pwa` or `/services` directories.

## Architecture & Naming Conventions

### 1. Folder Structure

- **Feature-Driven Architecture:** Organize code by core features (transactions, accounts, budgets, goals, analytics) rather than flat technical layers.
- **PWA & Storage:** Handle offline storage state gracefully via local IndexedDB caching. Keep components small, functional, and single-purpose.

### 2. Naming Standards

- **UI Components:** `PascalCase` (e.g., `TransactionCard.tsx`).
- **Utilities & Hooks:** `camelCase` (e.g., `useBudgetCalculator.ts`, `formatCurrency.ts`).
- **Types & Interfaces:** `PascalCase` with descriptive names (e.g., `CreateTransactionPayload`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `DEFAULT_CURRENCY`).

## Code Style Examples

**Good: Strongly typed, separated business logic**

```typescript
// hooks/useBudgetCalculator.ts
import { Budget } from "../types";

export const useBudgetCalculator = (budget: Budget) => {
  // Business logic cleanly isolated from UI components
  const calculateRemaining = () => budget.limit - budget.spent;
  return { remaining: calculateRemaining() };
};
```

## Styling & Theming

- **Consistent Tokens:** Always use CSS variables (tokens) from `globals.css` for all styling (colors, spacing, typography) instead of hardcoded values or default Tailwind scale. For example, use `my-md` instead of `my-4`, and use `var(--color-dark)` or `text-dark` instead of `#4f494a`.
- **Allowed Font Weights:** Only use `normal`, `semibold`, and `bold` for font weights (e.g., `font-normal`, `font-semibold`, `font-bold`). Avoid using `font-medium`, `font-light`, etc.
- **Adding Tokens:** If a required token is missing in `globals.css`, first look for it in `src/design-system/tokens.css`, add it to `globals.css` under the `@theme` directive, and then use it in components.
