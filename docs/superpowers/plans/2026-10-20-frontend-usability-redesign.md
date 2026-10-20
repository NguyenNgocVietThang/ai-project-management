# Thiết kế lại giao diện dễ sử dụng — Implementation Plan

> **For agentic workers:** Use executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. Chỉ bắt đầu triển khai khi có yêu cầu thực hiện; lượt hiện tại giao báo cáo và kế hoạch.

**Goal:** Người dùng máy tính và điện thoại tìm được chức năng, xem công việc và mở biểu mẫu mà không bị phần trang trí, bộ lọc hoặc bố cục che nội dung chính.

**Architecture:** Giữ Next.js, React Query, dịch vụ và route hiện có. Thay khung ứng dụng và thành phần hiển thị từng đợt; tách navigation, bộ lọc và WBS thành thành phần tập trung. Mỗi đợt có kiểm tra trình duyệt trước khi mở rộng.

**Tech Stack:** Next.js 15, React 18, TypeScript, Tailwind, next-intl, React Query, Vitest/Testing Library hiện có; không thêm bộ UI mới trong đợt đầu.

**Spec:** `docs/ui-audit-2026-10-20/README.md` và ảnh cùng thư mục. Đây là hướng thiết kế đề xuất từ quan sát thực tế, chưa phải giao diện đã triển khai.

## Global Constraints

- Giữ route/deep link và dữ liệu hiện có; không tự đổi Phase thành Sprint hay suy ra ngày từ tên để ghi đè dữ liệu.
- Kiểm tra 320, 390, 768, 1024, 1440px; cả sáng và tối, VI và EN.
- Chữ thường tối thiểu tương phản 4.5:1; chữ lớn 3:1. Không dùng màu làm tín hiệu duy nhất.
- Vùng chạm cho hành động chính tối thiểu 44×44 CSS px; font nội dung 14–16px, nhãn phụ từ 12px.
- Không có cuộn ngang toàn trang; chỉ cho cuộn cục bộ với bảng/lịch có nhãn và tín hiệu rõ.
- Bàn phím dùng được: focus rõ, Tab hợp lý, Escape đóng, focus trở lại nút mở.
- Loading, empty, error có thông điệp và hành động phục hồi; không hiển thị khóa dịch thô.
- Giữ màu xanh hiện có làm màu nhấn, nền đặc trung tính cho nội dung nghiệp vụ; giảm nền ảnh/blur/chuyển động. Không đổi theme đã lưu của người dùng trong đợt sửa lỗi.

## Hướng bố cục đề xuất

**Desktop:** Sidebar toàn cục thu gọn được; header dự án gọn có tên và trạng thái. Thanh chức năng ưu tiên Tổng quan, Công việc, Kế hoạch và menu Thêm. Kế hoạch chứa WBS/Gantt; Thêm chứa Chấm công, Thành viên, Trò chuyện, Yêu cầu thay đổi, Phiên bản, Tài liệu, Quy trình, Thông tin AI, Cài đặt. Các nhãn nhóm chỉ phục vụ điều hướng, giữ nguyên URL đích và dấu hiệu trang hiện tại.

**Mobile:** Header 56–64px, tên dự án tối đa hai dòng. Hiện Tổng quan, Công việc, Kế hoạch và nút Thêm có danh sách đầy đủ, không bắt người dùng đoán có thể vuốt 13 tab. Công việc mặc định là danh sách gọn khi chưa có lựa chọn đã lưu; từng mục hiển thị tên, trạng thái, người phụ trách và hạn. Bộ lọc nâng cao trong sheet; chi tiết công việc và form dài dùng panel toàn màn hình với footer.

**WBS:** Mỗi giai đoạn là một dòng cây có số lượng, khoảng ngày, tiến độ và nút mở; con chỉ hiện khi mở. Hiển thị “Chưa đặt ngày”, phân biệt Giai đoạn/Sprint/Epic/Cột mốc bằng chữ. Hành động chính “Thêm giai đoạn”; nhóm tạo loại khác trong menu có nhãn. Hành động xóa ở menu riêng, giữ nguyên xác nhận và kiểm tra tác động.

**Công việc:** Tìm kiếm + người phụ trách/trạng thái thường dùng + Bộ lọc (số đang áp dụng). Hiện chip bộ lọc và Xóa bộ lọc. Desktop bảng/Kanban, mobile danh sách; đổi chế độ không mất tìm kiếm. Kết quả hiển thị “1 kết quả” hoặc số đã lọc/tổng thực nếu API cung cấp, không dùng mẫu số gây hiểu sai.

## Đợt 1 — Sửa lỗi cản trở thao tác (ước lượng 1–2 ngày làm việc)

**Modify:** `frontend/src/components/common/Modal.tsx`, `Modal.test.tsx`; `frontend/src/app/(dashboard)/projects/[id]/wbs/page.tsx`; `frontend/messages/vi.json`, `en.json`.

**Create:** `frontend/src/app/(dashboard)/projects/[id]/wbs/page.test.tsx` nếu chưa có.

