import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng dịch vụ Tiralix – quy định về quyền và nghĩa vụ khi sử dụng nền tảng.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Điều khoản sử dụng</h1>
      <p className="mb-10 text-sm text-default-400">Cập nhật lần cuối: tháng 4, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-default-600">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">1. Chấp nhận điều khoản</h2>
          <p>
            Khi truy cập và sử dụng Tiralix, bạn đồng ý tuân thủ các điều khoản sử dụng dưới
            đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">2. Tài khoản người dùng</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Bạn phải từ 13 tuổi trở lên để tạo tài khoản.</li>
            <li>Thông tin đăng ký phải chính xác và đầy đủ.</li>
            <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
            <li>Mỗi người chỉ được sở hữu một tài khoản.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">3. Quy tắc sử dụng</h2>
          <p>Khi sử dụng Tiralix, bạn cam kết không:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Đăng tải nội dung vi phạm pháp luật, khiêu dâm, bạo lực hoặc xúc phạm người khác.</li>
            <li>Sao chép, phân phối nội dung truyện từ Tiralix mà không được phép.</li>
            <li>Sử dụng bot, script hay công cụ tự động để truy cập dịch vụ.</li>
            <li>Cố tình làm gián đoạn hoặc phá hoại hệ thống.</li>
            <li>Mạo danh người khác hoặc tổ chức khác.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">4. Nội dung và bản quyền</h2>
          <p>
            Toàn bộ nội dung truyện trên Tiralix được đăng tải bởi các dịch giả và thuộc quyền
            sở hữu của tác giả gốc. Tiralix không sở hữu bản quyền nội dung và không chịu trách
            nhiệm về tính chính xác hay hợp pháp của nội dung dịch.
          </p>
          <p>
            Nếu bạn là chủ sở hữu bản quyền và phát hiện nội dung vi phạm, vui lòng liên hệ:{' '}
            <a href="mailto:support@tiralix.com" className="text-primary hover:underline">
              support@tiralix.com
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">5. Bình luận</h2>
          <p>
            Bình luận của bạn phải tuân thủ cộng đồng: lịch sự, không spam, không chứa liên kết
            độc hại, không tiết lộ nội dung (spoiler) mà không cảnh báo. Tiralix có quyền xóa
            bất kỳ bình luận nào vi phạm mà không cần thông báo trước.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">6. Thanh toán và xu</h2>
          <p>
            Một số chương truyện có thể yêu cầu xu để mở khóa. Xu được mua thông qua hệ thống
            thanh toán của Tiralix và không thể đổi lại thành tiền mặt. Mọi giao dịch mua xu là
            cuối cùng và không được hoàn lại trừ trường hợp lỗi kỹ thuật từ phía Tiralix.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">7. Chấm dứt tài khoản</h2>
          <p>
            Tiralix có quyền khóa hoặc xóa tài khoản của bạn nếu phát hiện vi phạm điều khoản
            sử dụng, mà không cần thông báo trước. Bạn cũng có thể tự xóa tài khoản bất kỳ lúc
            nào bằng cách liên hệ bộ phận hỗ trợ.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">8. Giới hạn trách nhiệm</h2>
          <p>
            Tiralix cung cấp dịch vụ trên cơ sở "nguyên trạng". Chúng tôi không đảm bảo dịch vụ
            hoạt động liên tục, không có lỗi và không chịu trách nhiệm cho bất kỳ thiệt hại nào
            phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">9. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có thể cập nhật điều khoản này bất kỳ lúc nào. Thay đổi sẽ có hiệu lực
            ngay khi được đăng tải. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập
            nhật đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">10. Liên hệ</h2>
          <p>
            Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:{' '}
            <a href="mailto:support@tiralix.com" className="text-primary hover:underline">
              support@tiralix.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
