import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return Response.json({ message: 'Email là bắt buộc.' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const { totalDocs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (totalDocs === 0) {
    return Response.json({ message: 'Email không tồn tại trong hệ thống.' }, { status: 404 })
  }

  await payload.forgotPassword({ collection: 'users', data: { email }, disableEmail: false })

  return Response.json({ message: 'ok' })
}