- [ ] Tái hiện dialog ở 390×844 và 320px, đầu trang và sau khi cuộn. Ghi bounding rect ổn định; kiểm tra ancestor có transform/filter/contain tạo containing block.
- [ ] Tạo regression test Modal: render trong ancestor có transform, dialog là con portal của body, Escape gọi đóng, Tab/Shift+Tab ở lại dialog, đóng trả focus.
- [ ] Sửa Modal bằng portal sau khi xác nhận môi trường client; overlay bám viewport, giới hạn chiều cao theo dvh, body cuộn và footer có thể tiếp cận. Cập nhật call site cần footer; không làm mất aria-labelledby/aria-modal.
- [ ] Thay chuỗi form WBS viết trực tiếp bằng khóa next-intl; bổ sung taskCount/delete và trạng thái, placeholder ngày thiếu. Kiểm tra plural theo cấu hình hiện có.
- [ ] Kiểm tra New phase tại 320/390/768/1440, với tên dài và lỗi validation; nút Lưu không bị ngoài vùng có thể thao tác. Không submit vào production để thử.
- [ ] Chạy test Modal/WBS, lint, type-check. Chụp ảnh trước/sau local; chỉ tích hoàn thành khi không còn MISSING_MESSAGE trong các luồng vừa sửa.

## Đợt 2 — Khung ứng dụng và điều hướng (2–3 ngày)

**Modify:** `frontend/src/app/(dashboard)/layout.tsx`, `frontend/src/app/(dashboard)/projects/[id]/layout.tsx`, `frontend/src/components/layout/Navigation.tsx`, `frontend/src/components/ui/PageHeader.tsx`, `frontend/src/app/globals.css`, `frontend/src/components/background/AppBackground.tsx`.

**Create:** `frontend/src/features/projects/components/ProjectNavigation.tsx`, `ProjectNavigation.test.tsx`; thêm test khung dự án bên cạnh layout.

- [ ] Tạo bản bố cục desktop/mobile dùng tên dự án và 17 công việc thật của mẫu; rà độ cao header và vị trí nội dung đầu tiên.
- [ ] Bổ sung biến thể header gọn cho màn hình nghiệp vụ, giữ semantic h1; bỏ chuyển động chữ ở khu vực thường xuyên thao tác.
- [ ] Đặt nền đặc cho workspace; đưa tùy chỉnh trang trí về phần cá nhân hóa, không chiếm sidebar chính. Tôn trọng prefers-reduced-motion.
- [ ] Tạo ProjectNavigation nhận projectId và route hiện tại; ánh xạ đủ 13 route cũ vào nhóm, giữ unread badge Chat và aria-current trên mục hiện tại. Nút Thêm mở/đóng bằng bàn phím.
- [ ] Viết test đủ 13 link, route đang chọn, truy cập trực tiếp /settings hoặc /documents vẫn thấy ngữ cảnh đúng; kiểm tra màn hình chuyển 1023→1024 không chồng hai menu.
- [ ] Nghiệm thu: đến mọi mục trong tối đa hai lần bấm từ thanh điều hướng dự án; không phải vuốt để khám phá; ở 390×844 tiêu đề trang và hành động chính hiện ngay.

## Đợt 3 — Danh sách công việc và bộ lọc (2–3 ngày)

**Modify:** `frontend/src/app/(dashboard)/projects/[id]/tasks/page.tsx`, `frontend/src/features/tasks/components/TaskDrawer.tsx`.

**Create:** `frontend/src/features/tasks/components/TaskFilters.tsx`, `TaskFilters.test.tsx`, `MobileTaskList.tsx`, `MobileTaskList.test.tsx`.

- [ ] Tách thanh lọc khỏi page; giữ contract TaskListParams và debounce hiện có. Tìm kiếm luôn hiện, advanced filters chỉ mở theo yêu cầu.
- [ ] Giữ đầy đủ trạng thái/ưu tiên/giai đoạn/sprint/epic/người phụ trách/nhãn/khoảng hạn; hiển thị số filter, reset rõ ràng; thay filter quay về trang 1.
- [ ] Tạo MobileTaskList dùng cùng kết quả query, có nút mở chi tiết semantic; cung cấp đổi trạng thái bằng menu khi triển khai, không yêu cầu kéo thả.
- [ ] Lưu filter/view trong URL theo parser có allowlist; ưu tiên view người dùng đã chọn, chỉ dùng mặc định mobile khi không có view. Back/Forward khôi phục đúng filter; không nhân đôi nguồn state.
- [ ] Test “Phân tích” còn một kết quả; clear khôi phục 17 trong fixture; đổi List/Board giữ search; lọc rỗng có Xóa bộ lọc; lỗi query có Thử lại.
- [ ] Nghiệm thu 390×844: sau khi tải, tối thiểu một công việc hiện trong màn hình đầu với filter nâng cao đóng. Mở task không mất vị trí danh sách khi quay lại.

