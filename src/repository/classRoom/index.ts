import { supabase } from "@/services";
import {
  CreateClassRoomPayload,
  CreateClassRoomSessionsPayload,
  CreatePivotClassRoomAndHashTagPayload,
  CreatePivotClassRoomAndFieldPayload,
  CreateAgendasWithSessionPayload,
  CreateClassRoomMetaPayload,
  CreatePivotClassSessionAndTeacherPayload,
  GetClassRoomMetaQueryParams,
  CreatePivotClassRoomAndEmployeePayload,
  CreateQRCodePayload,
  QRCodeValidationResult,
  AttendanceCheckInPayload,
  AttendanceCheckInResult,
  UpdateQRCodePayload,
} from "./type";
export * from "./type";
import type { QRCodeStatus, QRCodeWithRelations, AttendanceWithRelations } from "@/model/qr-attendance.model";

const getClassFieldList = async () => {
  return await supabase.from("class_fields").select("*");
};

const getClassHasTagList = async () => {
  return await supabase.from("hash_tags").select("*");
};

const createClassRoom = async (payload: CreateClassRoomPayload) => {
  try {
    return await supabase.from("class_rooms").insert(payload).select().single();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

const createPivotClassRoomAndHashTag = async (payload: CreatePivotClassRoomAndHashTagPayload[]) => {
  return await supabase.from("class_hash_tag").insert(payload).select("*");
};

const createPivotClassRoomAndField = async (payload: CreatePivotClassRoomAndFieldPayload[]) => {
  try {
    return await supabase.from("class_room_field").insert(payload).select("*");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Room");
  }
};

const createClassSession = async (payload: CreateClassRoomSessionsPayload) => {
  try {
    const sessionInsertPayload = payload.sessions.map((session) => ({
      ...session,
      class_room_id: payload.classRoomId,
    }));
    return await supabase.from("class_sessions").insert(sessionInsertPayload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error craete Sessions");
  }
};

const createAgendasWithSession = async (payload: CreateAgendasWithSessionPayload[]) => {
  try {
    return await supabase.from("class_sessions_agendas").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Agendas");
  }
};

const createPivotClassSessionAndTeacher = async (payload: CreatePivotClassSessionAndTeacherPayload[]) => {
  try {
    return await supabase.from("class_session_teacher").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Pivot Session and Teacher");
  }
};

const createPivotClassRoomAndEmployee = async (payload: CreatePivotClassRoomAndEmployeePayload[]) => {
  try {
    return await supabase.from("class_room_employee").insert(payload).select();
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err.message ?? "Unknown error create Class Room and Employee");
  }
};

/**
 * For Class Room Meta data content
 */
const createClassRoomMeta = async (payload: CreateClassRoomMetaPayload[]) => {
  try {
    return await supabase.from("class_room_metadata").insert(payload).select("*");
  } catch (err: any) {
    console.error("Unexpected error:", err);
    throw new Error(err?.message ?? "Unknown error craete Class Meta");
  }
};

const getClassRoomMeta = async (params: GetClassRoomMetaQueryParams) => {
  const { class_room_id, key } = params;
  if (!class_room_id) throw new Error("Missing class_room_id");

  let classRoomMetaQuery = supabase
    .from("class_room_metadata")
    .select(
      `
        id, 
        value, 
        key, 
        class_rooms!inner(
          id, 
          title
        )
      `,
    )
    .eq("class_rooms.id", class_room_id);
  if (key) {
    classRoomMetaQuery = classRoomMetaQuery.eq("key", key);
  }
  return await classRoomMetaQuery;
};

const generateQRCode = (): { qrCode: string; qrSecret: string } => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  const qrCode = `QR-${timestamp}-${randomStr}`;
  const qrSecret = `${Math.random().toString(36)}${Math.random().toString(36)}`.substring(2);
  return { qrCode, qrSecret };
};

const createClassQRCode = async (payload: CreateQRCodePayload) => {
  try {
    // phải có class_room_id hoặc class_session_id
    if (!payload.class_room_id && !payload.class_session_id) {
      throw new Error("Phải cung cấp class_room_id hoặc class_session_id");
    }

    // không được có cả hai
    if (payload.class_room_id && payload.class_session_id) {
      throw new Error("Không thể có cả class_room_id và class_session_id");
    }

    const { qrCode, qrSecret } = generateQRCode();

    const insertPayload = {
      ...payload,
      qr_code: qrCode,
      qr_secret: qrSecret,
      status: "inactive" as QRCodeStatus,
      is_enabled: false,
      allowed_radius_meters: 200,
    };

    const { data, error } = await supabase
      .from("class_qr_codes")
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (err: any) {
    console.error("Error creating QR code:", err);
    return { data: null, error: err.message || "Lỗi khi tạo QR code" };
  }
};

const getQRCodeById = async (qrCodeId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_qr_codes")
      .select(
        `
        *,
        class_rooms (id, title, start_at, end_at),
        class_sessions (id, title, start_at, end_at)
      `
      )
      .eq("id", qrCodeId)
      .single();

    if (error) throw error;
    return { data: data as QRCodeWithRelations, error: null };
  } catch (err: any) {
    console.error("Error getting QR code:", err);
    return { data: null, error: err.message };
  }
};

const getQRCodesByClassRoom = async (classRoomId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_qr_codes")
      .select(
        `
        *,
        class_rooms (id, title, start_at, end_at)
      `
      )
      .eq("class_room_id", classRoomId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: (data as QRCodeWithRelations[]) || [], error: null };
  } catch (err: any) {
    console.error("Error getting QR codes by class room:", err);
    return { data: [], error: err.message };
  }
};

