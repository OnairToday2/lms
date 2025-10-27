"use client";
import { Alert } from "@mui/material";
import { SnackbarProvider as NotiSnackbarProvider } from "notistack";
export default function SnackbarProvider({ children }: { readonly children: React.ReactNode }) {
  return (
    <NotiSnackbarProvider
      maxSnack={6}
      autoHideDuration={3000}
      dense
      anchorOrigin={{
        horizontal: "right",
        vertical: "top",
      }}
      TransitionProps={{
        direction: "down",
        unmountOnExit: true,
      }}
      // Components={{
      //   error: ({ persist, ...props }) => (
      //     <Alert
      //       {...props}
      //       severity="error"
      //       variant="outlined"
      //       sx={{ backgroundColor: "white", color: "red !important" }}
      //     />
      //   ),
      // }}
    >
      {children}
    </NotiSnackbarProvider>
  );
}
