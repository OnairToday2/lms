/**
 * File Parser Utilities
 * 
 * This module provides utilities for parsing CSV and Excel files
 * for employee import functionality.
 */

/**
 * Normalize header name by removing asterisk and trimming
 * @param header - Raw header from CSV/Excel
 * @returns Normalized header name
 */
export function normalizeHeader(header: string): string {
  return header.replace('*', '').trim();
}

/**
 * Map Vietnamese header names to internal field keys
 * @param headerName - Normalized header name
 * @returns Internal field key
 */
export function mapHeaderToFieldKey(headerName: string): string {
  const mapping: Record<string, string> = {
    'Mã nhân viên': 'employee_code',
    'Họ và tên': 'fullName',
    'Họ tên': 'fullName',
    'Email': 'email',
    'Số điện thoại': 'phoneNumber',
    'Giới tính': 'gender',
    'Ngày sinh': 'birthday',
    'Phòng ban': 'department',
    'Chi nhánh': 'branch',
    'Ngày bắt đầu': 'start_date',
    'Chức vụ': 'position',
    'Người quản lý': 'manager',
    'Vai trò': 'role',
  };
  
  return mapping[headerName] || headerName.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Parse CSV text on the server with header mapping
 * 
 * @param text - CSV file content as text
 * @returns Array of parsed records with mapped field keys
 * @throws Error if CSV is empty
 */
export function parseCSVOnServer(text: string): any[] {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error("File CSV rỗng");
  }

  // Get headers and normalize them
  const rawHeaders = lines[0].split(',').map(h => h.trim());
  const normalizedHeaders = rawHeaders.map(normalizeHeader);
  const fieldKeys = normalizedHeaders.map(mapHeaderToFieldKey);
  
  console.log("CSV Headers:", {
    raw: rawHeaders,
    normalized: normalizedHeaders,
    fieldKeys: fieldKeys,
  });

  const data: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row: any = {};
    
    // Map values to field keys
    fieldKeys.forEach((fieldKey, index) => {
      row[fieldKey] = values[index]?.trim() || '';
    });
    
    data.push(row);
  }

  return data;
}

/**
 * Parse XLSX buffer on the server
 * Uses the xlsx package to read Excel files
 * 
 * @param buffer - ArrayBuffer containing Excel file data
 * @returns Array of parsed records with mapped field keys
 * @throws Error if Excel is empty or xlsx package is not installed
 */
export async function parseXLSXOnServer(buffer: ArrayBuffer): Promise<any[]> {
  try {
    // Dynamic import of xlsx
    const XLSX = await import('xlsx');
    
    // Read the workbook
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error("File Excel không chứa sheet nào");
    }
    
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
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
        row[fieldKey] = value !== undefined && value !== null ? String(value).trim() : '';
      });
      
      data.push(row);
    }
    
    return data;
  } catch (error) {
    console.error("Error parsing XLSX:", error);
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      throw new Error(
        'Không thể đọc file XLSX. Vui lòng cài đặt thư viện xlsx:\n' +
        'npm install xlsx'
      );
    }
    throw error;
  }
}

