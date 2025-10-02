import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-slate-50">
      <img
        src="404NotFound.png"
        alt="Not Found"
        className="max-w-full mb-6 w-96"
      />
      
      <p className="text-xl font-semibold">
        📢 Không tìm thấy nội dung bạn cần tìm❌
      </p>

      <a
        href="/"
        className="inline-block mt-6 px-6 py-3 font-medium text-shadow-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark"
      >
        Quay về trang chủ
      </a>
    </div>
  );
};

export default NotFound;
