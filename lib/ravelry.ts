export class RavelryError extends Error {
  constructor(public readonly status: number, statusText: string) {
    super(`Ravelry API error: ${status} ${statusText}`);
  }
}

export interface RavelryYarn {
  id: number;
  name: string;
  yarn_company_name: string;
  yarn_weight: {
    name: string;
  } | null;
  gauge_divisor: number | null;
  min_gauge: number | null;
  max_gauge: number | null;
  min_needle_size: number | null;
  max_needle_size: number | null;
}

const RAVELRY_BASE = "https://api.ravelry.com";

export async function ravelryFetch(
  path: string,
  params?: Record<string, string>
): Promise<unknown> {
  const username = process.env.RAVELRY_USERNAME;
  const password = process.env.RAVELRY_PASSWORD;

  if (!username || !password) {
    throw new Error("Ravelry credentials not configured");
  }

  const url = new URL(`${RAVELRY_BASE}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const credentials = Buffer.from(`${username}:${password}`).toString(
    "base64"
  );

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new RavelryError(response.status, response.statusText);
  }

  return response.json();
}
