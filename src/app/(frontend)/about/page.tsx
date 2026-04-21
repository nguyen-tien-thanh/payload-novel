import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giới thiệu',
  description: 'Tìm hiểu về Tiralix – nền tảng đọc truyện online miễn phí, cập nhật nhanh nhất.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Giới thiệu về Tiralix</h1>
      <p className="mb-10 text-sm text-default-400">Cập nhật lần cuối: tháng 4, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-default-600">
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Tiralix là gì?</h2>
          <p>
            Tiralix là nền tảng đọc truyện online miễn phí, nơi bạn có thể khám phá hàng nghìn
            đầu truyện thuộc nhiều thể loại khác nhau — từ tiên hiệp, kiếm hiệp, ngôn tình đến
            trinh thám, fantasy và nhiều hơn nữa. Chúng tôi cam kết mang đến trải nghiệm đọc
            truyện nhanh, mượt mà và không quảng cáo gây khó chịu.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Sứ mệnh</h2>
          <p>
            Chúng tôi tin rằng văn học và câu chuyện có sức mạnh kết nối con người. Tiralix được
            xây dựng với mục tiêu tạo ra một không gian đọc truyện thân thiện, nơi độc giả có thể
            tìm đến bất cứ lúc nào — trên mọi thiết bị, mọi nơi.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Dành cho dịch giả</h2>
          <p>
            Tiralix tạo điều kiện để các dịch giả tài năng chia sẻ tác phẩm của mình đến đông
            đảo độc giả. Nếu bạn đam mê dịch thuật và muốn đóng góp cho cộng đồng, hãy{' '}
            <a href="/become-translator" className="text-primary hover:underline">
              đăng ký trở thành dịch giả
            </a>{' '}
            ngay hôm nay.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Liên hệ</h2>
          <p>
            Mọi góp ý, báo lỗi hoặc hợp tác, vui lòng liên hệ qua email:{' '}
            <a href="mailto:support@tiralix.com" className="text-primary hover:underline">
              support@tiralix.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
