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

if (!process.env.RAVELRY_USERNAME || !process.env.RAVELRY_PASSWORD) {
  throw new Error("Ravelry API credentials are not configured");
}

const RAVELRY_BASE = "https://api.ravelry.com";
const RAVELRY_USERNAME = process.env.RAVELRY_USERNAME;
const RAVELRY_PASSWORD = process.env.RAVELRY_PASSWORD;

export async function ravelryFetch(
  path: string,
  params?: Record<string, string>
): Promise<unknown> {
  const url = new URL(`${RAVELRY_BASE}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const credentials = Buffer.from(`${RAVELRY_USERNAME}:${RAVELRY_PASSWORD}`).toString(
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

  try {
    return await response.json();
  } catch {
    throw new Error("Ravelry API returned invalid JSON");
  }
}
