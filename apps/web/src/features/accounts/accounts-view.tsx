import ProtectedHeader from "@/src/components/shared/protected/ProtectedHeader";
import { Button } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddNewAccount from "./components/AddNewAccount";

export default function AccountsView() {
  return (
    <div>
      <ProtectedHeader />
      <div className="p-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-display">Accounts</h1>
          <Button type="button">
            <span>
              <SettingsOutlinedIcon className="text-dark" />
            </span>
          </Button>
        </div>
        <div>
          <AddNewAccount />
        </div>
      </div>
    </div>
  );
}
