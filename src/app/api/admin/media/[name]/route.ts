import {
  AdminError,
  deleteMedia,
  errorResponse,
  guard,
  mediaDimensions,
  renameMedia,
  replaceMedia,
  rotateMedia,
} from "@/lib/admin";

type Context = { params: Promise<{ name: string }> };

async function fileName({ params }: Context) {
  return decodeURIComponent((await params).name);
}

/** Pixel dimensions, for the detail panel. */
export async function GET(request: Request, context: Context) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    return Response.json({ dimensions: mediaDimensions(await fileName(context)) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Edit in place: `{ action: "rename", name }` or `{ action: "rotate", degrees }`. */
export async function PATCH(request: Request, context: Context) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const name = await fileName(context);
    const body = await request.json();
    if (body.action === "rename") {
      return Response.json({ file: renameMedia(name, String(body.name ?? "")) });
    }
    if (body.action === "rotate") {
      return Response.json({ file: await rotateMedia(name, Number(body.degrees)) });
    }
    throw new AdminError("Unknown action");
  } catch (error) {
    return errorResponse(error);
  }
}

/** Replace the file's contents with a new upload (multipart field "file"). */
export async function PUT(request: Request, context: Context) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) throw new AdminError("No file received");
    return Response.json({ file: await replaceMedia(await fileName(context), file) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** `?force=1` deletes even when in use, clearing those references. */
export async function DELETE(request: Request, context: Context) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const force = new URL(request.url).searchParams.get("force") === "1";
    deleteMedia(await fileName(context), force);
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
