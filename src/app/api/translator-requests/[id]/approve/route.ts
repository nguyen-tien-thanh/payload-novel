import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const { action, adminNote } = body as {
    action: 'approve' | 'reject'
    adminNote?: string
  }

  if (action !== 'approve' && action !== 'reject') {
    return Response.json(
      { error: 'action must be approve or reject' },
      { status: 400 },
    )
  }

  const requestDoc = await payload.findByID({
    collection: 'translator-requests',
    id,
  })
  if (!requestDoc) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  await payload.update({
    collection: 'translator-requests',
    id,
    data: {
      status: action === 'approve' ? 'approved' : 'rejected',
      ...(adminNote ? { adminNote } : {}),
    },
    overrideAccess: true,
  })

  if (action === 'approve') {
    const userId =
      typeof requestDoc.createdBy === 'object'
        ? requestDoc.createdBy.id
        : requestDoc.createdBy
    await payload.update({
      collection: 'users',
      id: String(userId),
      data: { role: 'translator' },
      overrideAccess: true,
    })
  }

  return Response.json({ success: true })
}
