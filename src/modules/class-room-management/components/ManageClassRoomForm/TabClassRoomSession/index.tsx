"use client";
import { useClassRoomFormContext } from "../ClassRoomFormContainer";
import SingleSession from "./SingleSession";
import MultipleSession from "./MultipleSession";
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
