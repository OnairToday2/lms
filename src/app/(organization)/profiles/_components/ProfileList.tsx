"use client";

import * as React from "react";
import { useGetProfilesQuery } from "@/modules/profiles/operations/query";

export default function ProfileList() {
  const { data } = useGetProfilesQuery();

  return (
    <p>Profile</p>
  );
}
