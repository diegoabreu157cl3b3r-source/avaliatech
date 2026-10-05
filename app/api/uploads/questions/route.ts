import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { requireAuth } from "@/lib/auth";
import { QUESTION_UPLOAD_DIR, QUESTION_UPLOAD_URL } from "@/lib/question-image";
import { fail, handleApiError, ok } from "@/lib/response";

const MAX_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"]
]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    if (file.size === 0 || file.size > MAX_SIZE) {
      return fail("A imagem deve ter no máximo 5 MB.", 422);
    }

    const rawBytes = Buffer.from(await file.arrayBuffer());
    const isPng = rawBytes.length >= 8 && rawBytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isJpeg = rawBytes.length >= 3 && rawBytes[0] === 0xff && rawBytes[1] === 0xd8 && rawBytes[2] === 0xff;
    const isWebp = rawBytes.length >= 12 && rawBytes.subarray(0, 4).equals(Buffer.from("RIFF")) && rawBytes.subarray(8, 12).equals(Buffer.from("WEBP"));
    if ((file.type === "image/png" && !isPng) || (file.type === "image/jpeg" && !isJpeg) || (file.type === "image/webp" && !isWebp)) {
      return fail("O conteúdo do arquivo não corresponde a uma imagem válida.", 422);
    }

    // Process and optimize with Sharp (max 1200px, quality 85, strip metadata)
    let processedBuffer: Buffer;
    let finalExtension = expectedExtension;

    try {
      const sharpInstance = sharp(rawBytes)
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .rotate(); // Auto-rotate based on EXIF orientation before stripping

      if (expectedExtension === "png") {
        processedBuffer = await sharpInstance.png({ quality: 85, compressionLevel: 8 }).toBuffer();
      } else if (expectedExtension === "webp") {
        processedBuffer = await sharpInstance.webp({ quality: 85 }).toBuffer();
      } else {
        processedBuffer = await sharpInstance.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      }
    } catch {
      // Fallback to raw bytes if sharp transformation fails for any reason
      processedBuffer = rawBytes;
    }

    await fs.mkdir(QUESTION_UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}.${finalExtension}`;
    await fs.writeFile(path.join(QUESTION_UPLOAD_DIR, filename), processedBuffer, { flag: "wx" });
    return ok({ url: `${QUESTION_UPLOAD_URL}/${filename}` }, "Imagem enviada com sucesso.", 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return fail("Usuário não autenticado.", 401);
    return handleApiError(error);
  }
}
