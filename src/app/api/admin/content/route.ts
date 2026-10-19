import { errorResponse, guard, readAll } from "@/lib/admin";

export async function GET(request: Request) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    return Response.json(readAll());
  } catch (error) {
    return errorResponse(error);
  }
}
