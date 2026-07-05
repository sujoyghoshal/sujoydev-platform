import { Request, Response } from 'express';
import { BugReport } from '../models/BugReport';
import { nextTicket } from '../models/Counter';
import { ApiError } from '../utils/ApiError';
import { ok, created, buildMeta } from '../utils/ApiResponse';

/** POST /bugs — public (auth optional): submit a bug report. */
export async function createBug(req: Request, res: Response) {
  const { title, description, priority, deviceInfo, osVersion, appVersion, logs } =
    req.body as Record<string, string>;

  if (!title || !description) {
    throw ApiError.badRequest('title and description are required');
  }

  const ticket = await nextTicket('BUG');
  const bug = await BugReport.create({
    ticket,
    userId: req.auth?.sub,
    title,
    description,
    priority: priority ?? 'Medium',
    deviceInfo,
    osVersion,
    appVersion,
    logs,
  });

  return created(res, { ticket: bug.ticket, status: bug.status, id: bug._id }, 'Bug report submitted');
}

/** GET /bugs — admin: paginated list with filters. */
export async function listBugs(req: Request, res: Response) {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit ?? '20'), 10)));
  const filter: Record<string, unknown> = { isDeleted: false };
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  const [items, total] = await Promise.all([
    BugReport.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    BugReport.countDocuments(filter),
  ]);
  return ok(res, items, 'Bug reports fetched', buildMeta(page, limit, total));
}

/** PATCH /bugs/:id/status — admin: update bug workflow status. */
export async function updateBugStatus(req: Request, res: Response) {
  const { status } = req.body as { status?: string };
  const allowed = ['Open', 'In Progress', 'Fixed', 'Closed'];
  if (!status || !allowed.includes(status)) {
    throw ApiError.badRequest(`status must be one of: ${allowed.join(', ')}`);
  }
  const bug = await BugReport.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { $set: { status } },
    { new: true },
  );
  if (!bug) {
    throw ApiError.notFound('Bug report not found');
  }
  return ok(res, bug, 'Status updated');
}
