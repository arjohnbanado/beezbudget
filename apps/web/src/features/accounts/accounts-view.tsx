import ProtectedHeader from "@/src/components/shared/protected/ProtectedHeader";
import { Button } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddNewAccount from "./components/AddNewAccount";
import Image from "next/image";
import bbaccountbanner from "@/public/images/illustrations/beez-with-coin-and-piggy-bank.svg";
import AccountsListActions from "./components/AccountsListActions";
import AccountsList from "./components/AccountsList";
import FeatureView from "@/src/components/ui/FeatureView";

export default function AccountsView() {
  return (
    <div className="h-[100dvh] pb-xl flex flex-col lg:pb-none">
      <ProtectedHeader />
      {/* <div className="grow overflow-y-hidden flex flex-col lg:flex-row">
        <div className="hidden lg:block w-48 overflow-y-auto">
          <div>
            <nav>
              <ul>
                <li>
                  <a href="/">
                    <div className="px-xs py-lg flex gap-sm items-center hover:bg-brand-subtle duration-300">
                      <span>
                        <DashboardOutlinedIcon />
                      </span>
                      <span>Dashboard</span>
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
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
          <div className="flex items-center justify-between mb-sm">
            <AddNewAccount />
            <AccountsListActions />
          </div>  
          <AccountsList />
        </div>
      </div> */}
      <FeatureView>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-display">Accounts</h1>
          <Button type="button">
            <span>
              <SettingsOutlinedIcon className="text-dark" />
            </span>
          </Button>
        </div>
        <div className="relative min-h-28 md:min-h-32 lg:min-h-36">
          <Image
            alt="BeezBudget Beez hero section banner joyful theme for account page"
            src={bbaccountbanner}
            fill
            className="object-cover object-right rounded-lg lg:object-contain"
          />
          <div className="absolute inset-0 rounded-lg bg-linear-to-r from-brand-strong/90 from-70% to-brand-default/20 flex items-center px-sm md:px-md lg:px-lg">
            <div className="text-light">
              <span className="text-xs md:text-sm lg:text-base">
                Total Account Balance
              </span>
              <h2 className="text-xl text-shadow-lg md:text-2xl lg:text-3xl">
                $500.00
              </h2>
            </div>
          </div>
        </div>
        <div className="h-full overflow-hidden flex flex-col lg:flex-row lg:gap-md">
          <div className="h-full flex flex-col rounded-lg lg:bg-light lg:p-md lg:grow">
            <div className="flex items-center justify-between mb-lg lg:mb-md">
              <AddNewAccount />
              <AccountsListActions />
            </div>
            <AccountsList />
          </div>
          <div className="hidden lg:block w-64 bg-light rounded-lg p-md">
            <div>
              <h3 className="text-lg font-bold">Account Summary</h3>
            </div>
          </div>
        </div>
      </FeatureView>
    </div>
  );
}
