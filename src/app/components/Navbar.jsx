"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';

import Image from 'next/image';

const NAV_ITEMS = [
  {
    href: '/rain',
    label: 'Rain',
    icon: '/assets/budapest-rain.png',
  },
  {
    href: '/snow',
    label: 'Snow',
    icon: '/assets/new-york-snow.png',
  },
  {
    href: '/fog',
    label: 'Fog',
    icon: '/assets/san-francisco-fog.png',
  },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="fixed z-50 top-6 left-1/2 transform -translate-x-1/2 rounded-full border border-gray-200 bg-white shadow-lg px-16 py-4 flex space-x-12 text-lg font-medium">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`group flex items-center transition-colors relative px-2`}
            style={{ minWidth: 120 }}
          >
            <span
              className={`w-16 h-16 mr-4 transition-transform duration-200 flex items-center justify-center ${
                isActive ? '' : 'group-hover:scale-110'
              }`}
            >
              <Image
                src={icon}
                alt={label + ' icon'}
                width={48}
                height={48}
                className="object-contain"
                style={{ 
                  display: 'block',
                  width: 'auto',
                  height: '48px'
                }}
                priority
              />
            </span>
            <span>{label}</span>
            <span
              className={`absolute bottom-0 h-[3px] w-full rounded-full transition-transform duration-300 bg-zinc-800
                ${isActive ? '' : 'scale-x-0 group-hover:scale-x-100'}`}
              style={{ transformOrigin: 'center' }}
            />
          </Link>
        );
      })}
    </nav>
  );
} 