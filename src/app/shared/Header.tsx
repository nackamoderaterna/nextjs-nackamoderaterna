import { CONTAINER_MAX_WIDTH } from "@/lib/utils/layout";

export default function Header() {
  return (
    <header className="w-full h-16 p-4 flex items-center border-b border-gray-300">
      <div className={`${CONTAINER_MAX_WIDTH} mx-auto w-full`}>
        <h2 className="font-bold">Nackamoderaterna</h2>
      </div>
    </header>
  );
}
