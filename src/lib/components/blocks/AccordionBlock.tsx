"use client";

import { useState } from "react";
import { PortableText } from "next-sanity";
import Block from "./Block";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/lib/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { portableTextComponents } from "../shared/PortableTextComponents";

interface AccordionItem {
  title: string;
  content: any[];
}

interface AccordionBlockProps {
  _type: "block.accordion";
  heading?: string;
  description?: string;
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function AccordionBlock({ block }: { block: AccordionBlockProps }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const allowMultiple = block.allowMultiple || false;

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <Block maxWidth="4xl">
      
        {(block.heading || block.description) && (
          <div className="mb-12 text-center">
            {block.heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {block.heading}
              </h2>
            )}
            {block.description && (
              <p className="text-lg text-muted-foreground">
                {block.description}
              </p>
            )}
          </div>
        )}
        <div className="space-y-4">
          {block.items?.map((item, index) => {
            const isOpen = openItems.has(index);
            return (
              <Collapsible
                key={index}
                open={isOpen}
                onOpenChange={() => toggleItem(index)}
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between p-6 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left">
                  <span className="font-semibold text-lg">{item.title}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="prose prose-neutral max-w-none pt-4">
                    <PortableText value={item.content} components={portableTextComponents} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
    </Block>
  );
}
