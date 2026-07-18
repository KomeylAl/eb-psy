import { cn } from "@/lib/utils";

type BarItem = {
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  title: string;
  items: BarItem[];
  emptyMessage?: string;
  className?: string;
  barClassName?: string;
};

export function SimpleBarChart({
  title,
  items,
  emptyMessage = "داده‌ای برای نمایش وجود ندارد",
  className,
  barClassName,
}: SimpleBarChartProps) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700",
        className
      )}
    >
      <h3 className="mb-6 text-lg font-semibold">{title}</h3>

      {items.every((item) => item.value === 0) ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex h-56 items-end gap-3">
          {items.map((item) => {
            const height = Math.max((item.value / max) * 100, item.value > 0 ? 8 : 2);

            return (
              <div
                key={item.label}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {item.value}
                </span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      "w-full rounded-t-lg bg-blue-500/90 transition-all dark:bg-blue-400",
                      barClassName
                    )}
                    style={{ height: `${height}%` }}
                    title={`${item.label}: ${item.value}`}
                  />
                </div>
                <span className="text-center text-[11px] leading-tight text-muted-foreground">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
