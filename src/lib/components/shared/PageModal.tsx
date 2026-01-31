"use client";

import * as React from "react";
import Link from "next/link";
import { PortableText } from "next-sanity";
import { portableTextComponents } from "./PortableTextComponents";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";
import { Button } from "@/lib/components/ui/button";

type PageModalData = {
  enabled?: boolean;
  onLoadDelayMs?: number;
  frequency?: "always" | "oncePerSession" | "oncePerDay";
  storageKey?: string;
  title?: string;
  content?: any[];
  primaryButton?: { label?: string; href?: string };
  secondaryButton?: { label?: string; href?: string };
};

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function shouldOpenModal(opts: {
  frequency: NonNullable<PageModalData["frequency"]>;
  key: string;
}) {
  const { frequency, key } = opts;

  if (frequency === "always") return true;

  if (frequency === "oncePerSession") {
    try {
      return sessionStorage.getItem(key) !== "1";
    } catch {
      return true;
    }
  }

  // oncePerDay
  try {
    return localStorage.getItem(key) !== todayKey();
  } catch {
    return true;
  }
}

function markModalShown(opts: {
  frequency: NonNullable<PageModalData["frequency"]>;
  key: string;
}) {
  const { frequency, key } = opts;
  if (frequency === "always") return;

  if (frequency === "oncePerSession") {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // ignore
    }
    return;
  }

  // oncePerDay
  try {
    localStorage.setItem(key, todayKey());
  } catch {
    // ignore
  }
}

export function PageModal({
  modal,
  pageSlug,
}: {
  modal?: PageModalData | null;
  pageSlug: string;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!modal?.enabled) return;

    const frequency = modal.frequency ?? "oncePerSession";
    const storageKey = modal.storageKey?.trim() || pageSlug;
    const key = `pageModal:${storageKey}`;

    if (!shouldOpenModal({ frequency, key })) return;

    const delay = Math.max(0, modal.onLoadDelayMs ?? 800);
    const t = window.setTimeout(() => {
      setOpen(true);
      // Mark as shown when opened to avoid re-opening on fast navigations.
      markModalShown({ frequency, key });
    }, delay);

    return () => window.clearTimeout(t);
  }, [modal?.enabled, modal?.frequency, modal?.onLoadDelayMs, modal?.storageKey, pageSlug]);

  if (!modal?.enabled) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          {modal.title ? <DialogTitle>{modal.title}</DialogTitle> : null}
          {modal.content?.length ? (
            <DialogDescription asChild>
              <div className="prose prose-neutral max-w-none">
                <PortableText value={modal.content} components={portableTextComponents} />
              </div>
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {(modal.primaryButton?.label || modal.secondaryButton?.label) && (
          <DialogFooter>
            {modal.secondaryButton?.label && modal.secondaryButton?.href ? (
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link href={modal.secondaryButton.href}>
                  {modal.secondaryButton.label}
                </Link>
              </Button>
            ) : null}
            {modal.primaryButton?.label && modal.primaryButton?.href ? (
              <Button asChild onClick={() => setOpen(false)}>
                <Link href={modal.primaryButton.href} target="_blank" rel="noopener noreferrer">
                  {modal.primaryButton.label}
                </Link>
              </Button>
            ) : null}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

