"use client";
import { type ClassRoom } from "../../classroom-form.schema";
import { useFormContext } from "react-hook-form";
import SingleSession from "./SingleSession";
import MultipleSession from "./MultipleSession";
const TabClassRoomSession = () => {
  const { getValues } = useFormContext<ClassRoom>();
  const classRoomType = getValues("roomType");

  return (
    <div>
      {classRoomType === "single" ? <SingleSession /> : null}
      {classRoomType === "multiple" ? <MultipleSession /> : null}
    </div>
  );
};
export default TabClassRoomSession;
