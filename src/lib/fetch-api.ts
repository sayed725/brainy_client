type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

export const fetchApi = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> => {
  const { params, headers: customHeaders, ...restOptions } = options;

  // Determine base URL
  const isServer = typeof window === "undefined";
  // using process.env directly as requested
  const baseUrl = isServer ? (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL) : "";

  // Append query parameters
  let fullPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (params) {
    // Use a dummy base URL on the client (where baseUrl is "") because
    // new URL() requires an absolute base when the path is relative.
    // This is only used to build the query string — the actual request
    // still uses a relative path on the client.
    const safeBase = baseUrl || "http://localhost";
    const searchParams = new URL(fullPath, safeBase).searchParams;
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullPath = `${fullPath.split("?")[0]}?${queryString}`;
    }
  }

  const url = isServer ? `${baseUrl}${fullPath}` : fullPath;

  // Merge headers
  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");
  if (restOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Handle server-side cookie forwarding
  if (isServer) {
    const { headers: nextHeaders } = await import("next/headers");
    const cookie = (await nextHeaders()).get("cookie");
    if (cookie) {
      headers.set("Cookie", cookie);
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
    // credentials: "include" is default behavior for same-origin fetch (client rewrites)
    // and is not applicable for manual server-to-server fetch (where we forward the Cookie header)
    ...(isServer ? {} : { credentials: "include" }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error(`API Error [${response.status}]:`, errorBody);
    throw new Error(
      errorBody.message || `API Request failed: ${response.statusText}`,
    );
  }

  return response.json();
};
