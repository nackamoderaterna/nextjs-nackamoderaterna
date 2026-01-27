"use client";

import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Block from "./Block";
import { sanityClient } from "@/lib/sanity/client";
import { globalSettingsQuery } from "@/lib/queries/globalSettings";
import { GlobalSettings } from "~/sanity.types";
import { ContactForm } from "../shared/ContactForm";

interface ContactBlockProps {
  _type: "block.contact";
  heading?: string;
  description?: string;
  showContactInfo?: boolean;
}

export function ContactBlock({ block }: { block: ContactBlockProps }) {
  const [contactInfo, setContactInfo] = useState<GlobalSettings | null>(null);

  // Fetch contact info if needed
  useEffect(() => {
    if (block.showContactInfo) {
      sanityClient
        .fetch<GlobalSettings>(globalSettingsQuery)
        .then(setContactInfo)
        .catch(console.error);
    }
  }, [block.showContactInfo]);

  const formatAddress = (address: {
    street?: string;
    zip?: string;
    city?: string;
    country?: string;
  } | null | undefined) => {
    if (!address) return null;
    const parts = [
      address.street,
      address.zip && address.city
        ? `${address.zip} ${address.city}`
        : address.zip || address.city,
      address.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts : null;
  };

  const showContactInfo = block.showContactInfo && contactInfo;

  return (
    <Block paddingY="large" maxWidth="7xl">
      <div
        className={
          showContactInfo
            ? "grid grid-cols-1 lg:grid-cols-3 gap-8 mx-auto"
            : "flex justify-center"
        }
      >
        {/* Contact Form */}
        <div
          className={
            showContactInfo
              ? "lg:col-span-2"
              : "w-full max-w-2xl"
          }
        >
          <div className="bg-card p-8 rounded-lg border border-border">
            <ContactForm
              heading={block.heading}
              description={block.description}
            />
          </div>
        </div>

        {/* Contact Information */}
        {showContactInfo && (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-bold text-lg mb-4">Kontaktuppgifter</h3>
              <div className="space-y-4">
                {contactInfo.contactInfo?.email && (
                  <div className="flex items-start gap-3">
                    <IconMail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium mb-1">E-post</p>
                      <Link
                        href={`mailto:${contactInfo.contactInfo.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {contactInfo.contactInfo.email}
                      </Link>
                    </div>
                  </div>
                )}
                {contactInfo.contactInfo?.phone && (
                  <div className="flex items-start gap-3">
                    <IconPhone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium mb-1">Telefon</p>
                      <Link
                        href={`tel:${contactInfo.contactInfo.phone.replace(/\s/g, "")}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {contactInfo.contactInfo.phone}
                      </Link>
                    </div>
                  </div>
                )}
                {(() => {
                  const postAddr = formatAddress(contactInfo.postAddress);
                  return (
                    postAddr && (
                      <div className="flex items-start gap-3">
                        <IconMapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium mb-1">Postadress</p>
                          <p className="text-sm text-muted-foreground">
                            {postAddr.map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < postAddr.length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    )
                  );
                })()}
                {(() => {
                  const visitingAddr = formatAddress(contactInfo.visitingAddress);
                  return (
                    visitingAddr && (
                      <div className="flex items-start gap-3">
                        <IconMapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium mb-1">Besöksadress</p>
                          <p className="text-sm text-muted-foreground">
                            {visitingAddr.map((line, i) => (
                              <span key={i}>
                                {line}
                                {i < visitingAddr.length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    )
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </Block>
  );
}
