export type BlockProps = {
  applyBackground?: boolean;
  children: React.ReactNode;
};

export default function Block({ children }: BlockProps) {
  return (
    <section className="w-full py-12">
      <div className="w-full mx-auto max-w-7xl px-4 md:px-6 lg:px-8 ">
        {children}
      </div>
    </section>
  );
}
