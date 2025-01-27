"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Download } from "lucide-react";
import { useFilterStore } from "@/stores/filter-store";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryString } from "@/hooks/use-query-string";
import * as XLSX from "xlsx";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { TableOptions } from "@/types";
import { useOrganization } from "@clerk/nextjs";
import { VisibleSwitch } from "./visible-switch";

interface DataTableToolbarProps<TData extends TableOptions["data"][number]> {
  table: Table<TData>;
  selectedRowData: TData[];
}

export function DataTableToolbar<TData extends TableOptions["data"][number]>({
  table,
  selectedRowData,
}: DataTableToolbarProps<TData>) {
  const columns = table.getAllColumns();
  const isFiltered = table.getState().columnFilters.length > 0;
  const { search, setSearch } = useFilterStore();
  const debouncedSearch = useDebounce(search, 500);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);
  const { organization } = useOrganization();
  const isAdmin = organization?.slug === "admin";
  const isDevelopersPage = pathname.startsWith("/developers");
  const isStaffPage = pathname.startsWith("/staff");

  const isInternalPresalesTable =
    columns.some((col) => col.id === "visibleByStaff") &&
    columns.some((col) => col.id === "visibleByDeveloper");

  const isInternalInvestorsTable =
    columns.some((col) => col.id === "conversationsCount") &&
    columns.some((col) => col.id === "organizationLikesCount");

  const isOrgReservationsTable =
    columns.some((col) => col.id === "presaleName") &&
    columns.some((col) => col.id === "userEmail") &&
    columns.some((col) => col.id === "unitPrice");

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      router.push(
        `${pathname}?${createQueryString({ search: debouncedSearch })}`,
        { scroll: false }
      );
    }
  }, [debouncedSearch, router, pathname, createQueryString]);

  const handleExport = () => {
    const dataToExport = table.getRowModel().rows.map((row) => {
      const { createdAt, updatedAt, ...exportData } = row.original;
      return exportData;
    });
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shipments");
    XLSX.writeFile(wb, "table.xlsx");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar..."
          value={search ?? ""}
          onChange={(event) => setSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px] dark:bg-background"
        />
        {columns.map((column) => {
          if (
            column.id === "developer" &&
            column.getCanFilter() &&
            !isDevelopersPage
          ) {
            return (
              <DataTableFacetedFilter
                key={column.id}
                column={column}
                title="Desarrollador"
              />
            );
          }
          if (column.id === "subscriptionPriceId" && isInternalInvestorsTable) {
            return (
              <DataTableFacetedFilter
                key={column.id}
                column={column}
                title="Plan"
              />
            );
          }

          if (column.id === "category" && column.getCanFilter()) {
            return (
              <DataTableFacetedFilter
                key={column.id}
                column={column}
                title="Categoría"
              />
            );
          }
          if (column.id === "state" && column.getCanFilter()) {
            return (
              <DataTableFacetedFilter
                key={column.id}
                column={column}
                title="Estado"
              />
            );
          }
          if (column.id === "userEmail" && isOrgReservationsTable) {
            return (
              <DataTableFacetedFilter
                key={column.id}
                column={column}
                title="Usuario"
              />
            );
          }
          if (column.id === "presaleName" && isOrgReservationsTable) {
            return (
              <DataTableFacetedFilter
                key={column.id}
                column={column}
                title="Oportunidad"
              />
            );
          }
          return null;
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setSearch("");
              router.push(pathname, { scroll: false });
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reestablecer
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isInternalPresalesTable && <VisibleSwitch />}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
