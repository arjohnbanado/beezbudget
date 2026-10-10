import ProtectedHeader from "@/src/components/shared/protected/ProtectedHeader";
import { Button } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddNewAccount from "./components/AddNewAccount";
import Image from "next/image";
import bbaccountbanner from "@/public/images/illustrations/beez-with-coin-and-piggy-bank.svg";
import AccountsListActions from "./components/AccountsListActions";
import AccountsList from "./components/AccountsList";

export default function AccountsView() {
  return (
    <div className="h-[100dvh] flex flex-col">
      <ProtectedHeader />
      <div className="grow overflow-y-hidden flex flex-col lg:flex lg:flex-row">
        <div className="hidden lg:block w-48 overflow-y-auto">lorem1000</div>
        <div className="grow min-h-0 p-md flex flex-col gap-md lg:bg-canvas">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-display">Accounts</h1>
            <Button type="button">
              <span>
                <SettingsOutlinedIcon className="text-dark" />
              </span>
            </Button>
          </div>
          <div className="relative min-h-28 md:min-h-32">
            <Image
              alt="BeezBudget Beez hero section banner joyful theme for account page"
              src={bbaccountbanner}
              fill
              className="object-cover object-right rounded-lg"
            />
            <div className="absolute inset-0 rounded-lg bg-linear-to-r from-brand-strong/90 from-70% to-brand-default/20 flex items-center px-sm md:px-md">
              <div className="text-light">
                <span className="text-xs md:text-sm">
                  Total Account Balance
                </span>
                <h2 className="text-xl text-shadow-lg md:text-2xl">$500.00</h2>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <AddNewAccount />
            <AccountsListActions />
          </div>
          <AccountsList />
        </div>
      </div>
    </div>
  );
}
