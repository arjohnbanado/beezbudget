"use clients";

export default function AccountIconView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-brand-default to-brand-strong p-xs rounded-md">
      {children}
    </div>
  );
}
