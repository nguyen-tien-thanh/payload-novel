'use client'

import { useAuth } from '@/lib/auth-context'
import { Button, TextArea } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Author {
  id: number
  name?: string | null
  email: string
}

interface Comment {
  id: number
  content: string
  createdBy: Author | number
  createdAt: string
  parent?: number | { id: number } | null
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  return `${Math.floor(h / 24)} ngày trước`
}

function Avatar({ name }: { name?: string | null }) {
  const letter = (name ?? '?')[0].toUpperCase()
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
      {letter}
    </div>
  )
}

function CommentForm({
  productId,
  parentId,
  onSubmit,
  placeholder = 'Viết bình luận...',
  autoFocus = false,
}: {
  productId: string
  parentId?: number
  onSubmit: (c: Comment) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  const { user } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!user) {
      router.push(`/auth/login`)
      return
    }
    if (!content.trim()) return
    setLoading(true)
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: Number(productId), content, parentId }),
    })
    if (res.ok) {
      const doc = await res.json()
      onSubmit(doc)
      setContent('')
    }
    setLoading(false)
  }

  return (
    <div className="flex gap-3">
      {user && <Avatar name={user.name} />}
      <div className="flex flex-1 flex-col gap-2">
        <TextArea
          placeholder={user ? placeholder : 'Đăng nhập để bình luận'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          disabled={!user}
          autoFocus={autoFocus}
          className="w-full rounded-xl bg-content2 px-3 py-2 text-sm text-foreground outline-none placeholder:text-default-400 disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
          }}
        />
        {user && (
          <div className="flex justify-end">
            <Button size="sm" isDisabled={!content.trim()} onPress={submit}>
              Gửi
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  replies,
  productId,
  currentUserId,
  onReply,
  onDelete,
}: {
  comment: Comment
  replies: Comment[]
  productId: string
  currentUserId?: string
  onReply: (parentId: number, c: Comment) => void
  onDelete: (id: number) => void
}) {
  const [showReply, setShowReply] = useState(false)
  const author =
    typeof comment.createdBy === 'object' ? comment.createdBy : null
  const authorId =
    typeof comment.createdBy === 'object'
      ? comment.createdBy.id
      : comment.createdBy
  const canDelete = currentUserId && String(authorId) === currentUserId

  return (
    <div>
      <div className="flex gap-3">
        <Avatar name={author?.name} />
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">
              {author?.name ?? author?.email ?? 'Ẩn danh'}
            </span>
            <span className="text-xs text-default-400">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="mt-1.5 flex gap-3">
            <button
              className="text-xs text-default-400 hover:text-primary transition-colors"
              onClick={() => setShowReply((v) => !v)}
            >
              Trả lời
            </button>
            {canDelete && (
              <button
                className="text-xs text-default-400 hover:text-danger transition-colors"
                onClick={() => onDelete(comment.id)}
              >
                Xóa
              </button>
            )}
          </div>

          {showReply && (
            <div className="mt-3">
              <CommentForm
                productId={productId}
                parentId={comment.id}
                placeholder={`Trả lời ${author?.name ?? ''}...`}
                autoFocus
                onSubmit={(c) => {
                  onReply(comment.id, c)
                  setShowReply(false)
                }}
              />
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-3 space-y-3 border-l-2 border-divider pl-4">
              {replies.map((r) => {
                const rAuthor =
                  typeof r.createdBy === 'object' ? r.createdBy : null
                const rAuthorId =
                  typeof r.createdBy === 'object' ? r.createdBy.id : r.createdBy
                const rCanDelete =
                  currentUserId && String(rAuthorId) === currentUserId
                return (
                  <div key={r.id} className="flex gap-3">
                    <Avatar name={rAuthor?.name} />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {rAuthor?.name ?? rAuthor?.email ?? 'Ẩn danh'}
                        </span>
                        <span className="text-xs text-default-400">
                          {timeAgo(r.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap">
                        {r.content}
                      </p>
                      {rCanDelete && (
                        <button
                          className="mt-1 text-xs text-default-400 hover:text-danger transition-colors"
                          onClick={() => onDelete(r.id)}
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ProductComments({ productId }: { productId: string }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [replies, setReplies] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch(`/api/comments?productId=${productId}`)
    const data = await res.json()
    setComments(data.docs ?? [])
    setReplies(data.replies ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [productId])

  function handleNew(c: Comment) {
    setComments((prev) => [c, ...prev])
  }

  function handleReply(parentId: number, c: Comment) {
    setReplies((prev) => [...prev, c])
  }

  async function handleDelete(id: number) {
    await fetch(`/api/comments?id=${id}`, { method: 'DELETE' })
    setComments((prev) => prev.filter((c) => c.id !== id))
    setReplies((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="rounded-2xl border border-divider bg-content1 p-5">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-default-500">
        Bình luận{' '}
        {comments.length > 0 && (
          <span className="font-normal">({comments.length})</span>
        )}
      </h2>

      <CommentForm productId={productId} onSubmit={handleNew} />

      {loading ? (
        <div className="mt-6 text-center text-sm text-default-400">
          Đang tải...
        </div>
      ) : comments.length === 0 ? (
        <div className="mt-6 text-center text-sm text-default-400">
          Chưa có bình luận nào
        </div>
      ) : (
        <div className="mt-6 space-y-5 divide-y divide-divider">
          {comments.map((c) => (
            <div key={c.id} className="pt-5 first:pt-0">
              <CommentItem
                comment={c}
                replies={replies.filter((r) => {
                  const pid =
                    typeof r.parent === 'object' ? r.parent?.id : r.parent
                  return pid === c.id
                })}
                productId={productId}
                currentUserId={user?.id}
                onReply={handleReply}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
