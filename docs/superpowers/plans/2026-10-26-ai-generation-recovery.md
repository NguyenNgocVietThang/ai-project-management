# AI Generation Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Use fresh implementer/reviewer agents only when separately authorized by the user.

**Goal:** Hiển thị đúng kết quả job AI sau khôi phục phiên, tránh trạng thái chờ vô hạn và lưu đúng phương pháp quản lý dự án.

**Architecture:** Giữ kiến trúc cookie phiên, access token trong bộ nhớ, Zustand và TanStack Query. Đồng bộ danh tính khi tải `/auth/me`; polling vẫn chỉ chạy với phiên và người dùng hợp lệ. Mở rộng hợp đồng kế hoạch AI với phương pháp dự án được xác nhận trước khi enqueue; persistence xác thực và lưu trường này.

**Tech Stack:** Next.js, React, Zustand, TanStack Query, next-intl, Vitest, FastAPI, Pydantic, SQLAlchemy, pytest.

**Spec:** Các yêu cầu và quyết định thiết kế dưới đây là đặc tả của bản sửa này. Trạng thái: kế hoạch để duyệt; chưa triển khai.

## Evidence and boundaries

- Điều tra chỉ đọc đã xác nhận job AI hoàn tất và dự án đầu ra tồn tại trong khi giao diện vẫn hiện đang soạn kế hoạch.
- Tái hiện từ source: `/auth/me` có kết quả, `useAuth().user` có ID, nhưng `authStore.user` vẫn null; `useJobPollingOptions(true).enabled` là false. Khi store có người dùng, enabled trở thành true.
- `GenerationStatus` hiển thị skeleton cho cả trường hợp query chưa chạy, chưa phân biệt với job đang xử lý.
- `_persist_plan` không truyền methodology vào `ProjectCreate`; schema mặc định `agile`. Prompt AI cũng chưa có trường methodology.
- Supabase REST có lỗi schema cache riêng. Chưa có bằng chứng lỗi này gây ra spinner; không gộp việc sửa hạ tầng vào bản sửa ứng dụng.
- Chỉ tạo kế hoạch ở bước hiện tại. Không sửa source, chạy lại job, đổi production, commit, push hoặc deploy.

## Global Constraints

- Không bỏ điều kiện xác thực hoặc owner để ép polling hoạt động.
- Không lưu token vào localStorage; không mở rộng quyền truy cập job.
- Không tự gửi lại lệnh tạo dự án khi tải trang, retry trạng thái hoặc reconnect.
- Trạng thái lâu không đồng nghĩa job thất bại; không tự đánh dấu FAILED bằng đồng hồ frontend.
- Giữ hợp đồng trạng thái API hiện hành: PENDING, PROCESSING, COMPLETED, FAILED.
- Thông báo mới có đủ VI/EN, hỗ trợ keyboard và màn hình 390/1440 px.
- Không suy ra methodology bằng tìm từ khóa trong tên dự án.
- Không sửa đổi bảy khóa cố định của requirement brief chỉ để thêm methodology.
- Dữ liệu production đã tạo cần bước phục hồi riêng có xác nhận; không tự backfill hàng loạt.
- Kiểm tra diff đang có trước thực hiện; không gộp thay đổi Task Views hoặc Graphify có sẵn.

## Acceptance criteria

1. Sau reload với cookie phiên hợp lệ, `/auth/me` thành công phải đưa danh tính vào auth store và bật job polling.
2. Hoàn tất job có sẵn phải hiện nút xem dự án, cập nhật danh sách và không gọi lại provider.
3. Logout/chuyển tài khoản không giữ danh tính, kết quả job hoặc trạng thái khôi phục của người dùng trước.
4. Offline, tab nền, lỗi trạng thái và chờ lâu không bị trình bày như AI chắc chắn vẫn chạy.
5. Phương pháp người dùng chọn phải đi nguyên vẹn qua enqueue, prompt, validation và persistence; Waterfall phải lưu `waterfall`.
6. Job cũ và staged result thiếu methodology được xử lý tương thích, không gọi lại AI chỉ để bổ sung trường này.

