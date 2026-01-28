interface ListingHeaderProps {
  title?: string;
  intro?: string;
  fallbackTitle: string;
  fallbackIntro?: string;
}

export function ListingHeader({
  title,
  intro,
  fallbackTitle,
  fallbackIntro,
}: ListingHeaderProps) {
  const displayTitle = title || fallbackTitle;
  const displayIntro = intro || fallbackIntro;

  return (
    <div className="mb-12">
      <h1 className="mb-4 text-4xl font-bold text-foreground">
        {displayTitle}
      </h1>
      {displayIntro && (
        <p className="max-w-4xl text-base leading-relaxed text-muted-foreground whitespace-pre-line">
          {displayIntro}
        </p>
      )}
    </div>
  );
}
