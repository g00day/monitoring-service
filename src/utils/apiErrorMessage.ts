export function apiErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "detail" in error) {
    if (typeof error.detail === "string") return error.detail;
    if (Array.isArray(error.detail)) {
      return error.detail.map((item) => item.msg).join("; ");
    }
  }
  return error instanceof Error ? error.message : "Не удалось выполнить запрос";
}
