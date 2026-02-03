import { groq } from "next-sanity";
import { GlobalSettings, SocialLinks, Seo } from "~/sanity.types";
import type { MenuItemWithReference } from "./navigation";

export interface GlobalSettingsData {
  companyName?: string | null;
  logo?: GlobalSettings["logo"] | null;
  bliMedlemUrl?: string | null;
  mainNavigation?: MenuItemWithReference[] | null;
  contactInfo?: GlobalSettings["contactInfo"] | null;
  pressContactInfo?: GlobalSettings["pressContactInfo"] | null;
  postAddress?: GlobalSettings["postAddress"] | null;
  visitingAddress?: GlobalSettings["visitingAddress"] | null;
  socialLinks?: SocialLinks | null;
  seo?: Seo | null;
  handlingsprogram?: {
    url?: string | null;
    originalFilename?: string | null;
  } | null;
}

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    companyName,
    logo,
    bliMedlemUrl,
    mainNavigation[] {
      title,
      linkType,
      staticRoute,
      "internalLink": internalLink-> {
        _type,
        "slug": slug.current,
        title,
        name
      },
      url,
      children[] {
        title,
        linkType,
        staticRoute,
        "internalLink": internalLink-> {
          _type,
          "slug": slug.current,
          title,
          name
        },
        url
      }
    },
    contactInfo,
    pressContactInfo,
    postAddress,
    visitingAddress,
    socialLinks,
    seo{
      title,
      description,
      keywords,
      image{
        ...,
        hotspot,
        crop,
        "url": asset->url
      }
    },
    "handlingsprogram": handlingsprogram {
      ...,
      "url": asset->url,
      "originalFilename": asset->originalFilename
    }
  }
`;
