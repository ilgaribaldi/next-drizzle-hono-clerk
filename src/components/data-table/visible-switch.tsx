"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQueryString } from "@/hooks/use-query-string";

export function VisibleSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString(searchParams);

  const isVisible = searchParams.get("visible") === "true";

  const handleVisibilityChange = (checked: boolean) => {
    router.push(
      `${pathname}?${createQueryString({
        visible: checked ? "true" : null,
      })}`,
      { scroll: false }
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={isVisible} onCheckedChange={handleVisibilityChange} />
      <Label>Mostrar solo visibles</Label>
    </div>
  );
}
