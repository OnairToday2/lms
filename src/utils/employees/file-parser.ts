export function normalizeHeader(header: string): string {
  return header.replace("*", "").trim();
}

export function mapHeaderToFieldKey(headerName: string): string {
  const mapping: Record<string, string> = {
    "Mã nhân viên": "employee_code",
    "Họ và tên": "full_name",
    "Họ tên": "full_name",
    "Email": "email",
    "Số điện thoại": "phone_number",
    "Giới tính": "gender",
    "Ngày sinh": "birthday",
    "Phòng ban": "department",
    "Chi nhánh": "branch",
    "Ngày bắt đầu": "start_date",
    "Chức vụ": "position",
    "Người quản lý": "manager",
    "Vai trò": "role",
  };

  return mapping[headerName] || headerName.toLowerCase().replace(/\s+/g, "_");
}

export function isRowEmpty(row: any): boolean {
  const values = Object.values(row);

  return values.every(value => {
    if (value === null || value === undefined) {
      return true;
    }
    const stringValue = String(value).trim();
    return stringValue === "";
  });
}

export function parseCSVOnServer(text: string): any[] {
  const lines = text.split("\n").filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error("File CSV rỗng");
  }

  const rawHeaders = lines[0].split(",").map(h => h.trim());
  const normalizedHeaders = rawHeaders.map(normalizeHeader);
  const fieldKeys = normalizedHeaders.map(mapHeaderToFieldKey);

  console.log("CSV Headers:", {
    raw: rawHeaders,
    normalized: normalizedHeaders,
    fieldKeys: fieldKeys,
  });

  const data: any[] = [];
  let emptyRowCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row: any = {};

    // Map values to field keys
    fieldKeys.forEach((fieldKey, index) => {
      row[fieldKey] = values[index]?.trim() || "";
    });

    // Skip completely empty rows
    if (isRowEmpty(row)) {
      emptyRowCount++;
      // console.log(`Skipping empty row at line ${i + 1}`);
      continue;
    }

    data.push(row);
  }

  console.log(`CSV parsing complete: ${data.length} data rows, ${emptyRowCount} empty rows skipped`);

  return data;
}

export async function parseXLSXOnServer(buffer: ArrayBuffer): Promise<any[]> {
  try {
    // Dynamic import of xlsx
    const XLSX = await import("xlsx");

    // Read the workbook
    const workbook = XLSX.read(buffer, { type: "array" });

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("File Excel không chứa sheet nào");
    }

    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, rawNumbers: false }) as any[][];

    console.log("jsonDatajsonData1", jsonData);

    if (jsonData.length === 0) {
      throw new Error("File Excel rỗng");
    }

    // First row contains headers
    const rawHeaders = jsonData[0] as string[];
    const normalizedHeaders = rawHeaders.map(normalizeHeader);
    const fieldKeys = normalizedHeaders.map(mapHeaderToFieldKey);

    console.log("Excel Headers:", {
      raw: rawHeaders,
      normalized: normalizedHeaders,
      fieldKeys: fieldKeys,
    });

    // Parse data rows
    const data: any[] = [];

    for (let i = 1; i < jsonData.length; i++) {
      const values = jsonData[i];
      const row: any = {};

      // Map values to field keys
      fieldKeys.forEach((fieldKey, index) => {
        const value = values[index];
        row[fieldKey] = value !== undefined && value !== null ? String(value).trim() : "";
      });

      data.push(row);
    }

    console.log(`Excel parsing complete: ${data.length} data rows`);

    return data;
  } catch (error) {
    console.error("Error parsing XLSX:", error);
    if (error instanceof Error && error.message.includes("Cannot find module")) {
      throw new Error(
        "Không thể đọc file XLSX. Vui lòng cài đặt thư viện xlsx:\n" +
        "npm install xlsx",
      );
    }
    throw error;
  }
}

