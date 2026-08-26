import { PrivateShell } from "@/components/layout/PrivateShell";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <PrivateShell>{children}</PrivateShell>;
}
