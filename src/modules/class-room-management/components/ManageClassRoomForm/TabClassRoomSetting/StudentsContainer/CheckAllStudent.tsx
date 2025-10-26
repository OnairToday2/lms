import { Checkbox } from "@mui/material";
import React from "react";
import { EmployeeStudentWithProfileItem } from "@/model/employee.model";
interface CheckAllStudentsProps {
  selectedStudents?: EmployeeStudentWithProfileItem[];
  students?: EmployeeStudentWithProfileItem[];
  // setSelectedStudents: React.Dispatch<React.SetStateAction<EmployeeStudentWithProfileItem[]>>;
  onCheckAll: (checked: boolean) => void;
}
const CheckAllStudents: React.FC<CheckAllStudentsProps> = ({
  students = [],
  selectedStudents = [],
  // setSelectedStudents,
  onCheckAll,
}) => {
  const isCheckedAllItem = React.useMemo(() => {
    if (!students.length) return false;
    return students.every((selectedItem) => selectedStudents.some((item) => item.id === selectedItem.id));
  }, [selectedStudents, students]);

  // const toggleCheckAllStudents = (checked?: boolean) => {
  //   if (!students?.length) return;

  //   setSelectedStudents((prevSelectedStudents) => {
  //     let newSelectedList: EmployeeStudentWithProfileItem[] = [];

  //     if (checked) {
  //       const listMap = new Map<string, EmployeeStudentWithProfileItem>();

  //       [...students, ...prevSelectedStudents].forEach((item) => {
  //         listMap.set(item.id, item);
  //       });

  //       for (const [key, value] of listMap.entries()) {
  //         newSelectedList.push(value);
  //       }
  //     } else {
  //       prevSelectedStudents.forEach((sltItem) => {
  //         if (students.every((it) => it.id !== sltItem.id)) {
  //           newSelectedList.push(sltItem);
  //         }
  //       });
  //     }
  //     return newSelectedList;
  //   });
  // };

  const isIndeterminate = React.useMemo(() => {
    if (!students?.length) return false;
    return students.some((item) => selectedStudents.some((it) => it.id === item.id));
  }, [students, selectedStudents]);

  return (
    <Checkbox
      indeterminate={!isCheckedAllItem && isIndeterminate}
      checked={isCheckedAllItem}
      onChange={(evt, checked) => onCheckAll(checked)}
      className="mr-4"
    />
  );
};
export default CheckAllStudents;
