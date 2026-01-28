import { groq } from "next-sanity";

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    companyName,
    logo,
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
