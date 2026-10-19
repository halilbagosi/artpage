import { AdminError, errorResponse, guard, saveUpload } from "@/lib/admin";

export async function POST(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const form = await request.formData();
    const files = form.getAll("file").filter((f): f is File => f instanceof File);
    if (files.length === 0) throw new AdminError("No file received");
    const saved = [];
    for (const file of files) saved.push(await saveUpload(file));
    return Response.json({ files: saved }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
