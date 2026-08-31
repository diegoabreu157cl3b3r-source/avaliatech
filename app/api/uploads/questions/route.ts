import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/auth";
import { QUESTION_UPLOAD_DIR, QUESTION_UPLOAD_URL } from "@/lib/question-image";
import { fail, handleApiError, ok } from "@/lib/response";

const MAX_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([["image/png", "png"], ["image/jpeg", "jpg"], ["image/webp", "webp"]]);

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAuth();
    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) return fail("Envie uma imagem.", 400);

    const extension = path.extname(file.name).toLowerCase();
    const expectedExtension = allowedTypes.get(file.type);
    if (!expectedExtension || ![".png", ".jpg", ".jpeg", ".webp"].includes(extension)) {
      return fail("A imagem deve ser PNG, JPG, JPEG ou WebP.", 422);
    }
    if (file.size === 0 || file.size > MAX_SIZE) return fail("A imagem deve ter no mÃ¡ximo 5 MB.", 422);

    const bytes = Buffer.from(await file.arrayBuffer());
    const isPng = bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isWebp = bytes.length >= 12 && bytes.subarray(0, 4).equals(Buffer.from("RIFF")) && bytes.subarray(8, 12).equals(Buffer.from("WEBP"));
    if ((file.type === "image/png" && !isPng) || (file.type === "image/jpeg" && !isJpeg) || (file.type === "image/webp" && !isWebp)) {
      return fail("O conteÃºdo do arquivo nÃ£o corresponde a uma imagem vÃ¡lida.", 422);
    }

    await fs.mkdir(QUESTION_UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}.${expectedExtension}`;
    await fs.writeFile(path.join(QUESTION_UPLOAD_DIR, filename), bytes, { flag: "wx" });
    return ok({ url: `${QUESTION_UPLOAD_URL}/${filename}` }, "Imagem enviada com sucesso.", 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("UsuÃ¡rio nÃ£o autenticado.", 401);
    return handleApiError(error);
  }
}
