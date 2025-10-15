"use client";
import { LocalizationProvider as XDateLocationProvider } from "@mui/x-date-pickers";
import { viVN } from "@mui/x-date-pickers/locales";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const MUILocalizationProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <XDateLocationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="vi-VN"
      localeText={{
        ...viVN.components.MuiLocalizationProvider.defaultProps.localeText,
        clearButtonLabel: "Xóa",
      }}
    >
      {children}
    </XDateLocationProvider>
  );
};
export default MUILocalizationProvider;
