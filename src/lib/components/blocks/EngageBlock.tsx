import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

interface EngageBlockProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
}

export function EngageBlock({
  title = "Engagera dig",
  description = "Lorem ipsum dolor sit amet consectetur. Sed at tellus adipiscing nisl amet id viverra. Ultrices condimentum penatibus iaculis vestibulum amet lacus luctus urna scelerisque. Integer pellentesque adipiscing vehicula netus turpis nec suspendisse facilisis aliquet. Senectus sed elit egestas non urna aliquam lacus.",
  buttonText = "Bli medlem",
  buttonHref = "#",
  className,
}: EngageBlockProps) {
  return (
    <section
      className={cn("w-full py-16 md:py-20 bg-blue-900 text-white", className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
          <p className="text-blue-100 leading-relaxed mb-8">{description}</p>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900"
          >
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