const getQRCodesBySession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_qr_codes")
      .select(
        `
        *,
        class_sessions (id, title, start_at, end_at)
      `
      )
      .eq("class_session_id", sessionId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data: (data as QRCodeWithRelations[]) || [], error: null };
  } catch (err: any) {
    console.error("Error getting QR codes by session:", err);
    return { data: [], error: err.message };
  }
};

const activateQRCode = async (qrCodeId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_qr_codes")
      .update({
        status: "active" as QRCodeStatus,
        is_enabled: true,
      })
      .eq("id", qrCodeId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error("Error activating QR code:", err);
    return { data: null, error: err.message || "Lỗi khi kích hoạt QR code" };
  }
};

const deactivateQRCode = async (qrCodeId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_qr_codes")
      .update({
        status: "disabled" as QRCodeStatus,
        is_enabled: false,
      })
      .eq("id", qrCodeId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error("Error deactivating QR code:", err);
    return { data: null, error: err.message || "Lỗi khi vô hiệu hóa QR code" };
  }
};

const validateQRCode = async (qrCode: string): Promise<QRCodeValidationResult> => {
  try {
    const { data, error } = await supabase.rpc("is_qr_code_valid", {
      p_qr_code: qrCode,
      p_current_time: new Date().toISOString(),
    });

    if (error) throw error;

    return data?.[0] || { is_valid: false, message: "QR code không hợp lệ" };
  } catch (err: any) {
    console.error("Error validating QR code:", err);
    return { is_valid: false, message: err.message || "Lỗi khi kiểm tra QR code" };
  }
};

const checkInWithQR = async (payload: AttendanceCheckInPayload): Promise<AttendanceCheckInResult> => {
  try {
    // 1. Validate QR code
    const validation = await validateQRCode(payload.qr_code);
    if (!validation.is_valid) {
      return {
        success: false,
        message: validation.message,
        rejection_reason: validation.message,
      };
    }

    // 2. Lấy thông tin QR code
    const { data: qrCode, error: qrError } = await supabase
      .from("class_qr_codes")
      .select(
        `
        *,
        class_rooms (id),
        class_sessions (id)
      `
      )
      .eq("qr_code", payload.qr_code)
      .single();

    if (qrError || !qrCode) {
      return {
        success: false,
        message: "Không tìm thấy QR code",
        rejection_reason: "QR code không tồn tại",
      };
    }

    // 3. Lấy class_room_id từ qrCode hoặc từ session
    let classRoomId = qrCode.class_room_id;
    
    if (!classRoomId && qrCode.class_session_id) {
      // Nếu là session, lấy class_room_id từ session
      const { data: session } = await supabase
        .from("class_sessions")
        .select("class_room_id")
        .eq("id", qrCode.class_session_id)
        .single();
      
      classRoomId = session?.class_room_id || null;
    }

    if (!classRoomId) {
      return {
        success: false,
        message: "Không xác định được lớp học",
        rejection_reason: "Lỗi dữ liệu",
      };
    }

    // 4. Kiểm tra học viên có trong danh sách lớp không
    const { data: enrollment, error: enrollError } = await supabase
      .from("class_room_employee")
      .select("*")
      .eq("class_room_id", classRoomId)
      .eq("employee_id", payload.employee_id)
      .single();

    if (enrollError || !enrollment) {
      return {
        success: false,
        message: "Bạn không có trong danh sách lớp học này",
        rejection_reason: "Không có trong danh sách",
      };
    }

    // 5. Kiểm tra đã điểm danh chưa
    const { data: existingAttendance } = await supabase
      .from("class_attendances")
      .select("*")
      .eq("qr_code_id", qrCode.id)
      .eq("employee_id", payload.employee_id)
      .maybeSingle();

    if (existingAttendance) {
      return {
        success: false,
        message: "Bạn đã điểm danh rồi",
        rejection_reason: "Đã điểm danh",
      };
    }

    // 6. Tạo bản ghi điểm danh
    const attendancePayload = {
      qr_code_id: qrCode.id,
      employee_id: payload.employee_id,
      class_room_id: qrCode.class_room_id,
      class_session_id: qrCode.class_session_id,
      attendance_status: "present" as const,
      device_info: payload.device_info,
    };

    const { data: attendance, error: attendanceError } = await supabase
      .from("class_attendances")
      .insert(attendancePayload)
      .select()
      .single();

    if (attendanceError) throw attendanceError;

    return {
      success: true,
      message: "Điểm danh thành công",
      attendance: attendance as any,
    };
  } catch (err: any) {
    console.error("Error checking in with QR:", err);
    return {
      success: false,
      message: "Có lỗi xảy ra khi điểm danh",
      rejection_reason: err.message,
    };
  }
};

