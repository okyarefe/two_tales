import Header from "@/components/header";
import { UserProvider } from "@/contexts/user-context";
import { getOptionalUser } from "@/utils/supabase/auth-server";
import { getUserData } from "@/actions/user-data";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Shared with the page rendering inside this layout — `getOptionalUser` is
  // request-cached, so the two of them cost one auth round-trip, not two.
  const user = await getOptionalUser();
  const userData = user ? await getUserData(user.id) : null;

  return (
    <UserProvider initialUser={user} initialUserData={userData}>
      <Header />
      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
    </UserProvider>
  );
}
