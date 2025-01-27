import { SidebarLayout } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarLayout>
        <div className="flex-grow py-0 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="p-6 dark:text-white">{children}</div>
          </div>
        </div>
      </SidebarLayout>
    </>
  );
}
