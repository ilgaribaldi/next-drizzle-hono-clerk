import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryString } from "@/hooks/use-query-string";
import { Cross2Icon } from "@radix-ui/react-icons";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);

  const handleSort = (direction: "asc" | "desc") => {
    router.push(
      `${pathname}?${createQueryString({ sort: `${column.id}_${direction}` })}`,
      { scroll: false }
    );
  };

  const handleResetSort = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("sort");
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
  };

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const currentSort = searchParams.get("sort");
  const [currentColumn, currentDirection] = currentSort?.split("_") || [];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent p-1"
          >
            <span className="text-xs">{title}</span>
            {currentColumn === column.id && currentDirection === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : currentColumn === column.id && currentDirection === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="dark:bg-zinc-900">
          <DropdownMenuItem onClick={() => handleSort("asc")}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort("desc")}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          {currentColumn === column.id && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleResetSort}>
                <Cross2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Reestablecer
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Ocultar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
