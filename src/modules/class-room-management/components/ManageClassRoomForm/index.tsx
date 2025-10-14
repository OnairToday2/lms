import { ClassRoomProvider } from "../../store/class-room-context";
import ClassRoomContainer from "./ClassRoomContainer";

interface FormManageClassRoomProps {}
const FormManageClassRoom: React.FC<FormManageClassRoomProps> = () => {
  return (
    <ClassRoomProvider>
      <ClassRoomContainer />
    </ClassRoomProvider>
  );
};
export default FormManageClassRoom;
