import ProtectedSidebarDesktop from "../shared/protected/ProtectedSidebarDesktop";

export default function FeatureView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grow overflow-y-hidden flex flex-col lg:flex-row">
      <ProtectedSidebarDesktop />
      <div className="grow min-h-0 flex flex-col gap-md p-md lg:bg-canvas lg:px-3xl lg:py-xl">
        {children}
      </div>
    </div>
  );
}
