import { NextRequest } from "next/server";

function ensureTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}

export function getBackendBaseUrl() {
  const base =
    process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
  if (!base) {
    throw new Error(
      "BACKEND_API_URL or NEXT_PUBLIC_BACKEND_API_URL is not configured"
    );
  }
  return ensureTrailingSlash(base);
}

export function backendUrl(path: string) {
  const normalized = path.replace(/^\//, "");
  return `${getBackendBaseUrl()}${normalized}`;
}

export function getAuthToken(req: NextRequest) {
  return req.cookies.get("token")?.value;
}

export function authHeaders(token?: string, extra: HeadersInit = {}) {
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export function normalizePaginatedResponse(payload: unknown) {
  const body = (payload ?? {}) as {
    message?: string;
    data?:
      | {
          items?: unknown[];
          meta?: Partial<PaginationMeta>;
        }
      | unknown[];
    items?: unknown[];
    meta?: Partial<PaginationMeta>;
  };

  const nested = body.data;
  const items = Array.isArray((nested as { items?: unknown[] })?.items)
    ? ((nested as { items: unknown[] }).items)
    : Array.isArray(nested)
      ? nested
      : Array.isArray(body.items)
        ? body.items
        : Array.isArray(body.data)
          ? body.data
          : [];

  const metaSource =
    (!Array.isArray(nested) && nested?.meta) || body.meta || {};

  const meta: PaginationMeta = {
    current_page: Number(metaSource.current_page ?? 1),
    last_page: Number(metaSource.last_page ?? 1),
    per_page: Number(metaSource.per_page ?? items.length ?? 10),
    total: Number(metaSource.total ?? items.length ?? 0),
  };

  return {
    message: body.message ?? "Success",
    data: items,
    meta,
  };
}

export function buildQuery(params: Record<string, string | number | null | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
