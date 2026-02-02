"use client";

import { PortableText } from "next-sanity";
import Block from "./Block";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { portableTextComponents } from "../shared/PortableTextComponents";
import { BlockHeading, getBlockHeading } from "./BlockHeading";

interface AccordionItemData {
  title: string;
  content: any[];
}

interface AccordionBlockProps {
  _type: "block.accordion";
  heading?: { title?: string | null; subtitle?: string | null } | string;
  description?: string;
  items: AccordionItemData[];
  allowMultiple?: boolean;
}

export function AccordionBlock({ block }: { block: AccordionBlockProps }) {
  const allowMultiple = block.allowMultiple ?? false;
  const { title, subtitle } = getBlockHeading(block);

  return (
    <Block maxWidth="3xl">
      <BlockHeading
        title={title}
        subtitle={subtitle}
        subtitleMaxWidth="none"
        className="mb-12"
      />
      <Accordion
        type={allowMultiple ? "multiple" : "single"}
        collapsible
        className="space-y-0"
      >
        {block.items?.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
            <AccordionTrigger className="px-0 py-6 text-left font-semibold text-lg hover:no-underline [&[data-state=open]]:border-b-0">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="px-0">
              <div className="prose prose-neutral max-w-none pt-2">
                <PortableText
                  value={item.content}
                  components={portableTextComponents}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Block>
  );
}