## Task 1: Synchronize restored session identity

**Files**
- Modify: `frontend/src/hooks/useAuth.ts`
- Inspect/modify only if needed: `frontend/src/store/authStore.ts`, `frontend/src/services/api.ts`, `frontend/src/app/(dashboard)/layout.tsx`
- Create: `frontend/src/hooks/useAuth.test.tsx`
- Extend: `frontend/src/features/jobs/hooks/useAIJobPolling.test.tsx`, `frontend/src/app/(dashboard)/layout.test.tsx`

**Interfaces:** Giữ `useAuth()` và `useAuthStore` public API hiện hành. Khi hồ sơ phiên hiện hành đã tải thành công, store và dữ liệu giao diện phải cùng danh tính.

- [ ] Viết test failing với store `{accessToken: fixture, hasHydrated: true, user: null}`; mock `/auth/me` trả người dùng; mount cùng useAuth và useAIJob; assert store có người dùng và getJob được gọi.
- [ ] Thêm test phản hồi `/auth/me` đến muộn sau logout/chuyển tài khoản không được ghi người dùng cũ vào store. Test `/auth/me` lỗi không bật polling và không khôi phục danh tính cũ.
- [ ] Chạy test để xác nhận thất bại vì thiếu đồng bộ, không phải lỗi fixture.
- [ ] Đồng bộ hồ sơ vào store bằng effect có ràng buộc phiên: chỉ áp kết quả thuộc access token/phiên đã khởi tạo query; không áp sau clear hoặc đổi phiên. Kiểm tra query cache `/auth/me` khi đổi tài khoản, tránh tái dùng dữ liệu của phiên trước. Không set store trong render.
- [ ] Giữ polling phụ thuộc owner; xác nhận login trực tiếp, cookie bootstrap và refresh token đều hoạt động.
- [ ] Chạy lại nhóm auth, dashboard layout, API refresh và jobs polling; review diff trước checkpoint.

**Expected:** Test phiên khôi phục gọi GET trạng thái và nhận COMPLETED; POST tạo dự án có số lần gọi bằng 0 trong kịch bản khôi phục.

## Task 2: Make generation status observable and recoverable

**Files**
- Modify: `frontend/src/features/ai/components/RequirementClarifier.tsx`
- Modify: `frontend/src/features/ai/hooks/useAIGenerator.ts`, `frontend/src/features/jobs/hooks/jobPolling.ts`
- Modify: `frontend/src/features/ai/hooks/useRequirementBrief.ts` nếu cần quản lý khóa khôi phục theo owner
- Extend: `frontend/src/features/ai/components/AIGeneratorModal.test.tsx`, `frontend/src/features/jobs/hooks/useAIJobPolling.test.tsx`
- Modify: cả hai catalog `frontend/messages/en.json`, `frontend/messages/vi.json`.

**Interfaces:** Không đổi payload GET `/ai/jobs/{id}`. Bổ sung metadata UI nếu cần bằng wrapper quanh hook query; giữ nguyên các field data/error/refetch hiện dùng.

