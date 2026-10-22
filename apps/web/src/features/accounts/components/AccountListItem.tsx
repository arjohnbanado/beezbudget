"use client";

import AccountIconView from "@/src/components/shared/AccountIconView";
import { Account } from "./AccountsList";
import { getAccountIconByKey } from "@/src/utils/account-icons";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import { formatMoney } from "@/src/utils/formatters";
import { Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";

export default function AccountListItem({
  account,
  preferredCurrencySymbol,
  preferredCurrencyCode,
}: {
  account: Account;
  preferredCurrencySymbol?: string | null;
  preferredCurrencyCode?: string | null;
}) {
  const accountItemIcon = getAccountIconByKey(account.icon_key);
  const formattedMoney = formatMoney(
    account.opening_balance,
    account.currency_symbol,
    account.currency_code,
  );
  const formattedConvertedMoney =
    account.converted_opening_balance !== null
      ? formatMoney(
          account.converted_opening_balance,
          preferredCurrencySymbol,
          preferredCurrencyCode,
        )
      : null;
  const isForeignCurrency =
    Boolean(preferredCurrencyCode) &&
    account.currency_code !== preferredCurrencyCode;

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
            <div className="min-w-0 grow overflow-hidden flex flex-col text-xs">
              <span className="truncate text-base">{account.name}</span>
              <span>****{account.account_number_last4}</span>
              <div className="truncate">
                <span className="text-dark-subtle">Balance: </span>
                <span
                  className={`font-bold ${formattedMoney.status === "positive" || formattedMoney.status === "zero" ? "text-success" : formattedMoney.status === "negative" ? "text-error" : "text-dark-subtle"}`}
                >
                  {formattedMoney.sign && <span>{formattedMoney.sign}</span>}
                  {formattedMoney.symbol && (
                    <span>{formattedMoney.symbol}</span>
                  )}
                  <span>{formattedMoney.amount}</span>
                </span>
                {isForeignCurrency && formattedMoney.currencyCode && (
                  <span className="text-[0.65rem] font-normal text-subtle ml-xxs">
                    {formattedMoney.currencyCode}
                  </span>
                )}
                {formattedConvertedMoney && (
                  <span className="text-dark-subtle ml-xxs">
                    <span>(</span>
                    {formattedConvertedMoney.sign && (
                      <span>{formattedConvertedMoney.sign}</span>
                    )}
                    {formattedConvertedMoney.symbol && (
                      <span>{formattedConvertedMoney.symbol}</span>
                    )}
                    <span>{formattedConvertedMoney.amount}</span>
                    <span>)</span>
                  </span>
                )}
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
