import { EmployeeType } from "@/model/employee.model";
interface UserOrganization {
  id: string;
  status: "active" | "inactive";
  employeeCode: string;
  employeeType: EmployeeType;
  userId: string;
  organization: {
    id: string;
    name: string;
    subdomain: string;
  };
}
export type { UserOrganization };
