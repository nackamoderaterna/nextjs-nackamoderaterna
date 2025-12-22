import Link from "next/link";
import { MainNav } from "../navigation/MainNav";
import { Navigation } from "../navigation/Navigation";

export default function Header() {
  return (
    <header className="w-full h-16 p-4 flex items-center border-b border-gray-300">
      <div
        className={`max-w-7xl mx-auto w-full items-center flex justify-between`}
      >
        <h2 className="font-bold">
          <Link href="/">Nackamoderaterna</Link>
        </h2>
        <Navigation />
      </div>
    </header>
  );
}
