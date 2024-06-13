import { NextRequest, NextResponse } from "next/server";

import metaFetcher from "meta-fetcher";
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const url = searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }
  try {
    const result = await metaFetcher(url);
    const _data_ = {
      title: result.metadata.title,
      image: result.metadata.banner,
      logo: result.favicons[0],
    };
    return new NextResponse(JSON.stringify(_data_), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    return new NextResponse("Something went wrong", { status: 400 });
    // throw new Error("Something went wrong");
  }
}
