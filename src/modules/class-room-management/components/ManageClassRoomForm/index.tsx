import { ClassRoomProvider } from "../../store/class-room-context";
import ClassRoomContainer, { ClassRoomContainerProps } from "./ClassRoomContainer";

interface FormManageClassRoomProps {
  onSubmit?: ClassRoomContainerProps["onSubmit"];
}
const FormManageClassRoom: React.FC<FormManageClassRoomProps> = ({ onSubmit }) => {
  return (
    <ClassRoomProvider>
      <ClassRoomContainer onSubmit={onSubmit} />
    </ClassRoomProvider>
  );
};
export default FormManageClassRoom;
