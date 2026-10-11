export function getSortRank(str: string): number {
  const trimmed = str.trim();
  if (!trimmed) return 3;
  const firstChar = trimmed[0];
  if (/[a-zA-Z]/i.test(firstChar)) {
    return 1; // Letters first
  }
  if (/[0-9]/.test(firstChar)) {
    return 2; // Numbers second
  }
  return 3; // Symbols / special characters last
}

export function customAlphabeticalSort(a: string, b: string): number {
  const rankA = getSortRank(a);
  const rankB = getSortRank(b);

  if (rankA !== rankB) {
    return rankA - rankB;
  }

  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}
