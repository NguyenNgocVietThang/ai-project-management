## graphify

Dự án có đồ thị tri thức tại `graphify-out/`, gồm các nút trung tâm, cấu trúc cộng đồng và quan hệ giữa các tệp.

Quy tắc:
- Khi có câu hỏi về mã nguồn và `graphify-out/graph.json` tồn tại, chạy `graphify query "<câu hỏi>"` trước. Dùng `graphify path "<A>" "<B>"` để tìm quan hệ và `graphify explain "<khái niệm>"` để phân tích một khái niệm. Các lệnh này trả về đồ thị con đúng phạm vi, thường nhỏ hơn nhiều so với `GRAPH_REPORT.md` hoặc kết quả tìm kiếm thô.
- Nếu `graphify-out/wiki/index.md` tồn tại, dùng tệp này để điều hướng tổng quan thay vì duyệt trực tiếp mã nguồn.
- Chỉ đọc `graphify-out/GRAPH_REPORT.md` khi cần rà soát kiến trúc tổng thể hoặc khi các lệnh query/path/explain chưa cung cấp đủ ngữ cảnh.
- Sau khi sửa mã, chạy `graphify update .` để cập nhật đồ thị (chỉ dùng AST, không tốn chi phí API).
