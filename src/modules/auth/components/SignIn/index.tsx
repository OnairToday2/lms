"use client";
import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import SignInFormClient, { SignInFormClientProps } from "./SignInFormClient";
import AuthCard from "../AuthCard";
import GoogleSignInButton from "../GoogleSignInButton";
import FacebookSignInButton from "../FacebookSignInButton";

import { useAuthSignInWithPassword } from "../../hooks/useAuthSignIn";

export default function SignIn() {
  const { signInWithPassword, isPending } = useAuthSignInWithPassword();
  const handleLogin: SignInFormClientProps["onSubmit"] = async ({
    email,
    password,
  }) => {
    signInWithPassword({ email, password });
  };
  return (
    <AuthCard title="Đăng nhập">
      <SignInFormClient onSubmit={handleLogin} isSubmitting={isPending} />
      <Link type="button" href={"/"}>
        Quên mật khẩu?
      </Link>
      <Divider>Hoặc</Divider>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <GoogleSignInButton
          buttonText="Đăng nhập với Google"
          disabled={isPending}
        />
        <FacebookSignInButton />
        <Typography sx={{ textAlign: "center" }}>
          Bạn chưa có tài khoản? <Link href="/auth/signup">Đăng ký</Link>
        </Typography>
      </Box>
    </AuthCard>
  );
}
