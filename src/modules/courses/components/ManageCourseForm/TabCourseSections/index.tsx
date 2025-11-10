"use client";
import { useUpsertCourseFormContext } from "../UpsertCourseFormContainer";
import { forwardRef, useCallback, useRef, useState } from "react";
import { Box, Button, FormControl, FormLabel, IconButton, OutlinedInput, Typography } from "@mui/material";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { UpsertCourseFormData } from "../../upsert-course.schema";
// import ButtonAddQuestion from "../button-add-question";
import CourseSectionItem, { CourseSectionItemRef } from "./CourseSections/CourseSectionItem";
import ButtonAddSection, { ButtonAddSectionProps } from "./ButtonAddSection";
import LessonTypeSelector, { LessonTypeSelectorProps } from "./LessonTypeSelector";
import LessonForm from "./LessonForm";

export const initSectionFormData = (): UpsertCourseFormData["sections"][number] => {
  return {
    title: "",
    description: "",
    lessons: [],
    status: "active",
  };
};

type TabCourseSectionsRef = {
  checkAllFields: () => Promise<boolean>;
};
interface TabCourseSectionsProps {}
const TabCourseSections = forwardRef<TabCourseSectionsRef, TabCourseSectionsProps>((props, ref) => {
  const sectionRef = useRef<CourseSectionItemRef>(null);
  const [isAddLession, setIsAddLession] = useState(false);
  const [editingLesson, seteditingLesson] = useState<{ sectionIndex: number; lessonIndex: number }>();
  const methods = useUpsertCourseFormContext();
  const {
    control,
    formState: { errors },
  } = methods;

  const {
    fields: sections,
    remove,
    move,
    append,
  } = useFieldArray({
    control,
    name: "sections",
    keyName: "_sectionId",
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;

    if (!over || activeId === overId) return;

    const activeIndex = sections.findIndex((field) => field._sectionId === activeId);
    const overIndex = sections.findIndex((field) => field._sectionId === overId);

    move(activeIndex, overIndex);
  };

  const handleAddSection: ButtonAddSectionProps["onOk"] = useCallback((title) => {
    // const fieldLength = getValues("sections").length;
    // if (fieldLength > 0) {
    //   const isValidAllFields = await trigger("sections");
    //   if (!isValidAllFields) return;
    // }
    const sectionData = initSectionFormData();
    append({ ...sectionData, title: title });
  }, []);

  const handleDeleteSection = (sectionIndex: number) => {
    remove(sectionIndex);
  };
  const handleLessionClick = (sectionIndex: number, lessonIndex: number) => {
    seteditingLesson({ lessonIndex, sectionIndex });
  };
  const handleClickAddLession = () => {
    setIsAddLession(true);
    seteditingLesson(undefined);
  };
  const handleSelectLession: LessonTypeSelectorProps["onSelect"] = (type) => {
    if (!sectionRef.current) return;
    const { lessonIndex, sectionIndex } = sectionRef.current.appendLesson(type);
    seteditingLesson({ lessonIndex, sectionIndex });
    setIsAddLession(false);
  };
  return (
    <div className="flex flex-wrap gap-6">
      <div className="section w-80">
        <div className="section__iner">
          <ButtonAddSection onOk={handleAddSection} />
          <div className="h-6"></div>
          <Box component="div" className="sections__list flex flex-col gap-3">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={sections.map((section) => section._sectionId)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section, _index) => (
                  <CourseSectionItem
                    ref={sectionRef}
                    key={section._sectionId}
                    id={section._sectionId}
                    index={_index}
                    methods={methods}
                    onDelete={handleDeleteSection}
                    onLessionClick={handleLessionClick}
                    onAddLession={handleClickAddLession}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Box>
          <div className="h-6"></div>
          {errors.sections?.message && (
            <Typography component="p" className="text-xs text-red-600 mb-6">
              {errors.sections?.message}
            </Typography>
          )}
        </div>
      </div>
      <div className="lession-wraper flex-1">
        {isAddLession || editingLesson ? (
          <div className="bg-white rounded-xl p-6">
            <Typography sx={{ fontWeight: "bold" }} className="mb-6">
              Tạo Bài giảng
            </Typography>
            <div className="bg-white rounded-xl">
              {isAddLession ? <LessonTypeSelector onSelect={handleSelectLession} /> : null}

              {editingLesson ? (
                <LessonForm
                  key={`lession-${editingLesson.sectionIndex}-${editingLesson.lessonIndex}`}
                  sectionIndex={editingLesson.sectionIndex}
                  lessonIndex={editingLesson.lessonIndex}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});
export default TabCourseSections;
