# Nebula Chat App

Ứng dụng chat AI sử dụng Nebula Block API, được thiết kế với giao diện tương tự ChatGPT.

## Tính năng

- 💬 Giao diện chat thân thiện giống ChatGPT
- 🔐 Quản lý API key an toàn
- 📱 Responsive design cho mobile
- ⚡ Real-time chat với AI
- 🎨 Giao diện đẹp và hiện đại
- 🔄 Lưu trữ lịch sử hội thoại
- ⚙️ Cài đặt API key dễ dàng

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd nebula-chat-app
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm run dev
```

4. Mở trình duyệt và truy cập: `http://localhost:3000`

## Cấu hình API

1. Đăng ký tài khoản tại [Nebula Block](https://nebula.computing.com)
2. Lấy API key từ dashboard
3. Nhập API key vào ứng dụng khi được yêu cầu

## Cấu trúc dự án

```
src/
├── api/
│   └── nebulaApi.js          # Service tương tác với Nebula API
├── components/
│   ├── ApiKeyModal.jsx       # Modal nhập API key
│   ├── ChatInput.jsx         # Component input tin nhắn
│   └── ChatMessage.jsx       # Component hiển thị tin nhắn
├── App.jsx                   # Component chính
├── main.jsx                  # Entry point
└── index.css                 # Styles chính
```

## Sử dụng

1. **Nhập API Key**: Khi lần đầu sử dụng, ứng dụng sẽ yêu cầu nhập Nebula API key
2. **Bắt đầu chat**: Nhập tin nhắn và nhấn Enter hoặc nút "Gửi"
3. **Quản lý**: Sử dụng các nút trong header để xóa chat hoặc đăng xuất

## Tính năng kỹ thuật

- **React 18** với Hooks
- **Vite** cho development và build
- **Axios** cho HTTP requests
- **Lucide React** cho icons
- **LocalStorage** để lưu API key
- **Responsive CSS** cho mobile

## API Endpoints

Ứng dụng sử dụng các endpoint sau của Nebula API:

- `POST /chat/completions` - Gửi tin nhắn chat
- `GET /models` - Lấy danh sách models
- `GET /user` - Lấy thông tin user

## Tùy chỉnh

### Thay đổi API URL
Chỉnh sửa `API_BASE_URL` trong `src/api/nebulaApi.js`:

```javascript
const API_BASE_URL = 'https://your-nebula-api-url.com';
```

### Thay đổi Model
Chỉnh sửa model trong `sendChatMessage` function:

```javascript
model: 'your-preferred-model'
```

## Troubleshooting

### Lỗi API Key
- Kiểm tra API key có hợp lệ không
- Đảm bảo có đủ credits trong tài khoản Nebula
- Kiểm tra kết nối internet

### Lỗi CORS
- Đảm bảo Nebula API cho phép requests từ domain của bạn
- Kiểm tra cấu hình CORS trên server

## License

MIT License

## Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository. 