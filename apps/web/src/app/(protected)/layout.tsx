export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="dashboard-layout">{children}</main>;
}
