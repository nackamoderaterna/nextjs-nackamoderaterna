import { groq } from "next-sanity";

export const globalSettingsQuery = groq`
  *[_type == "globalSettings"][0] {
    companyName,
    logo,
    contactInfo,
    address,
    socialLinks,
    seo
  }
`;
