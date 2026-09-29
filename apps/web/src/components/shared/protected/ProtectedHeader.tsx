import BeezBudgetLogo, { BeezBudgetLogoSize } from "../BeezBudgetLogo";
import ProtectedAvatar from "./ProtectedAvatar";
import ProtectedSidebarMobile from "./ProtectedSidebarMobile";

export default function ProtectedHeader() {
  return (
    <header>
      <div className="bg-brand-default grid grid-cols-3 items-center p-md">
        <ProtectedSidebarMobile />
        <div className="justify-self-center">
          <BeezBudgetLogo size={BeezBudgetLogoSize.SMALL} />
        </div>
        <ProtectedAvatar />
      </div>
    </header>
  );
}
