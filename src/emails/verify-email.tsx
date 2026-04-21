type VerifyEmailProps = {
  verifyUrl: string
}

export function verifyEmail({ verifyUrl }: VerifyEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xác nhận email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#7c3aed;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Tiralix</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#09090b;">Xác nhận địa chỉ email</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#71717a;">
                Cảm ơn bạn đã đăng ký tài khoản Tiralix! Nhấn vào nút bên dưới để xác nhận địa chỉ email và bắt đầu đọc truyện.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="border-radius:8px;background-color:#7c3aed;">
                    <a href="${verifyUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Xác nhận email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#a1a1aa;">Hoặc sao chép đường dẫn sau vào trình duyệt:</p>
              <p style="margin:0 0 24px;font-size:13px;word-break:break-all;">
                <a href="${verifyUrl}" style="color:#7c3aed;text-decoration:none;">${verifyUrl}</a>
              </p>

              <hr style="border:none;border-top:1px solid #e4e4e7;margin:0 0 24px;" />

              <p style="margin:0;font-size:13px;color:#a1a1aa;line-height:1.6;">
                Nếu bạn không tạo tài khoản này, hãy bỏ qua email này.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:#fafafa;border-top:1px solid #f4f4f5;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">© ${new Date().getFullYear()} Tiralix. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
