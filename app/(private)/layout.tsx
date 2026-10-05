import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateShell } from "@/components/layout/PrivateShell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PrivateShell>{children}</PrivateShell>
    </AuthProvider>
  );
}
