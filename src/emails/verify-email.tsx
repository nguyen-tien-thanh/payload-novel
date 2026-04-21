import { emailLayout } from './layout'

type VerifyEmailProps = {
  verifyUrl: string
}

export function verifyEmail({ verifyUrl }: VerifyEmailProps): string {
  return emailLayout({
    title: 'Xác nhận email',
    heading: 'Xác nhận địa chỉ email',
    body: `
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#71717a;">
        Cảm ơn bạn đã đăng ký tài khoản Tiralix! Nhấn vào nút bên dưới để xác nhận địa chỉ email và bắt đầu đọc truyện.
      </p>

      <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
          <td style="border-radius:8px;background-color:#4f6ef7;">
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
              Xác nhận email
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;">Hoặc sao chép đường dẫn sau vào trình duyệt:</p>
      <p style="margin:0 0 24px;font-size:13px;word-break:break-all;">
        <a href="${verifyUrl}" style="color:#4f6ef7;text-decoration:none;">${verifyUrl}</a>
      </p>

      <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px;" />

      <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;">
        Nếu bạn không tạo tài khoản này, hãy bỏ qua email này.
      </p>
    `,
  })
}
