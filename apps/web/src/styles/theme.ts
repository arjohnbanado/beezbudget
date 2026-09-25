"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#f5c444" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          textTransform: "none",

          variants: [
            {
              props: { variant: "contained" },

              style: {
                "&:hover": {
                  backgroundColor: "#ca9b4b",
                  boxShadow: "none",
                },
              },
            },
            {
              props: { variant: "outlined" },

              style: {
                border: "3px solid",
                "&:hover": {
                  backgroundColor: "#fbf2df",
                  boxShadow: "none",
                },
              },
            },
            {
              props: { variant: "text" },
              style: {
                minWidth: "max-content",
                padding: "0px",
                margin: "0px",
              },
            },
          ],
        },
      },
    },
  },
});

export default theme;