- [ ] Test riêng các trạng thái: đang khôi phục phiên, chưa lấy trạng thái lần đầu, PENDING/PROCESSING, offline/tab nền, lỗi GET, FAILED, COMPLETED và COMPLETED thiếu project_id.
- [ ] Chỉ mô tả AI đang xử lý khi đã đọc được PENDING/PROCESSING. Khi chưa có danh tính hoặc polling tạm dừng, hiển thị lý do đúng và hướng phục hồi phiên/kết nối.
- [ ] Sau 120 giây chờ có hiển thị thời gian dài và nút “Kiểm tra trạng thái”; nút chỉ refetch GET. Không tự enqueue, retry POST, đổi trạng thái backend hoặc xóa ID job.
- [ ] Với GET lỗi, hiển thị lỗi và retry. Với COMPLETED thiếu project_id, hiện thông báo thiếu liên kết kết quả cùng nút kiểm tra lại; không quay lại skeleton vô hạn.
- [ ] Chuyển khóa localStorage khôi phục brief/job sang phạm vi owner. Chỉ đọc sau khi xác định owner; khóa legacy không có owner không tự gán cho tài khoản mới. Giữ legacy nguyên để phục hồi có chủ đích, không xóa dữ liệu tùy tiện.
- [ ] Test logout và đăng nhập tài khoản khác không mở job cũ; đóng/mở modal hoặc reload cùng owner không tạo job trùng.
- [ ] Bổ sung copy VI/EN và chạy catalog parity; kiểm tra literal text mới.

**Expected:** Mỗi trạng thái chờ có ý nghĩa đúng. Nút retry chỉ GET. Khi trạng thái thành COMPLETED, hiện kết quả và invalidate danh sách dự án.

## Task 3: Persist explicitly confirmed project methodology

**Files**
- Modify: `frontend/src/features/ai/components/RequirementClarifier.tsx`
- Modify: `frontend/src/features/ai/services/requirementBrief.service.ts`
- Modify: `backend/app/api/v1/endpoints/ai.py`, `backend/app/schemas/ai.py`
- Modify: `backend/app/services/ai_service.py`, `backend/app/services/ai/project_generator.py`, `backend/app/services/ai/durable_jobs.py`, `backend/app/services/ai/persistence.py`
- Inspect: `backend/app/workers/ai_tasks.py` để giữ tương thích helper cũ nếu còn đường gọi.
- Extend: `backend/tests/integration/test_project_from_brief_job.py`, `backend/tests/integration/test_requirement_briefs_api.py`
- Create: `backend/tests/unit/test_ai_project_methodology.py`
- Extend: `frontend/src/features/ai/components/AIGeneratorModal.test.tsx` và cả hai catalog.

**Decision:** Thêm lựa chọn có nhãn rõ Agile/Waterfall/Hybrid ở bước xác nhận trước tạo dự án, mặc định Agile cho tương thích nhưng người dùng thấy và đổi được. Giá trị xác nhận là nguồn sự thật, không để model quyết định thay.

**Interfaces**
```python
# Request tạo từ brief; optional cho client cũ.
methodology: ProjectMethodology | None = None
# Payload AIRequest lưu giá trị chuẩn khi người dùng đã chọn.
input_data_json = {"brief_id": brief_id, "methodology": "waterfall"}
```

- [ ] Test failing: chọn Waterfall -> request payload `waterfall` -> project persisted `waterfall`; tương tự Agile và Hybrid. Giá trị không hợp lệ phải trả 422 trước enqueue.
- [ ] Test idempotency: cùng key nhưng khác methodology phải conflict; key/payload trùng không tạo job mới.
- [ ] Thêm trường request và lưu vào AIRequest input_data_json; methodology không thay đổi bảy trường brief. Xác minh payload legacy và các so sánh idempotency hiện hữu trước đổi.
- [ ] Truyền lựa chọn đã chốt vào prompt; mở rộng JSON plan với `methodology` trong ba giá trị chuẩn. Server áp giá trị người dùng đã chốt sau validation, không cho model ghi đè.
- [ ] Trong persistence, truyền methodology vào ProjectCreate. Plan legacy thiếu trường và không có lựa chọn lưu trong request giữ default Agile; trường được cung cấp nhưng không hợp lệ phải bị từ chối, không âm thầm fallback.
- [ ] Test restart/staged result cũ thiếu trường: dùng lựa chọn đã lưu trong request nếu có, nếu không giữ default legacy; không gọi lại provider.
- [ ] Test nội dung plan Waterfall: không tạo Sprint, có phases/tasks/dependencies đúng cấu trúc. Đánh giá riêng chất lượng lịch/milestone; bản sửa này không hứa thêm milestone persistence khi hợp đồng hiện tại chưa hỗ trợ.
- [ ] Chạy test backend và frontend liên quan; review hợp đồng, tương thích và quyền truy cập.

