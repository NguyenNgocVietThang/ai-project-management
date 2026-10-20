# Kiểm tra giao diện triển khai — 20/10/2026

URL bắt đầu: https://ai-project-frontend-5zvz.onrender.com/projects/2/wbs

Đã thao tác trực tiếp trên website với phiên đăng nhập hiện có. Đây là kiểm tra UX có chọn mẫu, không phải chứng nhận toàn bộ chức năng của hệ thống. Không lưu biểu mẫu, đổi trạng thái công việc, xóa dữ liệu hay gọi tạo dự án AI.

## Phạm vi và bằng chứng

| Luồng | Thao tác và kết quả | Bằng chứng |
|---|---|---|
| WBS desktop | Xem ba giai đoạn; mở Phase; hủy biểu mẫu | 01-wbs-desktop.jpg, 02-phase-dialog-desktop.jpg |
| Công việc desktop | Chuyển từ WBS sang Công việc; tải được 17 công việc, 16 Todo và 1 In Progress | 03-tasks-desktop.jpg |
| Công việc mobile | Xem bảng; tìm “Phân tích”; kết quả còn 1 công việc; chuyển Danh sách thành công | 04-tasks-mobile.jpg, 05-tasks-list-mobile.jpg |
| WBS mobile | Mở biểu mẫu Phase; Escape đóng được | 06-wbs-mobile.jpg, 07-phase-dialog-mobile.jpg |
| Tổng quan mobile | Mở được tổng quan, chỉ số và giai đoạn | 09-overview-mobile.jpg |
| Điều hướng mobile | Mở được menu, có dialog và nút đóng nhận focus | 10-navigation-mobile.jpg |
| Gantt desktop | Hiển thị danh sách và biểu đồ; bấm Month, chưa xác nhận đầy đủ trạng thái chọn nên không kết luận luồng zoom đạt | 08-gantt-desktop.jpg, 11-gantt-month-desktop.jpg |
| Responsive | Chụp WBS tại 320, 768, 1024; desktop 1440×900 và mobile 390×844 | wbs-320.jpg, wbs-768.jpg, wbs-1024.jpg; measurements.json |

Hai phiên độc lập được xác minh đồng thời: Brave 1440×900 và trình duyệt trong ứng dụng 390×844. Brave đang dùng tiếng Anh, phiên trong ứng dụng tiếng Việt; không so sánh khác biệt ngôn ngữ như lỗi responsive. Ảnh desktop tiếng Việt đầu tiên được chụp trong ứng dụng trước khi tách phiên.

## Phát hiện ưu tiên

| Mức | Phát hiện quan sát được | Tác động | Hướng sửa |
|---|---|---|---|
| P1 | Dialog New phase tại 390×844 có top khoảng 639px, bottom khoảng 1202px sau khi ổn định | Phần dưới và nút lưu nằm ngoài khung nhìn ban đầu | Portal ra document.body, giới hạn theo viewport, footer dễ tiếp cận; kiểm tra cả trang đã cuộn và bàn phím ảo |
| P1 | Bộ lọc công việc có 10 trường, xếp dọc trên mobile; chưa thấy công việc trong màn hình đầu | Phải cuộn nhiều trước khi làm việc | Giữ tìm kiếm và nút Bộ lọc; phần nâng cao mở riêng |
| P1 | 13 mục điều hướng dự án nằm trên một hàng cuộn; nav có scrollWidth khoảng 1607–1639px trong các mẫu | Nhiều chức năng khó phát hiện, đặc biệt trên điện thoại | Nhóm điều hướng và menu Tất cả mục có nhãn rõ |
| P1 | `wbs.taskCount` xuất hiện trực tiếp; console báo MISSING_MESSAGE cho wbs.taskCount và wbs.delete (vi) | Mất thông tin số lượng, giảm độ tin cậy | Hoàn thiện khóa dịch và kiểm tra VI/EN |
| P2 | Nền ảnh đêm nhiều chi tiết, bề mặt trong suốt, chữ phụ nhỏ/xám | Nhiều yếu tố cạnh tranh với dữ liệu | Nền đặc cho màn hình nghiệp vụ, giảm hiệu ứng |
| P2 | Phase, Milestone, Planned, Not set và toàn bộ form New phase còn tiếng Anh trong phiên tiếng Việt | Tăng chi phí hiểu và học thao tác | Chuẩn hóa thuật ngữ, dịch form/trạng thái/ngày |
| P2 | WBS mở sẵn các vùng “chưa có sprint”, khung trống chiếm diện tích | Ít giai đoạn hiển thị cùng lúc | Dòng cây gọn, mở chi tiết khi cần; empty state có hành động |
| P2 | Ba bản ghi nằm dưới Giai đoạn nhưng tên bắt đầu bằng Sprint; ngày chỉ có trong tên, trường ngày hiện Not set | Người dùng khó hiểu cấu trúc và độ tin cậy lịch | Phân biệt rõ loại và giá trị thiếu; kiểm tra riêng dữ liệu nhập AI trước khi tính đến sửa dữ liệu |
| P2 | Gantt desktop cắt ngắn tên công việc và có vùng cuộn bên trong | Khó đối chiếu tên dài với thanh lịch | Cho mở chi tiết, đổi độ rộng cột tên, mở rộng khu vực lịch |

Không phát hiện tràn ngang toàn document trong mẫu WBS 320/768/1024. Cuộn ngang của thanh điều hướng là có chủ ý trong mã hiện tại, nhưng khó khám phá; không đánh đồng với lỗi tràn trang.

## Giới hạn kiểm tra

- Mobile được mô phỏng bằng viewport; chưa thử thiết bị thật, bàn phím ảo và thao tác cảm ứng vật lý.
- Chưa chạy axe, đo tương phản định lượng, hiệu năng hoặc hoàn thành toàn bộ vòng Tab. Escape và focus ban đầu của dialog đã được thử.
- Chưa kiểm tra mọi trang quản trị, danh mục, chat, tài liệu, timesheet; các trang này nằm trong đợt rà soát mở rộng.
- Chưa xác định chắc nguyên nhân vị trí dialog trên bản triển khai. Mã Modal hiện render tại chỗ, không portal; cần tái hiện và kiểm tra containing block của các ancestor trước khi sửa.

Kế hoạch triển khai: ../superpowers/plans/2026-10-20-frontend-usability-redesign.md
