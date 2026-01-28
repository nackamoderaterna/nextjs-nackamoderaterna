import { revalidatePath } from "next/cache";
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

const LISTING_KEY_TO_PATH: Record<string, string> = {
  politicians: "/politiker",
  politics: "/politik",
  news: "/nyheter",
  events: "/event",
  contact: "/kontakt",
};

function pathsForPayload(body: WebhookPayload): string[] {
  const { _type, _id, slug, key } = body;
  const paths: string[] = [];

  if (LAYOUT_SINGLETONS.has(_id ?? _type)) {
    paths.push("/");
    return paths;
  }

  switch (_type) {
    case "page": {
      if (slug === "hem") {
        paths.push("/");
      } else if (slug) {
        paths.push(`/${slug}`);
      }
      break;
    }
    case "news": {
      paths.push("/nyheter");
      if (slug) paths.push(`/nyheter/${slug}`);
      break;
    }
    case "politician": {
      paths.push("/politiker");
      if (slug) paths.push(`/politiker/${slug}`);
      break;
    }
    case "event": {
      paths.push("/event");
      if (slug) paths.push(`/event/${slug}`);
      break;
    }
    case "politicalArea": {
      paths.push("/politik");
      if (slug) paths.push(`/politik/${slug}`);
      break;
    }
    case "geographicalArea": {
      paths.push("/politik");
      if (slug) paths.push(`/omrade/${slug}`);
      break;
    }
    case "politicalIssue": {
      paths.push("/politik");
      break;
    }
    case "listingPage": {
      const path = key ? LISTING_KEY_TO_PATH[key] : null;
      if (path) paths.push(path);
      break;
    }
    default:
      break;
  }

  return paths;
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

    const paths = pathsForPayload(body);

    if (paths.length === 0) {
      return NextResponse.json({
        revalidated: false,
        message: `No paths to revalidate for _type=${body._type}`,
        body: { _type: body._type, _id: body._id, slug: body.slug, key: body.key },
      });
    }

    const isLayoutRevalidate = paths.length === 1 && paths[0] === "/";
    for (const path of paths) {
      revalidatePath(path, isLayoutRevalidate ? "layout" : "page");
    }

    return NextResponse.json({
      revalidated: true,
      paths,
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
