import { PaginationParams } from "../pagination.dto";

export class GetEmployeesParams extends PaginationParams {
  search?: string;
  departmentId?: string;
}

