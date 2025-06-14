import { ReactNode } from "react";
import NavLink from "./NavLink";

export type DropdownItem = {
  href: string;
  label: string;
};

type DropdownMenuProps = {
  isOpen: boolean;
  label: string;
  items: DropdownItem[];
  onToggle: () => void;
  isMobile?: boolean;
};

export default function DropdownMenu({ isOpen, label, items, onToggle, isMobile = false }: DropdownMenuProps) {
  if (isMobile) {
    return (
      <div>
        <button
          onClick={onToggle}
          className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150"
        >
          {label}
          <svg
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <div className={`${isOpen ? 'block' : 'hidden'} pl-4 space-y-1 transition-all duration-200`}>
          {items.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-blue-800 font-medium transition-colors duration-200"
      >
        {label}
        <svg
          className="ml-1 h-5 w-5 transition-transform duration-200 group-hover:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-out opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 -translate-y-2">
        <div className="pt-1">
          {items.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
} 