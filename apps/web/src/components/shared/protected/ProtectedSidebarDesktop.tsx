"use client";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { drawerItems } from "./ProtectedSidebarMobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { apiClient, clearLastRefreshedAt } from "@/src/lib/api-client";

export default function ProtectedSidebarDesktop() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } finally {
      clearLastRefreshedAt();
      window.location.href = "/signin";
    }
  };

  return (
    <div className="hidden lg:block w-48 overflow-y-auto">
      <Box role="presentation">
        <List className="pt-xl">
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
      {/* <div>
        <nav>
          <ul>
            <li>
              <a href="/">
                <div className="p-md flex gap-sm items-center hover:bg-brand-subtle duration-300">
                  <span>
                    <DashboardOutlinedIcon />
                  </span>
                  <span>Dashboard</span>
                </div>
              </a>
            </li>
          </ul>
        </nav>
      </div> */}
    </div>
  );
}
