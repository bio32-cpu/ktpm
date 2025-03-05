import React, { useState, useEffect } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import BackGround from "../assets/bg.png"

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Kích hoạt hiển thị hoạt ảnh khi trang tải
  }, []);

  return (
    <main className="pt-1 pb-16">
      <div className="container px-6 mx-auto">
        <LazyMotion features={domAnimation}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-between gap-12 md:flex-row"
          >
            <div className="relative w-full md:w-1/2">
              <img
                src={BackGround}
                alt="Smartphone"
                className="w-full h-auto shadow-2xl rounded-2xl"
              />
              <div className="absolute p-4 text-gray-900 transform -translate-x-1/2 bg-white rounded-lg shadow-xl top-1/4 left-1/2">
                <p className="font-medium">Giải pháp mới!</p>
                <p className="text-sm text-gray-600">Liên hệ với chúng tôi ngay bây giờ</p>
              </div>
            </div>

            <div className="w-full text-center md:w-1/2 md:text-left">
              <m.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text"
              >
                Biến đổi doanh nghiệp của bạn với giải pháp của chúng tôi
              </m.h1>

              <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8 text-lg leading-relaxed text-gray-500"
              >
                Trải nghiệm tương lai của quản lý doanh nghiệp với nền tảng sáng tạo của chúng tôi. Tối ưu hóa quy trình, nâng cao năng suất và thúc đẩy tăng trưởng với bộ công cụ toàn diện được thiết kế cho các doanh nghiệp hiện đại.
              </m.p>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4 md:space-y-0 md:space-x-4"
              >
                <button
                  className="px-8 py-3 text-white transition-all duration-300 bg-blue-600 rounded-full form text- hover:bg-blue-700 hover:scale-105"
                  aria-label="Download Now"
                >
                  Tải về ngay!
                </button>
                <p className="mt-4 text-sm text-gray-400">
                  Bắt đầu dùng thử miễn phí 30 ngày. Không cần thẻ tín dụng.
                </p>
              </m.div>
            </div>
          </m.div>
        </LazyMotion>
      </div>
    </main>
  );
}

export default Home;