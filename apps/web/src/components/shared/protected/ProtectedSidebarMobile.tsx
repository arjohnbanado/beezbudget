"use client";

import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState } from "react";
import BeezLogo, { BeezLogoSize } from "../BeezLogo";
import { apiClient, clearLastRefreshedAt } from "@/src/lib/api-client";

export const drawerItems: {
  id: string;
  icon: SvgIconComponent;
  name: string;
  path: string;
}[] = [
  {
    id: "dashboard",
    icon: DashboardOutlinedIcon,
    name: "Dashboard",
    path: "/",
  },
  {
    id: "accounts",
    icon: AccountBalanceWalletOutlinedIcon,
    name: "Accounts",
    path: "/accounts",
  },
];

export default function ProtectedSidebarMobile() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenSidebar(newOpen);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } finally {
      clearLastRefreshedAt();
      window.location.href = "/signin";
    }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <div className="flex items-center justify-center p-xs bg-brand-default">
        <BeezLogo size={BeezLogoSize.EXTRASMALL} />
      </div>
      <List className="py-lg">
        {drawerItems.map(({ id, icon: Icon, name, path }) => {
          const isActive = pathname === path;

          return (
            <ListItem key={id} disablePadding>
              <ListItemButton
                component={Link}
                href={path}
                selected={isActive}
                aria-current={isActive ? "page" : undefined}
              >
                <ListItemIcon>
                  <Icon
                    className={
                      isActive ? "text-brand-default" : "text-dark-subtle"
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  primary={name}
                  slotProps={{
                    primary: {
                      className: isActive
                        ? "text-brand-default"
                        : "text-dark-subtle",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlinedIcon className="text-error" />
            </ListItemIcon>
            <ListItemText
              primary="Log out"
              slotProps={{
                primary: {
                  className: "text-error",
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div className="justify-self-start">
      <Button type="button" onClick={toggleDrawer(true)}>
        <LunchDiningIcon className="text-dark-subtle" />
      </Button>
      <Drawer open={openSidebar} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
