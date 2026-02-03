export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8">
        {/* Title */}
        <div className="h-8 w-1/3 rounded bg-muted" />
        {/* Intro line */}
        <div className="h-4 w-2/3 rounded bg-muted" />
        {/* Content blocks */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="h-40 rounded bg-muted" />
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
