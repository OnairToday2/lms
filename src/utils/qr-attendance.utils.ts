export interface QRCodeTimeValidation {
  valid_from: string | Date;
  valid_until: string | Date;
  checkin_start_time: string | Date;
  checkin_end_time: string | Date;
  class_start_at?: string | Date;
  class_end_at?: string | Date;
}

export interface TimeValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateQRCodeTimes = (data: QRCodeTimeValidation): TimeValidationResult => {
  const errors: string[] = [];

  const validFrom = new Date(data.valid_from);
  const validUntil = new Date(data.valid_until);
  const checkinStart = new Date(data.checkin_start_time);
  const checkinEnd = new Date(data.checkin_end_time);

  // 1. Validate valid_from < valid_until
  if (validFrom >= validUntil) {
    errors.push("Thời gian bắt đầu hiệu lực phải nhỏ hơn thời gian kết thúc hiệu lực");
  }

  // 2. Validate checkin_start_time < checkin_end_time
  if (checkinStart >= checkinEnd) {
    errors.push("Thời gian bắt đầu check-in phải nhỏ hơn thời gian kết thúc check-in");
  }

  // 3. Validate checkin_start_time >= valid_from
  if (checkinStart < validFrom) {
    errors.push("Thời gian bắt đầu check-in phải sau hoặc bằng thời gian bắt đầu hiệu lực");
  }

  // 4. Validate checkin_end_time <= valid_until
  if (checkinEnd > validUntil) {
    errors.push("Thời gian kết thúc check-in phải trước hoặc bằng thời gian kết thúc hiệu lực");
  }

  // 5. Validate với thời gian lớp học/buổi học (nếu có)
  if (data.class_start_at && data.class_end_at) {
    const classStart = new Date(data.class_start_at);
    const classEnd = new Date(data.class_end_at);

    // checkin_start_time >= class_start_at - 60 minutes
    const minCheckinStart = new Date(classStart.getTime() - 60 * 60 * 1000);
    if (checkinStart < minCheckinStart) {
      errors.push("Thời gian bắt đầu check-in phải sau thời gian bắt đầu lớp/buổi học ít nhất 60 phút");
    }

    // checkin_end_time <= class_end_at
    if (checkinEnd > classEnd) {
      errors.push("Thời gian kết thúc check-in phải trước hoặc bằng thời gian kết thúc lớp/buổi học");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};


export const generateDefaultQRCodeTimes = (classStartAt: string | Date, classEndAt: string | Date) => {
  const classStart = new Date(classStartAt);
  const classEnd = new Date(classEndAt);

  // QR hiệu lực từ 1 giờ trước lớp học đến khi lớp kết thúc
  const validFrom = new Date(classStart.getTime() - 60 * 60 * 1000);
  const validUntil = classEnd;

  // Check-in bắt đầu từ 30 phút trước lớp, kết thúc sau 1 giờ kể từ khi lớp bắt đầu
  const checkinStart = new Date(classStart.getTime() - 30 * 60 * 1000);
  const checkinEnd = new Date(classStart.getTime() + 60 * 60 * 1000);

  return {
    valid_from: validFrom.toISOString(),
    valid_until: validUntil.toISOString(),
    checkin_start_time: checkinStart.toISOString(),
    checkin_end_time: checkinEnd.toISOString(),
  };
};

export const isInCheckinTime = (checkinStart: string | Date, checkinEnd: string | Date): boolean => {
  const now = new Date();
  const start = new Date(checkinStart);
  const end = new Date(checkinEnd);

  return now >= start && now <= end;
};

export const isQRCodeValid = (validFrom: string | Date, validUntil: string | Date): boolean => {
  const now = new Date();
  const from = new Date(validFrom);
  const until = new Date(validUntil);

  return now >= from && now <= until;
};

export const getRemainingCheckinTime = (checkinEnd: string | Date): number => {
  const now = new Date();
  const end = new Date(checkinEnd);
  const diff = end.getTime() - now.getTime();

  return Math.max(0, Math.floor(diff / 1000));
};

export const formatRemainingTime = (seconds: number): string => {
  if (seconds <= 0) return "Hết giờ";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const canActivateQRCode = (
  checkinStart: string | Date,
  minutesBeforeCheckin: number = 15
): boolean => {
  const now = new Date();
  const start = new Date(checkinStart);
  const allowedActivateTime = new Date(start.getTime() - minutesBeforeCheckin * 60 * 1000);

  return now >= allowedActivateTime;
};

export const getQRCodeTimeStatus = (
  validFrom: string | Date,
  validUntil: string | Date,
  checkinStart: string | Date,
  checkinEnd: string | Date,
  currentStatus: "inactive" | "active" | "expired" | "disabled"
): {
  canActivate: boolean;
  canCheckIn: boolean;
  isExpired: boolean;
  message: string;
} => {
  const now = new Date();
  const from = new Date(validFrom);
  const until = new Date(validUntil);
  const checkStart = new Date(checkinStart);
  const checkEnd = new Date(checkinEnd);

  const isExpired = now > until;
  const isValid = now >= from && now <= until;
  const inCheckinTime = now >= checkStart && now <= checkEnd;
  const beforeCheckinTime = now < checkStart;
  const canActivate = canActivateQRCode(checkinStart) && !isExpired;
  const canCheckIn = currentStatus === "active" && isValid && inCheckinTime;

  let message = "";
  if (isExpired) {
    message = "QR code đã hết hạn";
  } else if (currentStatus === "disabled") {
    message = "QR code đã bị vô hiệu hóa";
  } else if (!isValid) {
    message = "QR code chưa đến thời gian hiệu lực";
  } else if (beforeCheckinTime) {
    message = "Chưa đến giờ check-in";
  } else if (now > checkEnd) {
    message = "Đã hết giờ check-in";
  } else if (canCheckIn) {
    message = "Đang trong giờ check-in";
  } else if (currentStatus === "inactive") {
    message = "QR code chưa được kích hoạt";
  }

  return {
    canActivate,
    canCheckIn,
    isExpired,
    message,
  };
};
