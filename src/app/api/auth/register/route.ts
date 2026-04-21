import config from '@payload-config'
import { getPayload } from 'payload'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return Response.json({ message: 'Email và mật khẩu là bắt buộc.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length > 0) {
    return Response.json({ message: 'Email này đã được sử dụng.' }, { status: 400 })
  }

  await payload.create({
    collection: 'users',
    data: { name, email, password },
    overrideAccess: true,
  })

  return Response.json({ ok: true }, { status: 201 })
}
