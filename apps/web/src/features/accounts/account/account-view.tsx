import ProtectedHeader from "@/src/components/shared/protected/ProtectedHeader";
import FeatureView from "@/src/components/ui/FeatureView";

export default function AccountView() {
  return (
    <div className="h-[100dvh] pb-xl flex flex-col lg:pb-none">
      <ProtectedHeader />
      <FeatureView>
        <div></div>
      </FeatureView>
    </div>
  );
}
