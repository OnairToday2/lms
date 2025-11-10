import { EmployeeType } from "@/model/employee.model";
import { Gender } from "@/model/profile.model";
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
  profile: {
    fullName?: string;
    avatarUrl?: string;
    email?: string;
    gender: Gender;
  } | null;
}
export type { UserOrganization };
