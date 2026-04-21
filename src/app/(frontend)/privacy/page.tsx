import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description:
    'Chính sách bảo mật của Tiralix – cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Chính sách bảo mật
      </h1>
      <p className="mb-10 text-sm text-default-400">
        Cập nhật lần cuối: tháng 4, 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-default-600">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            1. Thông tin chúng tôi thu thập
          </h2>
          <p>
            Khi bạn sử dụng Tiralix, chúng tôi có thể thu thập các thông tin
            sau:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Thông tin tài khoản: tên, địa chỉ email, ảnh đại diện.</li>
            <li>
              Dữ liệu sử dụng: lịch sử đọc, bookmark, tiến độ đọc, bình luận.
            </li>
            <li>
              Thông tin thiết bị: loại trình duyệt, hệ điều hành, địa chỉ IP.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            2. Mục đích sử dụng
          </h2>
          <p>Thông tin thu thập được sử dụng để:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Cung cấp và cải thiện dịch vụ đọc truyện.</li>
            <li>Lưu tiến độ đọc và cá nhân hóa trải nghiệm.</li>
            <li>
              Gửi thông báo liên quan đến tài khoản (đặt lại mật khẩu, xác nhận
              email).
            </li>
            <li>Phân tích và cải thiện hiệu suất nền tảng.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            3. Chia sẻ thông tin
          </h2>
          <p>
            Chúng tôi không bán, trao đổi hay chia sẻ thông tin cá nhân của bạn
            với bên thứ ba vì mục đích thương mại. Thông tin chỉ được chia sẻ
            trong các trường hợp:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền.</li>
            <li>
              Với các nhà cung cấp dịch vụ kỹ thuật phục vụ vận hành nền tảng
              (lưu trữ, email).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            4. Bảo mật dữ liệu
          </h2>
          <p>
            Chúng tôi áp dụng các biện pháp kỹ thuật phù hợp để bảo vệ thông tin
            cá nhân của bạn khỏi truy cập trái phép, mất mát hoặc tiết lộ. Mật
            khẩu được mã hóa và không được lưu dưới dạng văn bản thuần túy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">5. Cookie</h2>
          <p>
            Tiralix sử dụng cookie để duy trì phiên đăng nhập và ghi nhớ tùy
            chọn của bạn. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy
            nhiên một số tính năng có thể không hoạt động đúng cách.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            6. Quyền của bạn
          </h2>
          <p>Bạn có quyền:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Truy cập và chỉnh sửa thông tin cá nhân trong phần hồ sơ.</li>
            <li>Yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan.</li>
            <li>Rút lại sự đồng ý sử dụng dữ liệu bất kỳ lúc nào.</li>
          </ul>
          <p>
            Để thực hiện các quyền trên, vui lòng liên hệ:{' '}
            <a
              href="mailto:support@tiralix.com"
              className="text-primary hover:underline"
            >
              support@tiralix.com
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            7. Thay đổi chính sách
          </h2>
          <p>
            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi
            thay đổi sẽ được thông báo trên trang này. Việc tiếp tục sử dụng
            dịch vụ sau khi chính sách được cập nhật đồng nghĩa với việc bạn
            chấp nhận các thay đổi đó.
          </p>
        </section>
      </div>
    </div>
  )
}
