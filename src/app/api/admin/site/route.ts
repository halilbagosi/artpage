import { errorResponse, guard, saveSite } from "@/lib/admin";

export async function PUT(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    return Response.json({ site: saveSite(await request.json()) });
  } catch (error) {
    return errorResponse(error);
  }
}
