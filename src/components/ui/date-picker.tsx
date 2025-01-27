"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  onlyFutureDates?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Elige una fecha",
  className,
  onlyFutureDates = false,
}: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledDays = onlyFutureDates
    ? { before: new Date(today.getTime() + 86400000) }
    : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-auto justify-start text-left font-normal bg-gray-200 dark:bg-gray-800",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 dark:bg-zinc-900">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          disabled={disabledDays}
        />
      </PopoverContent>
    </Popover>
  );
}
