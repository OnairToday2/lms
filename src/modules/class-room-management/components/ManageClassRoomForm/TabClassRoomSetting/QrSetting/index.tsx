import { Control, Controller, useFieldArray } from "react-hook-form";
import { ClassRoom } from "../../../classroom-form.schema";
import { useClassRoomFormContext } from "../../ClassRoomFormContainer";
import RHFDateTimePicker from "@/shared/ui/form/RHFDateTimePicker";
import { Android12Switch } from "@/shared/ui/form/CustomSwithcher";
import { styled, Typography, TypographyProps } from "@mui/material";
interface QrSettingProps {
  className?: string;
}
const QrSetting: React.FC<QrSettingProps> = () => {
  const { control, getValues } = useClassRoomFormContext();

  const { fields, update } = useFieldArray({
    control: control,
    name: "classRoomSessions",
    keyName: "_sessionId",
  });

  const classSessions = getValues("classRoomSessions");

  return (
    <div className="flex flex-col gap-3">
      {classSessions.map((session, _index) => (
        <SessionQrCodeConfigItem key={_index} control={control} sessionIndex={_index} title={session.title || ""} />
      ))}
    </div>
  );
};
export default QrSetting;

interface SessionQrCodeConfigItemProps {
  control: Control<ClassRoom>;
  sessionIndex: number;
  title: string;
}
const SessionQrCodeConfigItem: React.FC<SessionQrCodeConfigItemProps> = ({ control, sessionIndex, title }) => {
  return (
    <div>
      <div className="inner flex gap-6 border p-4 border-gray-200">
        <div className="flex-1 flex gap-2">
          <BoxNumberCount sx={{ marginTop: "2px" }}>{sessionIndex + 1}</BoxNumberCount>
          <Typography sx={{ fontWeight: "bold", flex: 1 }} className="line-clamp-2">
            {title}
          </Typography>
        </div>
        <Controller
          name={`classRoomSessions.${sessionIndex}.isLimitTimeScanQrCode`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Android12Switch value={value} checked={value} onChange={onChange} />
          )}
        />
        <div className="flex gap-2">
          <RHFDateTimePicker name={`classRoomSessions.${sessionIndex}.qrCode.startDate`} control={control} />
          <RHFDateTimePicker name={`classRoomSessions.${sessionIndex}.qrCode.endDate`} control={control} />
        </div>
      </div>
    </div>
  );
};
const BoxNumberCount = styled((props: TypographyProps) => <Typography {...props} component="span" />)(() => ({
  width: "1.25rem",
  height: "1.25rem",
  background: "#7B61FF",
  display: "inline-flex",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "5px",
  fontWeight: "bold",
  color: "white",
  fontSize: "0.75rem",
}));
