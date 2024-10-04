"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/events" className="text-white hover:text-gray-300">
            Events
          </Link>
          <Link href="/education" className="text-white hover:text-gray-300">
            Education
          </Link>
          <Link href="/videos" className="text-white hover:text-gray-300">
            Videos
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300">
            About Us
          </Link>
        </div>
        <div>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
