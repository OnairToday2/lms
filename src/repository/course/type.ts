import { Course } from "@/model/course.model";

export type CreateCoursePayload = Pick<
  Course,
  "title" | "status" | "thumbnail_url" | "start_at" | "end_at" | "description"
>;

export type UpdateCoursePayload = Pick<
  Course,
  "id" | "title" | "status" | "thumbnail_url" | "start_at" | "end_at" | "description"
>;

export type UpsertCoursePayload =
  | {
      action: "create";
      payload: CreateCoursePayload;
    }
  | {
      action: "update";
      payload: UpdateCoursePayload;
    };
