import { createClient, createSVClient } from "@/services";
import type { Database } from "@/types/supabase.types";
import type { AssignmentDto, GetAssignmentsParams, QuestionOption } from "@/types/dto/assignments";
import type { PaginatedResult } from "@/types/dto/pagination.dto";

const getAssignments = async (params?: GetAssignmentsParams): Promise<PaginatedResult<AssignmentDto>> => {
  const supabase = createClient();
  const { page = 0, limit = 20, search, createdBy } = params || {};

  let query = supabase
    .from("assignments")
    .select(
      `
      id,
      name,
      description,
      created_by,
      created_at,
      updated_at,
      questions (
        id,
        label,
        type,
        score,
        options,
        created_at,
        updated_at
      ),
      assignment_categories (
        category_id,
        categories (
          id,
          name
        )
      ),
      assignment_employees (
        employee_id,
        employees (
          id,
          employee_code,
          profiles (
            id,
            full_name,
            email,
            avatar
          )
        )
      )
    `,
      { count: "exact" }
    );

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (createdBy) {
    query = query.eq("created_by", createdBy);
  }

  const from = page * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    throw new Error(`Failed to fetch assignments: ${error.message}`);
  }

  return {
    data: (data as unknown as AssignmentDto[]) || [],
    total: count ?? 0,
    page,
    limit,
  };
};

const getAssignmentById = async (id: string): Promise<AssignmentDto> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
      id,
      name,
      description,
      created_by,
      created_at,
      updated_at,
      questions (
        id,
        label,
        type,
        score,
        options,
        attachments,
        created_at,
        updated_at
      ),
      assignment_categories (
        category_id,
        categories (
          id,
          name
        )
      ),
      assignment_employees (
        employee_id,
        employees (
          id,
          employee_code,
          profiles (
            id,
            full_name,
            email,
            avatar
          )
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch assignment: ${error.message}`);
  }

  return data as unknown as AssignmentDto;
};

export async function createAssignment(data: {
  name: string;
  description: string;
  created_by: string;
}) {
  const supabase = await createSVClient();

  const { data: assignment, error } = await supabase.from("assignments").insert(data).select().single();

  if (error) {
    throw new Error(`Failed to create assignment: ${error.message}`);
  }

  return assignment;
}

export async function updateAssignmentById(
  id: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  const supabase = await createSVClient();

  const { error } = await supabase.from("assignments").update(data).eq("id", id);

  if (error) {
    throw new Error(`Failed to update assignment: ${error.message}`);
  }
}

export async function deleteAssignmentById(assignmentId: string) {
  const supabase = await createSVClient();

  const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);

  if (error) {
    throw new Error(`Failed to delete assignment: ${error.message}`);
  }
}

// Questions repository methods
export async function createQuestions(
  questions: Array<{
    assignment_id: string;
    type: Database["public"]["Enums"]["question_type"];
    label: string;
    score: number;
    options?: QuestionOption[] | null;
    attachments?: string[] | null;
    created_by: string;
  }>
) {
  const supabase = await createSVClient();

  // Convert options to Json type for database
  const questionsToInsert = questions.map(q => ({
    ...q,
    options: q.options as any, // Cast to Json type
  }));

  const { error } = await supabase.from("questions").insert(questionsToInsert);

  if (error) {
    throw new Error(`Failed to create questions: ${error.message}`);
  }
}

export async function deleteQuestionsByAssignmentId(assignmentId: string) {
  const supabase = await createSVClient();

  const { error } = await supabase.from("questions").delete().eq("assignment_id", assignmentId);

  if (error) {
    throw new Error(`Failed to delete questions: ${error.message}`);
  }
}

// Assignment categories repository methods
export async function createAssignmentCategories(
  categories: Array<{
    assignment_id: string;
    category_id: string;
  }>
) {
  const supabase = await createSVClient();

  const { error } = await supabase.from("assignment_categories").insert(categories);

  if (error) {
    throw new Error(`Failed to create assignment categories: ${error.message}`);
  }
}

export async function deleteAssignmentCategoriesByAssignmentId(assignmentId: string) {
  const supabase = await createSVClient();

  const { error } = await supabase.from("assignment_categories").delete().eq("assignment_id", assignmentId);

  if (error) {
    throw new Error(`Failed to delete assignment categories: ${error.message}`);
  }
}

// Assignment employees repository methods
export async function createAssignmentEmployees(
  employees: Array<{
    assignment_id: string;
    employee_id: string;
  }>
) {
  const supabase = await createSVClient();

  const { error } = await supabase.from("assignment_employees").insert(employees);

  if (error) {
    throw new Error(`Failed to create assignment employees: ${error.message}`);
  }
}

export async function deleteAssignmentEmployeesByAssignmentId(assignmentId: string) {
  const supabase = await createSVClient();

  const { error } = await supabase.from("assignment_employees").delete().eq("assignment_id", assignmentId);

  if (error) {
    throw new Error(`Failed to delete assignment employees: ${error.message}`);
  }
}

const getAssignmentStudents = async (assignmentId: string) => {
  const supabase = createClient();

  // Get all assigned employees with their submission status
  const { data, error } = await supabase
    .from("assignment_employees")
    .select(
      `
      employee_id,
      employees (
        id,
        employee_code,
        profiles (
          id,
          full_name,
          email,
          avatar
        )
      )
    `
    )
    .eq("assignment_id", assignmentId);

  if (error) {
    throw new Error(`Failed to fetch assignment students: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Get all submission results for this assignment
  const { data: results, error: resultsError } = await supabase
    .from("assignment_results")
    .select("employee_id, created_at, grade")
    .eq("assignment_id", assignmentId);

  if (resultsError) {
    throw new Error(`Failed to fetch assignment results: ${resultsError.message}`);
  }

  // Create a map of employee_id to submission data
  const submissionMap = new Map(
    (results || []).map((result) => [
      result.employee_id,
      {
        submitted_at: result.created_at,
        grade: result.grade,
      },
    ])
  );

  // Combine the data
  const students = data.map((item) => {
    const employee = item.employees;
    const profile = employee?.profiles;
    const submission = submissionMap.get(item.employee_id);

    return {
      employee_id: item.employee_id,
      employee_code: employee?.employee_code || "",
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      avatar: profile?.avatar || null,
      has_submitted: !!submission,
      submitted_at: submission?.submitted_at || null,
      grade: submission?.grade || null,
    };
  });

  return students;
};

const getAssignmentQuestions = async (assignmentId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch assignment questions: ${error.message}`);
  }

  return data;
};

export { getAssignments, getAssignmentById, getAssignmentStudents, getAssignmentQuestions };

