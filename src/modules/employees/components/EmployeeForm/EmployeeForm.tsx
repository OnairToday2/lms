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
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { EmployeeFormSchema, EmployeeFormData } from "./schema";
import { useGetOrganizationUnitsQuery } from "@/modules/organization-units/operations/query";
import { useGetEmploymentsQuery } from "@/modules/employments/operations/query";
import { useGetPositionsQuery } from "@/modules/positions/operations/query";
import { Constants } from "@/types/supabase.types";
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
  const [autoGenerateCode, setAutoGenerateCode] = React.useState(false);

  // Fetch data for dropdowns
  const { data: organizationUnits, isLoading: isLoadingOrgUnits } = useGetOrganizationUnitsQuery();
  const { data: employments, isLoading: isLoadingEmployments } = useGetEmploymentsQuery();
  const { data: positions, isLoading: isLoadingPositions } = useGetPositionsQuery();

  // Filter organization units by type
  const branches = React.useMemo(
    () => organizationUnits?.filter((unit) => unit.type === Constants.public.Enums.organization_unit_type[0]),
    [organizationUnits]
  );
  const departments = React.useMemo(
    () => organizationUnits?.filter((unit) => unit.type === Constants.public.Enums.organization_unit_type[1]),
    [organizationUnits]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmployeeFormData>({
    defaultValues: {
      email: defaultValues?.email || "",
      fullName: defaultValues?.fullName || "",
      phoneNumber: defaultValues?.phoneNumber || undefined,
      gender: defaultValues?.gender || "male",
      birthday: defaultValues?.birthday || null,
      branch: defaultValues?.branch || "",
      department: defaultValues?.department || "",
      employee_code: defaultValues?.employee_code || "",
      manager_id: defaultValues?.manager_id || "",
      role: defaultValues?.role || "",
      position_id: defaultValues?.position_id || "",
      start_date: defaultValues?.start_date || null,
    },
    resolver: zodResolver(EmployeeFormSchema),
  });

  // Auto-generate employee code
  React.useEffect(() => {
    if (autoGenerateCode) {
      const generatedCode = `EMP${Date.now().toString().slice(-6)}`;
      setValue("employee_code", generatedCode);
    }
  }, [autoGenerateCode, setValue]);

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

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Thông tin công việc
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="branch"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <FormLabel htmlFor="branch" sx={{ mb: 1 }}>
                      Chi nhánh
                    </FormLabel>
                    <Select
                      {...field}
                      id="branch"
                      displayEmpty
                      disabled={isLoadingOrgUnits}
                    >
                      <MenuItem value="">
                        <em>Chọn chi nhánh</em>
                      </MenuItem>
                      {branches?.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
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
                name="department"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <FormLabel htmlFor="department" sx={{ mb: 1 }}>
                      Phòng ban <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <Select
                      {...field}
                      id="department"
                      displayEmpty
                      disabled={isLoadingOrgUnits}
                    >
                      <MenuItem value="">
                        <em>Chọn phòng ban</em>
                      </MenuItem>
                      {departments?.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </MenuItem>
                      ))}
                    </Select>
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
                name="employee_code"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <FormLabel htmlFor="employee_code">
                        Mã nhân viên <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={autoGenerateCode}
                            onChange={(e) => setAutoGenerateCode(e.target.checked)}
                            size="small"
                          />
                        }
                        label={<span style={{ fontSize: "0.875rem" }}>Tạo tự động</span>}
                      />
                    </Box>
                    <TextField
                      {...field}
                      id="employee_code"
                      placeholder="Nhập mã nhân viên"
                      error={!!error}
                      helperText={error?.message}
                      fullWidth
                      disabled={autoGenerateCode}
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="manager_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <FormLabel htmlFor="manager_id" sx={{ mb: 1 }}>
                      Người quản lý <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <Select
                      {...field}
                      id="manager_id"
                      displayEmpty
                      disabled={isLoadingEmployments}
                    >
                      <MenuItem value="">
                        <em>Chọn người quản lý</em>
                      </MenuItem>
                      {employments?.map((employment: any) => (
                        <MenuItem key={employment.id} value={employment.id}>
                          {employment.employees?.profiles?.full_name || employment.employee_id}
                        </MenuItem>
                      ))}
                    </Select>
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
                name="role"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <FormLabel htmlFor="role" sx={{ mb: 1 }}>
                      Vai trò
                    </FormLabel>
                    <TextField
                      {...field}
                      id="role"
                      placeholder="Nhập vai trò"
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
                name="position_id"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error}>
                    <FormLabel htmlFor="position_id" sx={{ mb: 1 }}>
                      Chức danh
                    </FormLabel>
                    <Select
                      {...field}
                      id="position_id"
                      displayEmpty
                      disabled={isLoadingPositions}
                    >
                      <MenuItem value="">
                        <em>Chọn chức danh</em>
                      </MenuItem>
                      {positions?.map((position) => (
                        <MenuItem key={position.id} value={position.id}>
                          {position.title}
                        </MenuItem>
                      ))}
                    </Select>
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
                name="start_date"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1 }}>Ngày bắt đầu làm việc</FormLabel>
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
                            placeholder: "Chọn ngày bắt đầu làm việc",
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

