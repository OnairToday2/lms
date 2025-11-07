"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import { Html5Qrcode } from "html5-qrcode";
import { useCheckInWithQRMutation } from "@/modules/class-room-management/operation/qr-attendance";
import { fDateTime } from "@/lib";

interface QRScannerDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  classRoomId?: string;
  sessionId?: string;
  classTitle?: string;
  sessionTitle?: string;
}

type CheckinStatus = "idle" | "scanning" | "success" | "error" | "warning";

interface CheckinResult {
  status: CheckinStatus;
  message?: string;
  data?: {
    fullName?: string;
    classCode?: string;
    checkinTime?: string;
  };
}

const QRScannerDialog: React.FC<QRScannerDialogProps> = ({
  open,
  onClose,
  employeeId,
  classRoomId,
  sessionId,
  classTitle,
  sessionTitle,
}) => {
  const [scannerStatus, setScannerStatus] = useState<CheckinStatus>("idle");
  const [checkinResult, setCheckinResult] = useState<CheckinResult>({ status: "idle" });
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { mutateAsync: checkInWithQR, isPending } = useCheckInWithQRMutation();

  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error("Failed to stop scanner:", error);
      }
    }
  }, [isScanning]);

  const onScanSuccess = useCallback(async (decodedText: string) => {
    // Prevent multiple scans while processing
    if (isProcessing) {
      return;
    }

    // Set processing flag immediately
    setIsProcessing(true);

    try {
      // Validate QR code format BEFORE calling API
      // Expected format: QR-{timestamp}-{random} (e.g., "QR-123456789-abc123")
      if (!decodedText.startsWith("QR-")) {
        // Stop scanner for invalid QR
        await stopScanner();
        setCheckinResult({
          status: "warning",
          message: "Mã QR không đúng định dạng lớp học. Vui lòng quét mã QR của lớp học.",
        });
        setScannerStatus("warning");
        setIsProcessing(false);
        return;
      }

      // Stop scanning after valid QR detected
      await stopScanner();

      // Get current location
      const deviceInfo: any = {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          });

          deviceInfo.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
        } catch (geoError) {
          console.warn("Could not get location:", geoError);
        }
      }

      // Call check-in API
      const result = await checkInWithQR({
        qr_code: decodedText,
        employee_id: employeeId,
        device_info: deviceInfo,
      });

      if (result.success && result.attendance) {
        // Validate that scanned QR matches expected classroom/session
        const qrClassRoomId = result.attendance.class_room_id;
        const qrSessionId = result.attendance.class_session_id;
        
        // If we expect a specific classroom or session, validate it matches
        if (classRoomId && qrClassRoomId !== classRoomId) {
          setCheckinResult({
            status: "warning",
            message: "Mã QR này không thuộc lớp học bạn đang chọn",
          });
          setScannerStatus("warning");
          return;
        }
        
        if (sessionId && qrSessionId !== sessionId) {
          setCheckinResult({
            status: "warning",
            message: "Mã QR này không thuộc buổi học bạn đang chọn",
          });
          setScannerStatus("warning");
          return;
        }

        setCheckinResult({
          status: "success",
          message: result.message,
          data: {
            fullName: result.attendance.employee_id || "N/A",
            classCode: classTitle || "N/A",
            checkinTime: result.attendance.attended_at || new Date().toISOString(),
          },
        });
        setScannerStatus("success");
      } else {
        // Handle different error types
        const errorMessage = result.message || result.rejection_reason || "Điểm danh thất bại";
        
        if (errorMessage.includes("hết hạn") || errorMessage.includes("hết giờ")) {
          setCheckinResult({
            status: "error",
            message: "Mã QR đã hết hiệu lực",
          });
        } else if (errorMessage.includes("không hợp lệ") || errorMessage.includes("không tồn tại")) {
          setCheckinResult({
            status: "warning",
            message: "Mã QR không hợp lệ",
          });
        } else {
          setCheckinResult({
            status: "error",
            message: errorMessage,
          });
        }
        setScannerStatus("error");
      }
    } catch (error: any) {
      console.error("Check-in error:", error);
      setCheckinResult({
        status: "error",
        message: "Checkin thất bại. Vui lòng thử lại.",
      });
      setScannerStatus("error");
    }
  }, [checkInWithQR, employeeId, isProcessing, stopScanner, classRoomId, sessionId, classTitle]);

  const onScanFailure = useCallback((error: string) => {
    // Ignore scanning errors (they happen frequently during normal scanning)
    // Only log critical errors
    if (!error.includes("NotFoundException")) {
      console.debug("Scan error:", error);
    }
  }, []);

  const startScanning = useCallback(async () => {
    if (!scannerRef.current || isScanning) return;

    try {
      setIsScanning(true);
      setScannerStatus("scanning");

      await scannerRef.current.start(
        { facingMode: facingMode },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (error) {
      console.error("Failed to start scanning:", error);
      setIsScanning(false);
      setCheckinResult({
        status: "error",
        message: "Không thể bật camera. Vui lòng kiểm tra quyền truy cập.",
      });
    }
  }, [facingMode, isScanning, onScanFailure, onScanSuccess]);

  const initializeScanner = useCallback(async () => {
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      await startScanning();
    } catch (error) {
      console.error("Failed to initialize scanner:", error);
      setCheckinResult({
        status: "error",
        message: "Không thể khởi tạo camera. Vui lòng kiểm tra quyền truy cập camera.",
      });
      setScannerStatus("error");
    }
  }, [startScanning]);

  // Initialize scanner when dialog opens
  useEffect(() => {
    if (open) {
      // Set status to scanning first to render the DOM element
      setScannerStatus("scanning");
      
      // Initialize scanner after DOM is rendered
      const timer = setTimeout(() => {
        initializeScanner();
      }, 100);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current && isScanning) {
          stopScanner();
        }
      };
    } else {
      // Reset state when dialog closes
      setScannerStatus("idle");
      setCheckinResult({ status: "idle" });
      setIsProcessing(false);
    }
  }, [open, initializeScanner, isScanning, stopScanner]);

  const handleSwitchCamera = async () => {
    await stopScanner();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setTimeout(() => {
      startScanning();
    }, 100);
  };

  const handleClose = async () => {
    await stopScanner();
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setCheckinResult({ status: "idle" });
    setScannerStatus("idle");
    setIsScanning(false);
    setIsProcessing(false);
    onClose();
  };

  const handleRescan = async () => {
    setCheckinResult({ status: "idle" });
    setIsProcessing(false);
    
    // Ensure scanner is fully stopped before restarting
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        // Scanner might already be stopped, ignore error
        console.log("Scanner already stopped:", error);
      }
    }
    setScannerStatus("scanning");
    setTimeout(() => {
      startScanning();
    }, 100);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableAutoFocus
      disableEnforceFocus
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Quét mã QR lớp học
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Class/Session Info */}
        {(classTitle || sessionTitle) && scannerStatus === "scanning" && (
          <Box mb={2} p={2} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="body2" color="text.secondary" fontWeight="600">
              Đang quét cho: {sessionTitle || classTitle}
            </Typography>
            {sessionId && (
              <Typography variant="caption" color="text.secondary">
                Chỉ chấp nhận mã QR của buổi học này
              </Typography>
            )}
          </Box>
        )}

        {/* Scanner Container */}
        {scannerStatus === "scanning" && (
          <Box>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "black",
              }}
            >
              <div id="qr-reader" style={{ width: "100%" }} />

              {/* Switch Camera Button */}
              <IconButton
                onClick={handleSwitchCamera}
                sx={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 1)",
                  },
                }}
              >
                <CameraswitchIcon />
              </IconButton>
            </Box>

            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Vui lòng đặt mã QR của bạn vào khung scan QR
              </Typography>
            </Box>
          </Box>
        )}

        {/* Loading State */}
        {isPending && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={4}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Đang xử lý điểm danh...
            </Typography>
          </Box>
        )}

        {/* Success Result */}
        {checkinResult.status === "success" && checkinResult.data && (
          <Box>
            <Alert
              severity="success"
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="white" fontSize="16px">
                    ✓
                  </Typography>
                </Box>
              }
              sx={{ mb: 3 }}
            >
              <AlertTitle sx={{ fontWeight: "bold" }}>Điểm danh Thành công</AlertTitle>
            </Alert>

            <Box sx={{ bgcolor: "grey.50", borderRadius: 2, p: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Họ tên
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {checkinResult.data.fullName}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Mã lớp học
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {checkinResult.data.classCode}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Thời gian điểm danh
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  {fDateTime(checkinResult.data.checkinTime)}
                </Typography>
              </Box>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleClose}>
                Đóng
              </Button>
            </Box>
          </Box>
        )}

        {/* Error Result */}
        {checkinResult.status === "error" && (
          <Box>
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle sx={{ fontWeight: "bold" }}>Error</AlertTitle>
              {checkinResult.message}
            </Alert>

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>
                Đóng
              </Button>
              <Button variant="contained" onClick={handleRescan}>
                Quét lại
              </Button>
            </Box>
          </Box>
        )}

        {/* Warning Result */}
        {checkinResult.status === "warning" && (
          <Box>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <AlertTitle sx={{ fontWeight: "bold" }}>Warning</AlertTitle>
              {checkinResult.message}
            </Alert>

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>
                Đóng
              </Button>
              <Button variant="contained" onClick={handleRescan}>
                Quét lại
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerDialog;
