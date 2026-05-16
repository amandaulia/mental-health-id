import { useEffect, useRef, useState } from "react";

interface InfiniteCardGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  pageSize?: number;
  className?: string;
}

export function InfiniteCardGrid<T>({
  items,
  renderItem,
  pageSize = 10,
  className = "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6",
}: InfiniteCardGridProps<T>) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset when the items collection changes (e.g. filters update)
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    if (visibleCount >= items.length) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((c) => Math.min(c + pageSize, items.length));
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleCount, items.length, pageSize]);

  const visible = items.slice(0, visibleCount);

  return (
    <>
      <div className={className}>
        {visible.map((item, i) => renderItem(item, i))}
      </div>
      {visibleCount < items.length && (
        <div ref={sentinelRef} className="h-10" aria-hidden="true" />
      )}
    </>
  );
}