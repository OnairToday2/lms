"use client";
import { useClassRoomFormContext } from "../ClassRoomFormContainer";
import SingleSession from "./SingleSession";
import MultipleSession from "./MultipleSession";
import { ClassRoom } from "../../classroom-form.schema";

export const initClassSessionFormData = (init?: { isOnline?: boolean }): ClassRoom["classRoomSessions"][number] => {
  return {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    channelInfo: { url: "", password: "", providerId: "" },
    channelProvider: "zoom",
    thumbnailUrl: "",
    isOnline: init?.isOnline || false,
    agendas: [],
    limitPerson: 0,
    isUnlimited: false,
    resources: [],
    isLimitTimeScanQrCode: false,
    qrCode: { startDate: "", endDate: "" },
  };
};

const TabClassRoomSession = () => {
  const methods = useClassRoomFormContext();
  const { getValues } = methods;
  const classRoomType = getValues("roomType");

  return (
    <div>
      {classRoomType === "single" ? <SingleSession methods={methods} /> : null}
      {classRoomType === "multiple" ? <MultipleSession methods={methods} /> : null}
    </div>
  );
};
export default TabClassRoomSession;
