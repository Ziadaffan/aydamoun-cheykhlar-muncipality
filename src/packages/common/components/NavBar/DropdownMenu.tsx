import NavLink from './NavLink';

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

export default function DropdownMenu({
  isOpen,
  label,
  items,
  onToggle,
  isMobile = false,
}: DropdownMenuProps) {
  if (isMobile) {
    return (
      <div>
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-800"
        >
          {label}
          <svg
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div
          className={`${isOpen ? 'block' : 'hidden'} space-y-1 pl-4 transition-all duration-200`}
        >
          {items.map(item => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button className="inline-flex items-center px-3 py-2 font-medium text-gray-700 transition-colors duration-200 hover:text-blue-800">
        {label}
        <svg
          className="ml-1 h-5 w-5 transition-transform duration-200 group-hover:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="ring-opacity-5 invisible absolute left-0 mt-2 w-56 -translate-y-2 transform rounded-md bg-white opacity-0 shadow-lg ring-1 ring-black transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="pt-1">
          {items.map(item => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
