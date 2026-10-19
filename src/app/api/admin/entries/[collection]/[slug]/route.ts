import {
  AdminError,
  deleteEntry,
  errorResponse,
  guard,
  updateEntry,
} from "@/lib/admin";
import { isCollection } from "@/lib/schema";

type Context = { params: Promise<{ collection: string; slug: string }> };

async function target({ params }: Context) {
  const { collection, slug } = await params;
  if (!isCollection(collection)) throw new AdminError("Unknown collection", 404);
  return { collection, slug };
}

export async function PUT(request: Request, context: Context) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const { collection, slug } = await target(context);
    updateEntry(collection, slug, await request.json());
    return Response.json({ slug });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  const denied = guard(request);
  if (denied) return denied;
  try {
    const { collection, slug } = await target(context);
    deleteEntry(collection, slug);
    return new Response(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
