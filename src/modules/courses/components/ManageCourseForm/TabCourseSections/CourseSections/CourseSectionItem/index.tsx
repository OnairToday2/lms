import React, {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  forwardRef,
  KeyboardEventHandler,
  memo,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import SortableSectionItem from "../SortableSectionItem";
import { Button, FormHelperText, OutlinedInput, Typography } from "@mui/material";
import PlusIcon from "@/shared/assets/icons/PlusIcon";

import { Control, Controller, useController, UseFormReturn, useWatch } from "react-hook-form";
import { UpsertCourseFormData } from "@/modules/courses/components/upsert-course.schema";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useFieldArray } from "react-hook-form";
import SortableLessionItem from "../SortableLessionItem";
import { LessionType } from "@/model/lession.model";

export type CourseSectionItemRef = {
  appendLession: (type: LessionType) => { sectionIndex: number; lessionIndex: number };
};
export interface CourseSectionItemProps extends PropsWithChildren {
  id: string;
  index: number;
  methods: UseFormReturn<UpsertCourseFormData>;
  onDelete?: (index: number) => void;
  onLessionClick?: (sectionIndex: number, lessionIndex: number) => void;
  onAddLession?: () => void;
}
const CourseSectionItem = forwardRef<CourseSectionItemRef, CourseSectionItemProps>(
  ({ id, index, methods, onDelete, onLessionClick, onAddLession }, ref) => {
    const [isEditSectiontitle, setIsEditSectionTitle] = useState(false);
    const {
      control,
      getValues,
      trigger,
      formState: { errors },
    } = methods;
    const {
      fields: lessionsField,
      remove,
      move,
      update,
      append,
    } = useFieldArray({
      control,
      name: `sections.${index}.lessions`,
      keyName: "_lessionId",
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

      const activeIndex = lessionsField.findIndex((field) => field._lessionId === activeId);
      const overIndex = lessionsField.findIndex((field) => field._lessionId === overId);

      move(activeIndex, overIndex);
    };

    const toggleEditSectionTitle = () => {
      setIsEditSectionTitle((prev) => !prev);
    };
    const handleClickDelete = () => {
      onDelete?.(index);
    };

    const getLessionTitle = (lessionIndex: number) => {
      return getValues(`sections.${index}.lessions.${lessionIndex}.title`);
    };

    useImperativeHandle(ref, () => ({
      appendLession: (type: LessionType) => {
        const nextLessionIndex = lessionsField.length;
        append({
          lessionType: type,
          title: "",
          status: "active",
          content: "",
          resources: [],
          mainResource: { id: "", type: "", url: "" },
        });
        return { lessionIndex: nextLessionIndex, sectionIndex: index };
      },
    }));
    return (
      <SortableSectionItem
        id={id}
        header={
          <SectionTitleField
            control={control}
            isEditting={isEditSectiontitle}
            setEdit={setIsEditSectionTitle}
            sectionIndex={index}
          />
        }
        subLabel={`H${index + 1}`}
        onEdit={isEditSectiontitle ? undefined : toggleEditSectionTitle}
        onDelete={handleClickDelete}
      >
        <div className="section-item__body flex flex-col gap-2">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={lessionsField.map((lession) => lession._lessionId)}
              strategy={verticalListSortingStrategy}
            >
              {lessionsField.map((lession, lessionIndex) => (
                <SortableLessionItem
                  id={lession._lessionId}
                  key={lession._lessionId}
                  label={getLessionTitle(lessionIndex)}
                  onClick={() => onLessionClick?.(index, lessionIndex)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div className="h-4"></div>
        <div className="section-item__footer">
          <Button endIcon={<PlusIcon />} variant="outlined" color="inherit" size="small" onClick={onAddLession}>
            Tạo bài giảng
          </Button>
        </div>
      </SortableSectionItem>
    );
  },
);
export default memo(CourseSectionItem);

interface SectionTitleFieldProps {
  control: Control<UpsertCourseFormData>;
  sectionIndex: number;
  isEditting: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}
const SectionTitleField: React.FC<SectionTitleFieldProps> = ({ control, sectionIndex, isEditting, setEdit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevInputValue = useRef("");
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({ control: control, name: `sections.${sectionIndex}.title` });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    onChange(evt.target.value);
  };
  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (evt) => {
    if (evt.key === "Enter") {
      setEdit(false);
    }
    if (evt.key === "Escape") {
      onChange(prevInputValue.current);
      setEdit(false);
    }
  };

  useEffect(() => {
    if (!isEditting) return;
    prevInputValue.current = value;
  }, [isEditting]);

  const handleBlur = () => {
    if (!value.length) return;
    // onChange(prevInputValue.current);
    setEdit(false);
    onBlur();
  };

  if (isEditting)
    return (
      <Controller
        control={control}
        name={`sections.${sectionIndex}.title`}
        render={({ field }) => (
          <>
            <OutlinedInput
              size="small"
              ref={inputRef}
              value={field.value}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyUp={handleKeyUp}
              name={field.name}
              rows={3}
              fullWidth
              sx={(theme) => ({
                input: {
                  padding: "0.425rem 0.675rem;",
                },
              })}
            />
            <FormHelperText>{error?.message}</FormHelperText>
          </>
        )}
      />
    );
  return <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{value}</Typography>;
};
