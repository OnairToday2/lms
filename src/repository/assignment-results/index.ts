import { createSVClient } from "@/services";
import { Database } from "@/types/supabase.types";
import { QuestionOption } from "@/types/dto/assignments";

type AssignmentResultInsert = Database["public"]["Tables"]["assignment_results"]["Insert"];
type AssignmentResultRow = Database["public"]["Tables"]["assignment_results"]["Row"];
type QuestionType = Database["public"]["Enums"]["question_type"];

export interface AnswerData {
  questionId: string;
  questionLabel: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  answer: string | string[]; // Format depends on question type
}

export async function createAssignmentResult(data: {
  assignment_id: string;
  employee_id: string;
  answers: AnswerData[];
  grade?: number;
}): Promise<AssignmentResultRow> {
  const supabase = await createSVClient();

  const insertData: AssignmentResultInsert = {
    assignment_id: data.assignment_id,
    employee_id: data.employee_id,
    data: data.answers as any, // Database uses 'data' field to store answers
    grade: data.grade || 0,
  };

  const { data: result, error } = await supabase
    .from("assignment_results")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create assignment result: ${error.message}`);
  }

  return result;
}

export async function getAssignmentResult(
  assignmentId: string,
  employeeId: string
): Promise<AssignmentResultRow | null> {
  const supabase = await createSVClient();

  const { data, error } = await supabase
    .from("assignment_results")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("employee_id", employeeId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch assignment result: ${error.message}`);
  }

  return data;
}

export async function updateAssignmentResult(
  id: string,
  data: {
    answers?: AnswerData[];
    grade?: number;
  }
): Promise<void> {
  const supabase = await createSVClient();

  const updateData: Database["public"]["Tables"]["assignment_results"]["Update"] = {};

  if (data.answers !== undefined) {
    updateData.data = data.answers as any; // Database uses 'data' field to store answers
  }

  if (data.grade !== undefined) {
    updateData.grade = data.grade;
  }

  const { error } = await supabase
    .from("assignment_results")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update assignment result: ${error.message}`);
  }
}

export async function deleteAssignmentResult(id: string): Promise<void> {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("assignment_results")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete assignment result: ${error.message}`);
  }
}

