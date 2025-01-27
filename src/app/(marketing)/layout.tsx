import { Navbar as AceNavbar } from "@/components/ui/ace-navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AceNavbar />
      <main className="flex-grow bg-white dark:bg-[#0a0a0a]">{children}</main>
    </div>
  );
};

export default MarketingLayout;
