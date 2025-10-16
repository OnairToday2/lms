"use client";
import { Grid } from "@mui/material";
import ClassRoomCard from "./ClassRoomCard";
import { ClassRoomPriority } from "../types/types";

interface ClassRoomGridProps {
  classRooms: ClassRoomPriority[];
}

export default function ClassRoomGrid({ classRooms }: ClassRoomGridProps) {
  return (
    <Grid container spacing={3}>
      {classRooms.map((classRoom) => (
        <Grid size={4} key={classRoom.id}>
          <ClassRoomCard classRoom={classRoom} />
        </Grid>
      ))}
    </Grid>
  );
}
