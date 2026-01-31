interface FooterLegalProps {
  text: string;
}

export function FooterLegal({ text }: FooterLegalProps) {
  return (
    <div className="mt-8 pt-8 border-t border-border">
      <p className="text-xs text-muted-foreground text-center">{text}</p>
    </div>
  );
}
