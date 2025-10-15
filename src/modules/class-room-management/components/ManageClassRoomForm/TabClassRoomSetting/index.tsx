"use client";
import TextField from "@/shared/ui/form/RHFTextField";
import { Form } from "react-hook-form";
import { useForm } from "react-hook-form";
const TabClassRoomSetting = () => {
  const form = useForm({
    defaultValues: { title: "" },
  });
  return (
    <Form {...form}>
      <TextField
        control={form.control}
        label="Tên lớp học"
        placeholder="Tên lớp học"
        name="title"
      />
    </Form>
  );
};
export default TabClassRoomSetting;
