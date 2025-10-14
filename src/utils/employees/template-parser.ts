export interface TemplateColumn {
  /** Original header name from Excel (e.g., "Mã nhân viên*") */
  headerName: string;
  /** Clean field name without asterisk (e.g., "Mã nhân viên") */
  fieldName: string;
  /** Internal field key for data mapping (e.g., "employee_code") */
  fieldKey: string;
  /** Whether this field is required (has asterisk in header) */
  required: boolean;
  /** Column width for DataGrid display */
  width?: number;
}

export interface TemplateStructure {
  /** List of all columns in the template */
  columns: TemplateColumn[];
  /** List of required field keys */
  requiredFields: string[];
  /** Map of header names to field keys */
  headerToKeyMap: Record<string, string>;
  /** Map of field keys to header names */
  keyToHeaderMap: Record<string, string>;
}

/**
 * Default template structure (fallback if template file cannot be read)
 * This matches the current implementation
 */
export const DEFAULT_TEMPLATE_STRUCTURE: TemplateStructure = {
  columns: [
    {
      headerName: "Mã nhân viên",
      fieldName: "Mã nhân viên",
      fieldKey: "employee_code",
      required: false,
      width: 150,
    },
    {
      headerName: "Họ và tên*",
      fieldName: "Họ và tên",
      fieldKey: "fullName",
      required: true,
      width: 200,
    },
    {
      headerName: "Email*",
      fieldName: "Email",
      fieldKey: "email",
      required: true,
      width: 250,
    },
    {
      headerName: "Số điện thoại",
      fieldName: "Số điện thoại",
      fieldKey: "phoneNumber",
      required: false,
      width: 150,
    },
    {
      headerName: "Giới tính",
      fieldName: "Giới tính",
      fieldKey: "gender",
      required: false,
      width: 120,
    },
    {
      headerName: "Ngày sinh",
      fieldName: "Ngày sinh",
      fieldKey: "birthday",
      required: false,
      width: 130,
    },
    {
      headerName: "Phòng ban*",
      fieldName: "Phòng ban",
      fieldKey: "department",
      required: true,
      width: 180,
    },
    {
      headerName: "Chi nhánh",
      fieldName: "Chi nhánh",
      fieldKey: "branch",
      required: false,
      width: 150,
    },
    {
      headerName: "Ngày bắt đầu",
      fieldName: "Ngày bắt đầu",
      fieldKey: "start_date",
      required: false,
      width: 130,
    },
  ],
  requiredFields: ["employee_code", "fullName", "email", "department"],
  headerToKeyMap: {
    "Mã nhân viên": "employee_code",
    "Họ và tên": "fullName",
    "Email": "email",
    "Số điện thoại": "phoneNumber",
    "Giới tính": "gender",
    "Ngày sinh": "birthday",
    "Phòng ban": "department",
    "Chi nhánh": "branch",
    "Ngày bắt đầu": "start_date",
  },
  keyToHeaderMap: {
    "employee_code": "Mã nhân viên",
    "fullName": "Họ và tên",
    "email": "Email",
    "phoneNumber": "Số điện thoại",
    "gender": "Giới tính",
    "birthday": "Ngày sinh",
    "department": "Phòng ban",
    "branch": "Chi nhánh",
    "start_date": "Ngày bắt đầu",
  },
};
