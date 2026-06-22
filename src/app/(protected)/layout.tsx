import Header from "@/components/header";
import { UserProvider } from "@/contexts/user-context";
import { createClient } from "@/lib/supabase/server";
import { getUserData } from "@/actions/user-data";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userData = user ? await getUserData(user.id) : null;

  return (
    <UserProvider initialUser={user} initialUserData={userData}>
      <Header />
      <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
    </UserProvider>
  );
}
