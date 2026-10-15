/**
 * PageHeader
 * Two-row page header: breadcrumb bar with actions, then a title row.
 * Reused by the dashboard and project pages.
 */

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  icon,
  crumbs,
  className,
}: {
  icon?: React.ReactNode;
  crumbs: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      {icon}
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted-foreground/40">/</span>}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function PageHeader({
  icon,
  crumbs,
  actions,
  title,
  titleAdornment,
  meta,
  className,
}: {
  icon?: React.ReactNode;
  crumbs: Crumb[];
  actions?: React.ReactNode;
  /** Big title row. Omit to render only the breadcrumb bar. */
  title?: React.ReactNode;
  titleAdornment?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("shrink-0 bg-background", className)}>
      {/* Top bar: breadcrumb + actions */}
      <div className="flex items-center justify-between gap-4 px-8 py-5">
        <Breadcrumb icon={icon} crumbs={crumbs} />
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {title && (
        <div className="flex items-center justify-between gap-4 px-8 pt-1 pb-4">
          <div className="flex min-w-0 items-center gap-4 text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight">
            {title}
            {titleAdornment}
          </div>
          {meta && <div className="flex items-center gap-4">{meta}</div>}
        </div>
      )}
    </header>
  );
}
