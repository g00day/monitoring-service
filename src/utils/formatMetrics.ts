export function formatMemory(used: number | null | undefined, total: number | null | undefined): string {
  if (used == null || total == null) return "—";
  return `${(used / 1024 ** 3).toFixed(1)} / ${(total / 1024 ** 3).toFixed(1)} ГиБ`;
}