const getAttendancesByClassRoom = async (classRoomId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_attendances")
      .select(
        `
        *,
        employees (id, employee_code, user_id),
        class_qr_codes (id, title, qr_code)
      `
      )
      .eq("class_room_id", classRoomId)
      .order("attended_at", { ascending: false });

    if (error) throw error;
    return { data: (data as unknown as AttendanceWithRelations[]) || [], error: null };
  } catch (err: any) {
    console.error("Error getting attendances by class room:", err);
    return { data: [], error: err.message };
  }
};

const getAttendancesBySession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_attendances")
      .select(
        `
        *,
        employees (id, employee_code, user_id),
        class_qr_codes (id, title, qr_code)
      `
      )
      .eq("class_session_id", sessionId)
      .order("attended_at", { ascending: false });

    if (error) throw error;
    return { data: (data as unknown as AttendanceWithRelations[]) || [], error: null };
  } catch (err: any) {
    console.error("Error getting attendances by session:", err);
    return { data: [], error: err.message };
  }
};

const getAttendancesByEmployee = async (employeeId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_attendances")
      .select(
        `
        *,
        class_rooms (id, title),
        class_sessions (id, title),
        class_qr_codes (id, title)
      `
      )
      .eq("employee_id", employeeId)
      .order("attended_at", { ascending: false });

    if (error) throw error;
    return { data: (data as unknown as AttendanceWithRelations[]) || [], error: null };
  } catch (err: any) {
    console.error("Error getting attendances by employee:", err);
    return { data: [], error: err.message };
  }
};

const updateQRCode = async (qrCodeId: string, updates: UpdateQRCodePayload) => {
  try {
    const { data, error } = await supabase
      .from("class_qr_codes")
      .update(updates)
      .eq("id", qrCodeId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error("Error updating QR code:", err);
    return { data: null, error: err.message || "Lỗi khi cập nhật QR code" };
  }
};

const deleteQRCode = async (qrCodeId: string) => {
  try {
    const { error } = await supabase.from("class_qr_codes").delete().eq("id", qrCodeId);

    if (error) throw error;
    return { error: null };
  } catch (err: any) {
    console.error("Error deleting QR code:", err);
    return { error: err.message || "Lỗi khi xóa QR code" };
  }
};

const getAttendanceStatsByQRCode = async (qrCodeId: string) => {
  try {
    const { data, error } = await supabase
      .from("class_attendances")
      .select("attendance_status")
      .eq("qr_code_id", qrCodeId);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      present: data?.filter((a) => a.attendance_status === "present").length || 0,
      late: data?.filter((a) => a.attendance_status === "late").length || 0,
      absent: data?.filter((a) => a.attendance_status === "absent").length || 0,
      rejected: data?.filter((a) => a.attendance_status === "rejected").length || 0,
    };

    return { data: stats, error: null };
  } catch (err: any) {
    console.error("Error getting attendance stats:", err);
    return {
      data: { total: 0, present: 0, late: 0, absent: 0, rejected: 0 },
      error: err.message,
    };
  }
};


export {
  getClassFieldList,
  getClassHasTagList,
  createClassRoom,
  createClassSession,
  createPivotClassSessionAndTeacher,
  createPivotClassRoomAndHashTag,
  createPivotClassRoomAndField,
  createAgendasWithSession,
  createPivotClassRoomAndEmployee,
  createClassRoomMeta,
  getClassRoomMeta,
  generateQRCode,
  createClassQRCode,
  getQRCodeById,
  getQRCodesByClassRoom,
  getQRCodesBySession,
  activateQRCode,
  deactivateQRCode,
  validateQRCode,
  checkInWithQR,
  getAttendancesByClassRoom,
  getAttendancesBySession,
  getAttendancesByEmployee,
  updateQRCode,
  deleteQRCode,
  getAttendanceStatsByQRCode,
};
