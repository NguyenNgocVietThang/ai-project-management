# Rà soát nguồn các trang còn lại — 20/10/2026

Phạm vi: Dashboard, danh sách/chi tiết Danh mục, danh sách Dự án, Timesheet, Thành viên, Chat, Tài liệu, Admin (trang chính, người dùng, vai trò, nhật ký). Đã đọc kế hoạch `docs/superpowers/plans/2026-10-20-frontend-usability-redesign.md`, quy tắc AGENTS và frontend-ui-engineering; đã chạy Graphify query trước khi đọc mã (lệnh không trả nội dung trong phiên này). Đây là bằng chứng từ mã nguồn tại thời điểm rà soát, **chưa nghiệm thu trình duyệt cho các route này**. Không sửa mã ứng dụng trong lượt rà soát này.

## Backlog có bằng chứng

Đường dẫn dưới đây tính từ `frontend/src/`; số dòng ghi nhận trước các bản vá tiếp theo.

| Trang | Bằng chứng trong nguồn | Bản vá nhỏ đề xuất | Ưu tiên |
| --- | --- | --- | --- |
| Dashboard `/dashboard` | `features/dashboard/components/MyTasksList.tsx:57` có fallback `Overdue`; `RecentActivityFeed.tsx:49` in trực tiếp `entity_type` như Task/Project. Mặc dù trang chính và phần lớn thành phần đã dùng `home` translations, hai nhãn này không theo VI/EN. | Dịch fallback quá hạn và ánh xạ loại thực thể đã biết; vẫn giữ giá trị dự phòng cho loại mới. Trạng thái loading/error/empty đã có, không cần viết lại. | P2 |
| Danh mục `/portfolios` | `app/(dashboard)/portfolios/page.tsx:40–61` hard-code tiêu đề, tìm kiếm, lọc, loading và mô tả dialog bằng tiếng Anh. | Đưa các chuỗi nhìn thấy và tên truy cập vào namespace `portfolios`; giữ PageHeader, Modal và PageState chung đang dùng. | P2 |
| Chi tiết danh mục `/portfolios/[id]` | `app/(dashboard)/portfolios/[id]/page.tsx:41,75` tạo health query nhưng chỉ render khi `health.data` có giá trị; không có nhánh `health.isLoading/isError`. Lỗi health khiến cả phần sức khỏe biến mất trong khi phần danh mục vẫn hoạt động. `:84–85` bảng 560px có overflow nhưng không có nhãn vùng cuộn/hướng dẫn cuộn. Nội dung chính cũng hard-code tiếng Anh. | Thêm skeleton/error+retry **riêng phần health**, không chặn trang đã tải. Đặt tên vùng cuộn và tín hiệu cuộn; dịch nhãn. | P1 |
| Dự án `/projects` | `app/(dashboard)/projects/page.tsx:75–110` luôn hiện sáu bộ lọc cùng đổi chế độ; `:114` trạng thái lọc rỗng chỉ có tạo mới, không có xóa bộ lọc. `:118–119` bảng 760px không có nhãn vùng cuộn. Các nhãn/form `:63–135` hard-code tiếng Anh. | Đưa các bộ lọc ít dùng vào disclosure trên mobile; thêm xóa bộ lọc cho kết quả rỗng; dịch nhãn và dùng vùng cuộn có tên. Giữ query/filter hiện có. Chỉ khẳng định chiều cao/overflow toàn trang sau khi đo thực tế. | P2 |
| Timesheet `/projects/[id]/timesheet` | `app/(dashboard)/projects/[id]/timesheet/page.tsx:39–44,61–64` chỉ xử lý lỗi worklogs; lỗi leveling bị thay bằng `[]`, lỗi members khiến select không có tùy chọn và tên dùng `User #id` (`:48`). `:153–155` bảng 640px có caption nhưng div cuộn chưa có tên/tab stop. `:53` loading vẫn tiếng Anh. | Thêm lỗi+retry cục bộ cho cảnh báo và danh sách thành viên; phân biệt “không có cảnh báo” với “chưa tải được”. Dịch loading/fallback; bổ sung vùng cuộn có tên, giữ caption. | P1 |
| Thành viên `/projects/[id]/members` | `features/projects/components/ProjectMembersTable.tsx:17–21` bảng, trạng thái rỗng và xác nhận đều tiếng Anh; bảng 680px không có nhãn vùng cuộn. `InviteMemberDialog.tsx:38` chỉ hiển thị `users.data`, không có trạng thái loading/error của tìm kiếm. | Dịch page/table/dialog; thêm trạng thái tìm kiếm và retry trong InviteMemberDialog. Dùng vùng cuộn có tên cho bảng; giữ aria-label của nút xóa, xác nhận và capability hiện có. | P1 |
| Chat `/projects/[id]/chat` | `features/chat/components/ChatPanel.tsx:69–74` xóa draft trước khi REST fallback thành công; không có hiển thị `postMessage.isError` trong vùng nhập `:144–169`. `:82,105` dùng `h-[calc(100dvh-260px)] min-h-[420px]`, chưa theo chiều cao thực của shell. `:115` vùng tin không có tên ngữ nghĩa. Các nhãn `:108–165` hard-code tiếng Anh. | Giữ/khôi phục nội dung chưa gửi khi REST thất bại và hiện lỗi có thể thử lại; không tự gửi lại khi trạng thái WebSocket mơ hồ. Dịch nhãn, đặt tên lịch sử; kiểm chứng bố cục bằng viewport thấp và bàn phím ảo trước khi đổi công thức chiều cao. | P1 |
| Tài liệu `/projects/[id]/documents` | `app/(dashboard)/projects/[id]/documents/page.tsx:189` disclosure cảnh báo chỉ có `min-h-9` (36px), thấp hơn yêu cầu vùng chạm 44px của kế hoạch. `:39–41,152` ngày giờ dùng `toLocaleString()` theo môi trường trình duyệt, không dùng locale ứng dụng. Loading/error/empty và tên nút đã được dịch. | Đổi summary sang min-h-11 và focus-visible rõ; dùng formatter theo locale hiện hành cho thời gian. Kiểm tra badge trạng thái và tiêu đề dài ở 320px, không kết luận overflow chỉ từ flex. | P2 |
| Admin `/admin`, `/admin/users`, `/admin/roles`, `/admin/audit` | `app/(dashboard)/admin/page.tsx:44–45`, các trang con và bảng hard-code tiếng Anh. `features/admin/users/components/UserTable.tsx:43–44` và `features/audit/components/AuditLogTable.tsx:42–43` có bảng 820px; `features/admin/roles/components/RoleTable.tsx:39–40` bảng 720px; các div cuộn chưa có nhãn/tab stop. Nhật ký JSON `AuditLogTable.tsx:122,130` có vùng cuộn lồng. | Dịch nhãn và trạng thái/form theo nhóm Admin; dùng vùng cuộn có tên và hướng dẫn cho bảng. Kiểm tra bàn phím với JSON lồng; giữ nguyên quyền và xác nhận CRUD. Không thay quyền thật để kiểm tra UI. | P2 |