## Task 4: Integrated validation, review and Graphify

- [ ] Chạy frontend checks từ thư mục `frontend` bằng Node trực tiếp, tránh lỗi shim do đường dẫn có `&`:
```powershell
node node_modules/vitest/vitest.mjs run src/hooks/useAuth.test.tsx src/features/jobs/hooks src/features/ai/components/AIGeneratorModal.test.tsx 'src/app/(dashboard)/layout.test.tsx' src/services/api.test.ts src/i18n/catalog.test.ts
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js src --ext .js,.jsx,.ts,.tsx
node node_modules/next/dist/bin/next build
```
- [ ] Từ `backend`, chạy `.venv/Scripts/python.exe -m pytest tests/unit/test_ai_project_methodology.py tests/integration/test_project_from_brief_job.py tests/integration/test_requirement_briefs_api.py tests/integration/test_durable_ai_execution.py`; dùng DB test cô lập, tuyệt đối không production. Chạy lint và toàn bộ backend suite theo cấu hình repository trước handoff.
- [ ] Browser 390/1440, VI/EN: login, reload bằng cookie, khôi phục job COMPLETED có sẵn, tab nền/quay lại, offline/online, GET 503, logout/chuyển account. Kiểm tra network chỉ GET trong phục hồi; console không có lỗi mới.
- [ ] Browser tạo local Waterfall với provider fixture: assert lựa chọn gửi đi, project badge và DB methodology đều waterfall. Không gọi provider production trong bộ test.
- [ ] Review lỗi gốc và ranh giới tài khoản; đối chiếu từng acceptance criterion. Không hạ điều kiện owner, bỏ test hoặc nới validation để đạt xanh.
- [ ] Chạy `graphify update .` sau thay đổi source. So sánh và tách Graphify churn có sẵn khỏi phần cập nhật do bản sửa.
- [ ] Ghi bằng chứng test, ảnh và danh sách file thay đổi; checkpoint commit chỉ trong phạm vi được phê duyệt khi bắt đầu thực hiện.

## Task 5: Approved deployment and existing project recovery

- [ ] Sau khi người dùng duyệt triển khai, deploy backend tương thích trước, frontend sau; ghi revision và kiểm tra health thực tế.
- [ ] Mở job hoàn tất sẵn bằng phiên trình duyệt thật; xác nhận hiện nút xem dự án và không gọi lại provider.
- [ ] Kiểm tra phương pháp, phases, tasks, dependencies và lịch của dự án đã mang tên Waterfall nhưng lưu Agile. Trình bày thay đổi cụ thể để người dùng duyệt trước khi sửa; không coi đổi badge là hoàn thành toàn bộ mẫu Waterfall.
- [ ] Chỉ sau duyệt mới sửa đúng dự án bằng luồng/API được bảo vệ hiện có; ghi giá trị trước/sau và kiểm tra Gantt/WBS. Không SQL update hàng loạt, không tăng quyền, không tạo dự án trùng.
- [ ] Supabase REST PGRST002 nếu còn xuất hiện thì mở điều tra riêng; không restart database như một bước mặc định của bản sửa này.

## Release gates and rollback

- Gate local: tests, lint, typecheck, build, browser và review đạt; mọi hạn chế được báo rõ.
- Gate production: phê duyệt push/deploy và phục hồi dữ liệu riêng; không suy diễn từ phê duyệt kế hoạch.
- Nếu có regression sau release: rollback ứng dụng về revision đã ghi; dừng tạo job mới trong lúc xác minh. Không rollback dữ liệu đã tạo thành công hoặc gọi lại provider tự động.
- Test hồi quy trọng tâm phải bắt đầu với cookie bootstrap và `store.user=null`; fixture đặt sẵn user không đủ chứng minh lỗi đã hết.
