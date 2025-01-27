import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useFilterStore } from "@/stores/filter-store";
import { categoryOptions } from "@/data/category-options";
import { useQueryString } from "@/hooks/use-query-string";
import { planOptions } from "@/data/plan-options";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const { facets } = useFilterStore();

  // const facetKey = title?.toLowerCase() as keyof typeof facets;

  const facetKey =
    title === "Categoría"
      ? "category"
      : title === "Desarrollador"
        ? "developer"
        : title === "Estado"
          ? "state"
          : title === "Plan"
            ? "plan"
            : title === "Usuario"
              ? "user"
              : title === "Oportunidad"
                ? "presale"
                : (title?.toLowerCase() as keyof typeof facets);

  const facetValues = React.useMemo(
    () => facets[facetKey] || {},
    [facets, facetKey]
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);

  const options = React.useMemo(() => {
    if (facetKey === "category") {
      return categoryOptions.map((option) => ({
        label: option.label,
        value: option.value,
        color: option.color,
      }));
    } else if (facetKey === "plan") {
      return planOptions.map((option) => ({
        label: option.label,
        value: option.value,
        color: option.color,
      }));
    } else if (facetKey === "developer") {
      return Object.keys(facetValues).map((developer) => ({
        label: developer,
        value: developer,
        color: "", // Add a default color property
      }));
    } else if (facetKey === "state") {
      return Object.entries(facetValues).map(([label, data]) => ({
        label,
        value: (data as { id: string }).id,
        color: "text-foreground",
      }));
    } else if (facetKey === "phase") {
      return Object.entries(facetValues).map(([label, count]) => ({
        label,
        value: label,
        color: "text-foreground",
      }));
    } else if (facetKey === "presale") {
      return Object.entries(facetValues).map(([label, data]) => ({
        label,
        value: (data as { id: string }).id,
        color: "text-foreground",
      }));
    } else if (facetKey === "user") {
      return Object.entries(facetValues).map(([label, data]) => ({
        label,
        value: (data as { id: string }).id,
        color: "text-foreground",
      }));
    }
    return [];
  }, [facetKey, facetValues]);

  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const updateUrl = (values: Set<string>) => {
    const filterValues = Array.from(values);
    const newQueryString = createQueryString({
      [facetKey]: filterValues.length ? filterValues.join(",") : null,
    });
    router.push(`${pathname}?${newQueryString}`, { scroll: false });
  };

  React.useEffect(() => {
    const currentFilters = searchParams.get(facetKey)?.split(",") || [];
    if (currentFilters.length) {
      column?.setFilterValue(currentFilters);
    }
  }, [searchParams, facetKey, column]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 dark:bg-zinc-900" align="start">
        <Command className="dark:bg-zinc-900">
          <CommandInput placeholder={title} className="dark:bg-zinc-900 " />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup className="dark:bg-zinc-900">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                const facetCount =
                  title === "Estado" ||
                  title === "Oportunidad" ||
                  title === "Usuario"
                    ? (
                        facetValues[option.label] as {
                          id: string;
                          count: number;
                        }
                      )?.count || 0
                    : facetValues[option.value] || 0;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      const newSelectedValues = new Set(selectedValues);
                      if (isSelected) {
                        newSelectedValues.delete(option.value);
                      } else {
                        newSelectedValues.add(option.value);
                      }
                      updateUrl(newSelectedValues);
                      column?.setFilterValue(
                        newSelectedValues.size
                          ? Array.from(newSelectedValues)
                          : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    <span className={option.color}>{option.label}</span>
                    {(typeof facetCount === "number"
                      ? facetCount > 0
                      : facetCount?.count > 0) && (
                      <span
                        className={`ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs ${option.color}`}
                      >
                        {typeof facetCount === "number"
                          ? facetCount
                          : facetCount?.count}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      updateUrl(new Set());
                      column?.setFilterValue(undefined);
                    }}
                    className="justify-center text-center"
                  >
                    Limpiar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