## Thành phần chung có thể dùng

- PageHeader/SectionHeader, Modal, Button/Input và PageState đã được các trang này dùng rộng rãi. Các sửa khung, focus dialog và target nút chung sẽ áp dụng; không nên sao chép riêng từng trang.
- Các bảng đang có **cuộn cục bộ**; audit nguồn không chứng minh chúng gây cuộn ngang toàn trang. Thiếu chắc chắn là thuộc tính vùng cuộn và tín hiệu hiển thị cho người dùng. Có thể tạo wrapper nhẹ nhận `aria-label`, `tabIndex={0}`, focus ring và mô tả cuộn được dịch, rồi thay đúng div overflow ở các bảng; giữ sticky header, caption và kích thước bảng.
- Không gom tất cả truy vấn phụ vào một error toàn trang. Health, leveling và thành viên cần lỗi/retry tại phần tương ứng để nội dung đã tải vẫn dùng được.
- Không đánh dấu các route này “đã hoàn tất” sau khi chỉ áp dụng thay đổi component chung.

## Kiểm tra trình duyệt còn thiếu

Harness hiện tại chỉ phục vụ fixture WBS/tasks/overview/gantt và đã được agent QA xác nhận chưa có fixture các trang trong báo cáo này. Chưa có ảnh trước/sau hay kết quả runtime cho các route còn lại. Đây là **backlog cần thực hiện**, không phải bằng chứng nghiệm thu.

1. Mở từng route trên 320/390/768/1024/1440px, VI/EN, sáng/tối; lưu ảnh cùng dữ liệu. Đo document scrollWidth; bảng/lịch chỉ cuộn trong vùng có tên.
2. Fixture đủ 0/1/50+ mục và tên dài; success/loading/error cho truy vấn chính **và phụ**. Dashboard summary, portfolio health, resource-leveling, members search, documents jobs và admin pagination cần payload riêng đúng kiểu.
3. Tab/Shift+Tab: filter, bảng cuộn, disclosure cảnh báo, dialog create/invite/remove, nhật ký JSON. Kiểm tra Escape và focus return; giữ quyền synthetic phù hợp trong fixture.
4. Chat: REST fallback thất bại giữ nguyên tin nhắn chưa gửi; composer còn nhìn thấy trên viewport thấp; tin cũ đang đọc không bị kéo về cuối khi nhận tin mới. Chỉ mô phỏng cục bộ, không gửi tin thật.
5. Documents: queued/generating/needs_clarification/ready/failed, lỗi tải/xuất; không gọi AI thật để chụp ảnh UI.

Sau khi các kiểm tra này chạy mới bổ sung kết quả và ảnh vào báo cáo nghiệm thu chung.
