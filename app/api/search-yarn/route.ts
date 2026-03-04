import { NextRequest, NextResponse } from "next/server";
import { ravelryFetch, RavelryYarn, RavelryError } from "@/lib/ravelry";

interface RavelrySearchResponse {
  yarns: RavelryYarn[];
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim() === "") {
    return NextResponse.json(
      { error: "Missing or empty query parameter: q" },
      { status: 400 }
    );
  }

  if (q.length > 200) {
    return NextResponse.json(
      { error: "Query parameter q must be 200 characters or fewer" },
      { status: 400 }
    );
  }

  try {
    const data = (await ravelryFetch("/yarns/search.json", {
      query: q.trim(),
      page_size: "10",
      sort: "best",
    })) as RavelrySearchResponse;

    if (!Array.isArray(data.yarns)) {
      console.error("Unexpected Ravelry response: yarns is not an array", data);
      return NextResponse.json(
        { error: "Unexpected response from Ravelry" },
        { status: 500 }
      );
    }

    const yarns = data.yarns.map((yarn: RavelryYarn) => ({
      id: yarn.id,
      name: yarn.name,
      brand: yarn.yarn_company_name,
      weight: yarn.yarn_weight?.name ?? null,
      gauge: yarn.min_gauge,
      needleSize: yarn.min_needle_size,
    }));

    return NextResponse.json({ yarns });
  } catch (error) {
    if (error instanceof RavelryError && error.status === 401) {
      console.error(error);
      return NextResponse.json(
        { error: "Invalid Ravelry credentials" },
        { status: 500 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch yarn data" },
      { status: 500 }
    );
  }
}
