"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer({ darkMode }) {
  return (
    <footer
      className={`border-t mt-auto transition-colors duration-300 ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-slate-300"
          : "bg-purple-50/95 border-purple-200 text-slate-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="relative h-12 w-44 -ml-2 mb-3">
              <Image
                src="/logo.svg"
                alt="VanishMart Logo"
                fill
                className="object-contain object-left scale-[3.2] origin-left"
              />
            </div>
            <p className={`text-sm leading-relaxed max-w-xs ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
              Pakistan&apos;s trusted marketplace to buy and sell cars, mobiles, electronics and more.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-purple-500">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className={`hover:underline ${darkMode ? "hover:text-purple-300" : "hover:text-purple-800"}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/" className={`hover:underline ${darkMode ? "hover:text-purple-300" : "hover:text-purple-800"}`}>
                  Browse Products
                </Link>
              </li>
              <li>
                <Link href="/" className={`hover:underline ${darkMode ? "hover:text-purple-300" : "hover:text-purple-800"}`}>
                  Sell Your Item
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-purple-500">
              Contact
            </h3>
            <ul className={`space-y-2 text-sm ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
              <li>📧 support@vanishmart.com</li>
              <li>📞 +92 300 0000000</li>
              <li>📍 Karachi, Pakistan</li>
            </ul>
          </div>
        </div>

        <div
          className={`mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-xs ${
            darkMode ? "border-slate-800 text-slate-500" : "border-purple-200 text-gray-500"
          }`}
        >
          <p>© {new Date().getFullYear()} VanishMart. All rights reserved.</p>
          <p className="font-semibold tracking-wide uppercase">Buy • Sell • Connect</p>
        </div>
      </div>
    </footer>
  );
}
