import { Request, Response } from 'express';
import { ProjectRequest } from '../models/ProjectRequest';
import { nextTicket } from '../models/Counter';
import { ApiError } from '../utils/ApiError';
import { ok, created, buildMeta } from '../utils/ApiResponse';

/** POST /requests — public (auth optional): submit a project request. */
export async function createRequest(req: Request, res: Response) {
  const { name, company, email, phone, budget, timeline, projectType, priority, description } =
    req.body as Record<string, string>;

  if (!name || !email || !phone || !budget || !timeline || !projectType || !description) {
    throw ApiError.badRequest('Missing required fields');
  }

  const ticket = await nextTicket('PRQ');
  const request = await ProjectRequest.create({
    ticket,
    userId: req.auth?.sub,
    name,
    company,
    email,
    phone,
    budget,
    timeline,
    projectType,
    priority: priority ?? 'Medium',
    description,
  });

  return created(res, { ticket: request.ticket, status: request.status, id: request._id }, 'Project request submitted');
}

/** GET /requests/track/:ticket — public: track a request by ticket + email. */
export async function trackRequest(req: Request, res: Response) {
  const { ticket } = req.params;
  const email = String(req.query.email ?? '').toLowerCase();
  const request = await ProjectRequest.findOne({ ticket, isDeleted: false });
  if (!request || (email && request.email !== email)) {
    throw ApiError.notFound('No request found for that ticket');
  }
  return ok(res, {
    ticket: request.ticket,
    status: request.status,
    projectType: request.projectType,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  });
}

/** GET /requests — admin: paginated list with filters. */
export async function listRequests(req: Request, res: Response) {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10)));
  const filter: Record<string, unknown> = { isDeleted: false };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.search) {
    const rx = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { ticket: rx }, { description: rx }];
  }

  const [items, total] = await Promise.all([
    ProjectRequest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ProjectRequest.countDocuments(filter),
  ]);
  return ok(res, items, 'Requests fetched', buildMeta(page, limit, total));
}

/** PATCH /requests/:id/status — admin: update workflow status. */
export async function updateRequestStatus(req: Request, res: Response) {
  const { status, adminNotes } = req.body as { status?: string; adminNotes?: string };
  const allowed = ['Pending', 'In Review', 'Accepted', 'In Progress', 'Completed', 'Rejected'];
  if (!status || !allowed.includes(status)) {
    throw ApiError.badRequest(`status must be one of: ${allowed.join(', ')}`);
  }
  const request = await ProjectRequest.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { $set: { status, ...(adminNotes !== undefined ? { adminNotes } : {}) } },
    { new: true },
  );
  if (!request) {
    throw ApiError.notFound('Request not found');
  }
  return ok(res, request, 'Status updated');
}
