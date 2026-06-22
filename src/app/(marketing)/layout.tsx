import Header from "@/components/header";
import { UserProvider } from "@/contexts/user-context";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <Header />
      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
    </UserProvider>
  );
}
