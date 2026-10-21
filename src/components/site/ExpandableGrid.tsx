"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

type ExpandableGridProps = {
  as?: "div" | "ul";
  className: string;
  preview?: boolean;
  children: ReactNode;
};

export default function ExpandableGrid({
  as: Grid = "div",
  className,
  preview = false,
  children,
}: ExpandableGridProps) {
  const gridId = useId();
  const [expanded, setExpanded] = useState(false);
  const grid = (
    <Grid className={className} id={preview ? gridId : undefined}>
      {children}
    </Grid>
  );

  if (!preview) return grid;

  return (
    <div className="expandable-grid" data-expanded={expanded}>
      {grid}
      <button
        type="button"
        className="secondary-button grid-toggle"
        aria-controls={gridId}
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <span>{expanded ? "Свернуть" : "Показать всё"}</span>
        {expanded ? (
          <ChevronUp aria-hidden="true" />
        ) : (
          <ChevronDown aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
