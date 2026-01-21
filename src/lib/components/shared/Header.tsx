import Link from "next/link";
import { MainNav } from "../navigation/MainNav";
import { Navigation } from "../navigation/Navigation";
import { SearchBar } from "../search/SearchBar";

export default function Header() {
  return (
    <header className="w-full h-16 p-4 flex items-center border-b border-gray-300">
      <div
        className={`max-w-7xl mx-auto w-full items-center flex flex-wrap justify-between gap-4`}
      >
        <h2 className="font-bold flex-shrink-0">
          <Link href="/">Nackamoderaterna</Link>
        </h2>
        <div className="flex-1 min-w-[200px] hidden md:block max-w-md">
          <SearchBar />
        </div>
        <div className="flex-shrink-0">
          <Navigation />
        </div>
      </div>
    </header>
  );
}
