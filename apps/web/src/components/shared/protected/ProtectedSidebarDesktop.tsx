"use client";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
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

export default function ProtectedSidebarDesktop() {
  const pathname = usePathname();
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
