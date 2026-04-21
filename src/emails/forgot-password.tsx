import { emailLayout } from './layout'

type ForgotPasswordEmailProps = {
  resetUrl: string
}

export function forgotPasswordEmail({ resetUrl }: ForgotPasswordEmailProps): string {
  return emailLayout({
    title: 'Đặt lại mật khẩu',
    heading: 'Đặt lại mật khẩu',
    body: `
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#71717a;">
        Bạn nhận được email này vì có yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để tiếp tục.
      </p>

      <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr>
          <td style="border-radius:8px;background-color:#4f6ef7;">
            <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
              Đặt lại mật khẩu
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;">Hoặc sao chép đường dẫn sau vào trình duyệt:</p>
      <p style="margin:0 0 24px;font-size:13px;word-break:break-all;">
        <a href="${resetUrl}" style="color:#4f6ef7;text-decoration:none;">${resetUrl}</a>
      </p>

      <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px;" />

      <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;">
        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
      </p>
    `,
  })
}
