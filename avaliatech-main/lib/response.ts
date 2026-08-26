import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function ok<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function fail(message: string, status = 400, errors?: Record<string, string[] | undefined>) {
  return NextResponse.json({ success: false, message, errors }, { status });
}

export function validationFail(error: ZodError) {
  return fail("Existem campos inválidos.", 422, error.flatten().fieldErrors);
}

export function handleApiError(error: unknown) {
  console.error(error);
  return fail("Erro interno do servidor.", 500);
}
