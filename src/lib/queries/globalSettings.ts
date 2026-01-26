import { groq } from "next-sanity";

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    companyName,
    logo,
    contactInfo,
    postAddress,
    visitingAddress,
    socialLinks,
    seo
  }
`;
