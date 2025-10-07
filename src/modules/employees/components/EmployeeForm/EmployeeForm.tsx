"use client";
import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { EmployeeFormSchema, EmployeeFormData } from "./schema";
import "dayjs/locale/vi";

export interface EmployeeFormProps {
  onSubmit?: (data: EmployeeFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<EmployeeFormData>;
  mode?: "create" | "edit";
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  isSubmitting = false,
  defaultValues,
  mode = "create",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    defaultValues: {
      email: defaultValues?.email || "",
      fullName: defaultValues?.fullName || "",
      phoneNumber: defaultValues?.phoneNumber || undefined,
      gender: defaultValues?.gender || "male",
      birthday: defaultValues?.birthday || null,
    },
    resolver: zodResolver(EmployeeFormSchema),
  });

  const submitForm: SubmitHandler<EmployeeFormData> = async (formData) => {
    await onSubmit?.(formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      sx={{ width: "100%", maxWidth: "1200px" }}
    >
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Thông tin nhân viên
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="fullName"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="fullName" sx={{ mb: 1 }}>
                      Họ và tên <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      {...field}
                      id="fullName"
                      placeholder="Nhập họ và tên nhân viên"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="email" sx={{ mb: 1 }}>
                      Email <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <TextField
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Nhập email"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Trạng thái</FormLabel>
                <TextField
                  placeholder="Hoạt động"
                  disabled
                  fullWidth
                  helperText=" "
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <FormLabel sx={{ mb: 1 }}>
                      Giới tính <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      row
                      sx={{ gap: 2 }}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Nữ"
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Khác"
                      />
                    </RadioGroup>
                    {error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="phoneNumber" sx={{ mb: 1 }}>
                      Số điện thoại
                    </FormLabel>
                    <TextField
                      {...field}
                      id="phoneNumber"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="birthday"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1 }}>Ngày sinh</FormLabel>
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale="vi"
                    >
                      <DatePicker
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue: Dayjs | null) => {
                          field.onChange(
                            newValue ? newValue.format("YYYY-MM-DD") : null
                          );
                        }}
                        slotProps={{
                          textField: {
                            size: "small",
                            placeholder: "Chọn ngày sinh",
                            error: !!error,
                            helperText: error?.message,
                            fullWidth: true,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          loading={isSubmitting}
          sx={{ minWidth: 150 }}
        >
          {mode === "create" ? "Tạo nhân viên" : "Cập nhật"}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(EmployeeForm);

