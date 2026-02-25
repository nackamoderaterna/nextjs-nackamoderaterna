import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = {
  _type: string;
  _id?: string;
  slug?: string | null;
  key?: string | null;
};

const LAYOUT_SINGLETONS = new Set([
  "navigationHeader",
  "navigationFooter",
  "globalSettings",
]);

function tagsForPayload(body: WebhookPayload): string[] {
  const { _type, _id } = body;

  if (LAYOUT_SINGLETONS.has(_id ?? _type)) {
    return ["layout"];
  }

  switch (_type) {
    case "page":
      return ["pages"];
    case "news":
      return ["news"];
    case "politician":
      return ["politicians"];
    case "event":
      return ["events"];
    case "politicalArea":
      return ["politics"];
    case "geographicalArea":
      return ["politics"];
    case "politicalIssue":
      return ["politics"];
    case "listingPage":
      return ["listing-pages"];
    default:
      return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { message: "Missing SANITY_REVALIDATE_SECRET" },
        { status: 500 }
      );
    }

    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      secret
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature", isValidSignature },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad request", body },
        { status: 400 }
      );
    }

    const tags = tagsForPayload(body);

    if (tags.length === 0) {
      return NextResponse.json({
        revalidated: false,
        message: `No tags to revalidate for _type=${body._type}`,
        body: { _type: body._type, _id: body._id, slug: body.slug, key: body.key },
      });
    }

    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 });
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      now: Date.now(),
      body: { _type: body._type, _id: body._id, slug: body.slug, key: body.key },
    });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Revalidation failed" },
      { status: 500 }
    );
  }
}
