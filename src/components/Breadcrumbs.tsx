import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav className="flex items-center flex-wrap gap-1.5 mb-8 font-mono text-xs uppercase tracking-widest">
      {items.map((item, index) => (
        <Fragment key={item.path}>
          {index > 0 && <ChevronRight size={12} className="text-[#444] shrink-0" />}
          <Link
            to={item.path}
            className={`transition-colors hover:text-white ${index === items.length - 1 ? 'text-white' : 'text-[#888]'}`}
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
};