## Đợt 4 — WBS và tổng quan (2–3 ngày)

**Modify:** WBS page, `frontend/src/app/(dashboard)/projects/[id]/overview/page.tsx`, `overview/charts.tsx`.

**Create:** `frontend/src/features/wbs/components/WBSTree.tsx`, `WBSNodeRow.tsx`, `WBSTree.test.tsx`.

- [ ] Tách cây WBS khỏi CRUD/editor. Dùng disclosure/button native; tên dài wrap, nhãn loại độc lập với tên, actions không lẫn với nút mở cây.
- [ ] Thu gọn vùng con rỗng; CTA Thêm sprint có ngữ cảnh giai đoạn; vẫn hỗ trợ sprint không có giai đoạn, Epic và Cột mốc.
- [ ] Viết test đóng/mở, tên dài, không có ngày, không có con, nhiều cấp; vẫn giữ nguyên phase_id/sprint_id và payload CRUD.
- [ ] Tổng quan đưa việc cần chú ý và lối vào công việc lên trước; mô tả dài thu gọn; biểu đồ và bảng chi tiết mở sau, dịch đủ các heading.
- [ ] Tạo hạng mục dữ liệu riêng cho Phase có tên Sprint và ngày trống. Kiểm chứng hợp đồng AI/persistence trước khi đề xuất chuyển đổi; UI không tự sửa dữ liệu.
- [ ] Nghiệm thu: xem được danh sách ba giai đoạn bằng ít cuộn hơn baseline; người dùng phân biệt được tên giai đoạn, số công việc, ngày và trạng thái; dữ liệu thiếu được mô tả đúng.

## Đợt 5 — Lịch và các trang còn lại (2–4 ngày, sau đợt kiểm tra mở rộng)

**Modify:** `frontend/src/components/gantt/GanttChart.tsx`, `GanttChart.test.tsx`, `frontend/src/app/(dashboard)/projects/[id]/gantt/page.tsx`, `gantt/page.test.tsx`.

- [ ] Tái kiểm tra Day/Week/Month bằng trạng thái chọn và thang thời gian thực; có tên đầy đủ khi focus/chọn task, vùng lịch mở rộng và cột tên có độ rộng phù hợp.
- [ ] Mobile có danh sách lịch theo ngày/tuần, vẫn có tùy chọn Gantt cuộn cục bộ; không thu cả desktop chart vào màn hình điện thoại.
- [ ] Rà và chụp thêm Dashboard, Danh mục, Dự án, Timesheet, Thành viên, Chat, Tài liệu và Admin với quyền tương ứng. Ghi backlog theo từng lỗi trước khi đổi bố cục riêng của chúng.
- [ ] Áp dụng component chung đã nghiệm thu; không đánh dấu các trang chưa kiểm tra là đã hoàn tất.

## Đợt 6 — Nghiệm thu và phát hành (1–2 ngày)

- [ ] Trong `frontend`: chạy `npm run lint`, `npm run type-check`, `npm test`, `npm run build`; xử lý lỗi mới, không hạ tiêu chuẩn hay bỏ test để qua.
- [ ] Trên staging, kiểm tra 320/390/768/1024/1440, VI/EN, sáng/tối; chụp cùng route và dữ liệu baseline. Thêm dữ liệu test có 0/1/50+ task và tên dài.
- [ ] Kiểm tra axe hoặc công cụ tương đương, tương phản, toàn bộ luồng Tab, focus trap/restore, reduced motion; ghi lỗi hiện có riêng.
- [ ] Thử thiết bị thật iOS Safari và Android Chrome: bàn phím ảo, safe-area, form ngày, cuộn sheet; desktop Chrome/Brave và Firefox.
- [ ] Tối thiểu ba người đại diện thử: tìm task, lọc của mình, mở/sửa task, thêm giai đoạn trên staging, tìm tài liệu. Mục tiêu đề xuất: ≥90% tác vụ hoàn thành không cần hướng dẫn, không lỗi chặn thao tác; nếu không đạt thì sửa trước khi mở rộng phát hành.
- [ ] Review diff và đối chiếu checklist trước phát hành. Triển khai staging trước, lưu commit/build rollback; sau production chạy lại smoke test không phá dữ liệu. Chỉ xác nhận thành công khi đã xem UI triển khai và lưu ảnh.
- [ ] Sau sửa mã chạy `graphify update .`; kiểm tra Git để phân biệt thay đổi đồ thị sinh ra và thay đổi tính năng.

## Thứ tự và giới hạn ước lượng

Đợt 1 → 2 → 3 → 4 → 5 → 6. Tổng khoảng 10–17 ngày làm việc cho một người, là ước lượng sơ bộ sau kiểm tra chọn mẫu; cần cập nhật khi rà các trang còn lại. Bàn giao sớm sau đợt 1–3 để kiểm chứng khả năng sử dụng trước khi mở rộng toàn hệ thống. Kế hoạch này chưa thực thi, chưa có thay đổi giao diện production.
