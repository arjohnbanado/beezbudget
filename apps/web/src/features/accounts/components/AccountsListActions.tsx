"use client";

import { Button } from "@mui/material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

export default function AccountsListActions() {
  return (
    <div className="flex items-center justify-between gap-xs">
      <Button type="button" variant="text" className="text-dark-subtle">
        <span>
          <GridViewOutlinedIcon />
        </span>
      </Button>
      <Button type="button" variant="text" className="text-dark-subtle">
        <span>
          <FilterAltOutlinedIcon />
        </span>
      </Button>
    </div>
  );
}
