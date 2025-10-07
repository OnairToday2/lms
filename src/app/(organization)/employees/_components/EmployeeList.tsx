"use client";

import * as React from "react";
import { useGetEmployeesQuery } from "@/modules/employees/operations/query";

export default function EmployeeList() {
  const { data } = useGetEmployeesQuery();

  return (
    <p>Profile</p>
  );
}
