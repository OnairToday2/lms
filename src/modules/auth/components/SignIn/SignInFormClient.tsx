"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { SignInSchema, TSignInForm } from "./schema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export interface SignInFormClientProps {
  onSubmit?: (data: TSignInForm) => void;
  isSubmitting?: boolean;
}
const SignInFormClient: React.FC<SignInFormClientProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInForm>({
    defaultValues: { password: "", email: "" },
    resolver: zodResolver(SignInSchema),
  });
  const submitForm: SubmitHandler<TSignInForm> = (formdata) => {
    onSubmit?.(formdata);
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              {...field}
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={!!error}
              helperText={error?.message}
              color={error ? "error" : "primary"}
            />
          </FormControl>
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <FormLabel htmlFor="password">Mật khẩu</FormLabel>
            <TextField
              {...field}
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={!!error}
              helperText={error?.message}
              color={error ? "error" : "primary"}
            />
          </FormControl>
        )}
      />
      <div className="h-1"></div>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        loading={isSubmitting}
      >
        Đăng nhập
      </Button>
    </Box>
  );
};

export default SignInFormClient;
