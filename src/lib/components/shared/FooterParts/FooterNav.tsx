import { FooterColumn } from "./FooterColumn";
import type { FooterColumn as FooterColumnType } from "@/lib/queries/navigation";

const DEFAULT_COLUMNS: { title: string; items: { title: string; href: string }[] }[] = [
  {
    title: "Meny",
    items: [
      { title: "Hem", href: "/" },
      { title: "Politik", href: "/politik" },
      { title: "Nyheter", href: "/nyheter" },
      { title: "Politiker", href: "/politiker" },
    ],
  },
  {
    title: "Övrigt",
    items: [
      { title: "Evenemang", href: "/event" },
      { title: "Kontakt", href: "/kontakt" },
    ],
  },
];

interface FooterNavProps {
  columns?: FooterColumnType[];
}

export function FooterNav({ columns }: FooterNavProps) {
  if (columns?.length) {
    return (
      <>
        {columns.map((column, index) => (
          <FooterColumn
            key={index}
            title={column.title}
            items={column.items}
          />
        ))}
      </>
    );
  }

  return (
    <>
      {DEFAULT_COLUMNS.map((column, index) => (
        <div key={index}>
          <h3 className="font-semibold text-foreground mb-4">{column.title}</h3>
          <ul className="space-y-2">
            {column.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
