"use client";

import AccountIconView from "@/src/components/shared/AccountIconView";
import { Account } from "./AccountsList";
import { getAccountIconByKey } from "@/src/utils/account-icons";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import { formatMoney } from "@/src/utils/formatters";
import { Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";

export default function AccountListItem({ account }: { account: Account }) {
  const accountItemIcon = getAccountIconByKey(account.icon_key);
  const formattedMoney = formatMoney(
    account.opening_balance,
    account.currency_symbol,
  );

  return (
    <div className="flex items-center border-b border-canvas">
      <div className="grow">
        <Button
          component={Link}
          href={`/accounts/${account.id}`}
          variant="text"
          className="text-left"
          color="inherit"
          fullWidth
        >
          <div className="w-full flex items-center gap-sm py-xs">
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
            <div className="w-48 overflow-hidden flex flex-col">
              <span className="truncate">{account.name}</span>
              <span className="text-xs">
                ****{account.account_number_last4}
              </span>
              <div className="text-xs">
                <span className="text-dark-subtle">Balance: </span>
                <span
                  className={`font-bold ${formattedMoney.status === "positive" || formattedMoney.status === "zero" ? "text-success" : formattedMoney.status === "negative" ? "text-error" : "text-dark-subtle"}`}
                >
                  {formattedMoney.formatted}
                </span>
              </div>
            </div>
          </div>
        </Button>
      </div>
      <div>
        <Button
          type="button"
          variant="text"
          onClick={(e) => e.stopPropagation()}
          className="p-sm text-subtle"
        >
          <span>
            <MoreVertIcon />
          </span>
        </Button>
      </div>
    </div>
  );
}
