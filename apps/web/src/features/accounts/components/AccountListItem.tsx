"use client";

import AccountIconView from "@/src/components/shared/AccountIconView";
import { Account } from "./AccountsList";
import { getAccountIconByKey } from "@/src/utils/account-icons";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import { formatMoney } from "@/src/utils/formatters";
import { Button } from "@mui/material";

export default function AccountListItem({ account }: { account: Account }) {
  const accountItemIcon = getAccountIconByKey(account.icon_key);
  const formattedMoney = formatMoney(
    account.opening_balance,
    account.currency_symbol,
  );
  return (
    <Button type="button" variant="text" className="text-left" color="inherit">
      <div className="w-full flex items-center gap-sm">
        <div>
          <AccountIconView>
            {accountItemIcon ? (
              <accountItemIcon.icon size={24} className="text-light" />
            ) : (
              <BrokenImageOutlinedIcon
                fontSize="small"
                className="text-light"
              />
            )}
          </AccountIconView>
        </div>
        <div className="flex grow">
          <div className="w-[50%] flex flex-col overflow-hidden">
            <span className="truncate">{account.name}</span>
            <span className="text-xs">****{account.account_number_last4}</span>
            <div className="text-xs">
              <span className="text-dark-subtle">Balance: </span>
              <span
                className={`font-bold ${formattedMoney.status === "positive" || formattedMoney.status === "zero" ? "text-success" : formattedMoney.status === "negative" ? "text-error" : "text-dark-subtle"}`}
              >
                {formattedMoney.formatted}
              </span>
            </div>
          </div>
          <div className="grow">a</div>
        </div>
      </div>
    </Button>
  );
}
