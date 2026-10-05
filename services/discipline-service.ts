import { http } from "@/services/http";
import type { ApiResponse } from "@/types/api";
import type {
  Assunto,
  CreateAssuntoInput,
  CreateDisciplinaInput,
  Disciplina,
  DisciplinaWithAssuntos,
  UpdateAssuntoInput,
  UpdateDisciplinaInput
} from "@/types/discipline";

let cachedDisciplinesPromise: Promise<ApiResponse<DisciplinaWithAssuntos[]>> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10_000; // 10 seconds client cache

export function invalidateDisciplinesCache() {
  cachedDisciplinesPromise = null;
  cacheTimestamp = 0;
}

export function getDisciplines(forceFresh = false) {
  const now = Date.now();
  if (!forceFresh && cachedDisciplinesPromise && (now - cacheTimestamp < CACHE_TTL_MS)) {
    return cachedDisciplinesPromise;
  }

  cacheTimestamp = now;
  cachedDisciplinesPromise = http<ApiResponse<DisciplinaWithAssuntos[]>>("/api/disciplines")
    .catch((err) => {
      invalidateDisciplinesCache();
      throw err;
    });

  return cachedDisciplinesPromise;
}

export async function createDiscipline(data: CreateDisciplinaInput) {
  invalidateDisciplinesCache();
  const res = await http<ApiResponse<DisciplinaWithAssuntos>>("/api/disciplines", {
    method: "POST",
    body: JSON.stringify(data)
  });
  return res;
}

export async function updateDiscipline(id: number, data: UpdateDisciplinaInput) {
  invalidateDisciplinesCache();
  const res = await http<ApiResponse<Disciplina>>(`/api/disciplines/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  return res;
}

export async function deleteDiscipline(id: number) {
  invalidateDisciplinesCache();
  const res = await http<ApiResponse<null>>(`/api/disciplines/${id}`, {
    method: "DELETE"
  });
  return res;
}

export function getSubjects(disciplineId: number) {
  return http<ApiResponse<Assunto[]>>(`/api/disciplines/${disciplineId}/subjects`);
}

export async function createSubject(disciplineId: number, data: CreateAssuntoInput) {
  invalidateDisciplinesCache();
  const res = await http<ApiResponse<Assunto>>(`/api/disciplines/${disciplineId}/subjects`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  return res;
}

export async function updateSubject(disciplineId: number, subjectId: number, data: UpdateAssuntoInput) {
  invalidateDisciplinesCache();
  const res = await http<ApiResponse<Assunto>>(`/api/disciplines/${disciplineId}/subjects/${subjectId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  return res;
}

export async function deleteSubject(disciplineId: number, subjectId: number) {
  invalidateDisciplinesCache();
  const res = await http<ApiResponse<null>>(`/api/disciplines/${disciplineId}/subjects/${subjectId}`, {
    method: "DELETE"
  });
  return res;
}
