const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

type EmailLayoutProps = {
  title: string
  heading: string
  body: string
}

export function emailLayout({
  title,
  heading,
  body,
}: EmailLayoutProps): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#4f6ef7;padding:28px 40px;text-align:center;">
              <img src="${serverUrl}/favicon-96x96.png" width="40" height="40" alt="Tiralix" style="display:inline-block;vertical-align:middle;border-radius:8px;margin-right:10px;" />
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;vertical-align:middle;">Tiralix</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#09090b;">${heading}</h2>
              ${body}
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
