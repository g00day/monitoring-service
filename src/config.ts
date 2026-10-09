const timeout = Number(import.meta.env.VITE_ONLINE_TIMEOUT_SECONDS ?? 180);
export const onlineTimeoutSeconds = Number.isFinite(timeout) && timeout >= 10 ? timeout : 180;
