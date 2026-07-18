import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  accentClassName?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon,
  className,
  accentClassName,
}: StatCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl font-bold tabular-nums">
            {value}
          </CardTitle>
        </div>
        {icon && (
          <div
            className={cn(
              "rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
              accentClassName
            )}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      )}
    </Card>
  );
}
