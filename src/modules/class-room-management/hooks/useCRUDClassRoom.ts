import { createClassRoom, CreateClassRoomPayload } from "@/repository/classRoom";
const useCRUDClassRoom = () => {
  const onCreate = async (formData: any) => {
    let payload: CreateClassRoomPayload = {
      comunity_info: "",
      description: "",
      room_type: "single",
      slug: "",
      status: "active",
      thumbnail_url: "",
      title: "",
      user_id: "",
    };

    const { data: classRoomData, error } = await createClassRoom(payload);

    console.log(classRoomData);
    // const classRoomId = classRoomData?.[0]?.id;
    // if (!classRoomId) {
    //   throw new Error("Loi tao lop hoc");
    // }

    // const session = await supabase
    //   .from("class_sessions")
    //   .insert([
    //     {
    //       channel_provider: "google_meet",
    //       channel_info: "",
    //       description: "",
    //       start_at: "",
    //       end_at: "",
    //       is_online: false,
    //       limit_person: -1,
    //       title: "",
    //       class_room_id: classRoomId,
    //     },
    //     {
    //       channel_provider: "google_meet",
    //       channel_info: "",
    //       description: "",
    //       start_at: "",
    //       end_at: "",
    //       is_online: false,
    //       limit_person: -1,
    //       title: "",
    //       class_room_id: classRoomId,
    //     },
    //   ])
    //   .select();

    // const { data: hashTagsData, error: hashTagError } = await supabase
    //   .from("hash_tags")
    //   .insert({
    //     name: "",
    //     slug: "",
    //   })
    //   .select();

    // const { data: hashTagsData, error: hashTagError } = await supabase
    //   .from("class_room_metadata")
    //   .insert({
    //     name: "",
    //     slug: "",
    //   })
    //   .select();

    // if (!hashTagsData) {
    // }
    // // const classHashTagsInserts =
    // // const {data,} = supabase.from("class_hash_tag").insert({
    // //   "class_room_id": classRoomId,
    // //   "hash_tag_id":
    // // });
  };

  return {
    onCreate,
  };
};
export { useCRUDClassRoom };
