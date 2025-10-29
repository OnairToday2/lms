"use client";
import { useLayoutEffect } from "react";
import { type ClassRoom } from "../../classroom-form.schema";
import QuantityPersonField from "./class-room-session-fields/QuantityPersonField";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import ClassRoomSessionFromToDate from "./class-room-session-fields/ClassRoomSessionFromToDate";
import TeacherSelector from "./class-room-session-fields/TeacherSelector";
import RoomChannel from "./class-room-session-fields/RoomChannel";
import AgendarFields from "./class-room-session-fields/AgendarFields";
import { initClassSessionFormData } from ".";
interface SingleSessionProps {
  methods: UseFormReturn<ClassRoom>;
}
const SingleSession: React.FC<SingleSessionProps> = ({ methods }) => {
  const { control, getValues } = methods;

  const { fields: classSessionsFields, append } = useFieldArray({
    control,
    name: "classRoomSessions",
    keyName: "_sessionId",
  });

  useLayoutEffect(() => {
    if (classSessionsFields.length) return;
    /** init one session for single type */
    const platform = getValues("platform");
    append(initClassSessionFormData({ isOnline: platform === "online" }));
  }, [classSessionsFields]);
  return (
    <div className="class-single-session">
      {classSessionsFields.map((sessionField, _index) => (
        <div key={sessionField._sessionId}>
          <div className="flex flex-col gap-6 bg-white rounded-xl p-6 mb-6">
            <ClassRoomSessionFromToDate index={_index} control={control} />
            <QuantityPersonField control={control} fieldIndex={_index} />
            <RoomChannel control={control} index={_index} />
          </div>
          <TeacherSelector sessionIndex={_index} className="bg-white rounded-xl p-6" />
          <div className="h-6"></div>
          <AgendarFields sessionIndex={_index} className="bg-white rounded-xl p-6" />
        </div>
      ))}
    </div>
  );
};
export default SingleSession;
