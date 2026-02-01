"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type BreadcrumbTitleContextValue = {
  title: string | null;
  setTitle: (title: string | null) => void;
};

const BreadcrumbTitleContext = createContext<BreadcrumbTitleContextValue | null>(
  null
);

export function BreadcrumbTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string | null>(null);
  const setTitle = useCallback((t: string | null) => setTitleState(t), []);
  return (
    <BreadcrumbTitleContext.Provider value={{ title, setTitle }}>
      {children}
    </BreadcrumbTitleContext.Provider>
  );
}

export function useBreadcrumbTitle(): BreadcrumbTitleContextValue | null {
  return useContext(BreadcrumbTitleContext);
}

/**
 * Call from a page to set the breadcrumb’s last segment to the page title
 * (e.g. for proper åäö instead of slug). Clears on unmount.
 */
export function SetBreadcrumbTitle({ title }: { title: string }) {
  const ctx = useBreadcrumbTitle();
  useEffect(() => {
    if (!ctx) return;
    ctx.setTitle(title || null);
    return () => ctx.setTitle(null);
  }, [ctx, title]);
  return null;
}
