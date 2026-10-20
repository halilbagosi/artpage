import { AdminError, createEntry, errorResponse, guard, patchEntries } from "@/lib/admin";
import { isCollection } from "@/lib/schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const { collection } = await params;
    if (!isCollection(collection)) throw new AdminError("Unknown collection", 404);
    const slug = createEntry(collection, await request.json());
    return Response.json({ slug }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Bulk edit: `{ slugs: string[], set: { field: value } }` */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const { collection } = await params;
    if (!isCollection(collection)) throw new AdminError("Unknown collection", 404);
    const { slugs, set } = await request.json();
    return Response.json({ updated: patchEntries(collection, slugs, set) });
  } catch (error) {
    return errorResponse(error);
  }
}
