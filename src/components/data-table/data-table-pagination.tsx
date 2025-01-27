import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger2,
  SelectValue,
} from "@/components/ui/select";
import { useQueryString } from "@/hooks/use-query-string";
import { usePaginationStore } from "@/stores/pagination-store";
import { useCallback } from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);
  const { totalPages, totalCount, nextPage, currentPage, setCurrentPage } =
    usePaginationStore();

  const updateUrlParams = useCallback(
    (page: number, limit: number) => {
      router.push(`${pathname}?${createQueryString({ page, limit })}`, {
        scroll: false,
      });
    },
    [router, pathname, createQueryString]
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateUrlParams(totalPages, table.getState().pagination.pageSize);
    }
  }, [totalPages, currentPage, updateUrlParams, table]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de {totalCount}{" "}
        fila(s) seleccionada(s).
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Límite</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const newPageSize = Number(value);
              table.setPageSize(newPageSize);
              updateUrlParams(currentPage, newPageSize);
            }}
          >
            <SelectTrigger2 className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger2>
            <SelectContent side="top" className="dark:bg-zinc-900">
              {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              updateUrlParams(1, table.getState().pagination.pageSize)
            }
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir a la primera página</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              updateUrlParams(
                currentPage - 1,
                table.getState().pagination.pageSize
              )
            }
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir a la página anterior</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() =>
              updateUrlParams(
                nextPage || currentPage,
                table.getState().pagination.pageSize
              )
            }
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir a la página siguiente</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() =>
              updateUrlParams(totalPages, table.getState().pagination.pageSize)
            }
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir a la última página</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
