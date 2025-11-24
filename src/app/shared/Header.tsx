import { CONTAINER_MAX_WIDTH } from "@/lib/utils/layout";

export default function Header() {
  return (
    <header className="w-full">
      <div
        className={`${CONTAINER_MAX_WIDTH} mx-auto p-4 border-b border-gray-300`}
      >
        <h2 className="font-bold">Nackamoderaterna</h2>
      </div>
    </header>
  );
}
