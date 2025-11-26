export default function OverflowBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`w-full`}>{children}</div>;
}
