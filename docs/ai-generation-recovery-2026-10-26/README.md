# AI generation recovery — báo cáo triển khai cục bộ

Phạm vi: Tasks1–4 của kế hoạch 2026-10-26, repository C:/BA/AI Project Planning & Portfolio Management system, main local. Người dùng đã bổ sung quyền commit và push sau kiểm chứng; đã hủy yêu cầu tắt máy. Không sửa dữ liệu production.

Trạng thái hiện tại: phần chức năng và methodology đã qua review từng task, browser Waterfall đạt4/4. Review tổng thể phát hiện thêm P2 concurrent cookie bootstrap; đang sửa và phải qua re-review, kiểm tra frontend/build cuối và warm-console recheck trước công bố hoàn tất/push.

## Nguyên nhân và thay đổi

1. useAuth hiển thị meQuery.data nhưng authStore.user còn null; owner-aware polling không chạy. Đồng bộ danh tính ngoài render, cache theo session, giữ hồ sơ mới hơn và chặn phản hồi cũ sau logout/đổi tài khoản. Giữ bearer thu hồi logout và chống refresh/retry vượt ranh giới phiên. Review cuối yêu cầu coalesce bootstrap đồng thời.
2. Mọi trạng thái chưa có dữ liệu từng dùng skeleton đang tạo kế hoạch. UI nay phân biệt khôi phục/phiên không khả dụng, GET đầu tiên, PENDING/PROCESSING, offline/tabẩn, lỗi GET, FAILED, COMPLETED và thiếu liên kết. Sau120giây có kiểm tra GET; không tự tạo job, gọi provider hoặc đánh FAILED. Brief/job/cache theo owner/session, khóa legacy giữ nguyên và không tự nhận sang tài khoản khác. CopyVI/EN và keyboard.
3. Methodology chưa qua request/prompt/persistence. Selector xác nhận Agile/Waterfall/Hybrid mặc địnhAgile gửi trường riêng ngoài7mụcbrief. Backend xác thực, lưu lựa chọn, so payload idempotency, đưa vào prompt và ProjectCreate; AI hợp lệ không ghi đè lựa chọn. Staged result cũ dùng lựa chọn đã lưu, nếu thiếu cả hai giữ Agile; giá trị cung cấp không hợp lệ bị từ chối. Không gọi provider khi phục hồi staged result. OpenAPI được sinh bằng dependency đúng requirements.

## Bằng chứng đã có

- Backend đúng dependency pins:813passed,28conditionalPostgreSQLskips,9deprecationwarnings; Ruff app/tests và generatedOpenAPIcheck đạt. Xem task-3-backend-pinned-full.txt và task-3-backend-pinned-contracts.txt.
- Auth Task1:67/67; Task2:49/49; Task3frontend:56/56 và lint/typecheck đạt. Root combined pre-final-fix:92/92 trong10files; lượt đầu có worker-start timeout được lưu riêng, lượt sau đạt trước khi bổ sung finalP2fix. Đây chưa thay cho final gate sau fix.
- Browser thật VI/EN ×390/1440: cookie bootstrap bắt đầu bộ nhớ danh tính rỗng; khôi phục COMPLETED, reload/reopen, offline/online, tabẩn thật/quaylại, GET503/retryGET, FAILED, thiếuproject_id và keyboard đạt. Chờ thực120giây được kiểm tra. Phản hồi A đến sau loginB vẫn giữ B trước reload.
- Trước tạo Waterfall, DB/provider vẫn1Job/1AIRequest/1Project/1dispatchseed; phục hồi không thêm gì. Waterfall4/4: lựa chọnUI -> POSTwaterfall -> AIRequest/Project DBwaterfall -> badge, mỗi lần đúng1job/dispatch,3phases/3tasks/2dependencies/0Sprint.
- Ảnh mobileVIcompleted/offline, desktopENlongwait, mobileVIselector và desktopENsavedbadge đã được controller xem, fit/readability đạt.
- Browser có favicon404 sẵn có và hai ws-ticket503 lúc khởi động synthetic backend; không có pageerror. Security source không đổi, nguyên nhân503 chưa được chứng minh; warm recheck còn bắt buộc. Không tuyên bố console sạch.

Chi tiết và ảnh: [QA report](qa-integrated-browser.md), [sanitized evidence](qa/README.md), [Waterfall DB proof](qa/waterfall-db-proof.json). Runtime DB/cookie/token/password không được đưa vào Git.

## Giới hạn

SQLite cô lập không chứng minh locking/concurrency PostgreSQL;28test conditional có lý do skip trong log. Provider deterministic chỉ kiểm tra luồng và persistence, không bảo đảm chất lượng kế hoạch thực tế. Không thêm milestone persistence hoặc tự sửa dự án cũ mang tênWaterfall nhưng lưuAgile. Các warning/dependency audit ngoài phạm vi không bị giấu hoặc nới rule.

## Triển khai, phục hồi và rollback

Sau final gates, push main bình thường theo quyền mới, kiểm tra SHA remote và workflow. Hai checkpoint backend5e6bc1d và frontend846a30e tách riêng để hỗ trợ backend tương thích trước frontend. Render health công khai đã trả database/redisok; production tắt OpenAPI và không công khai revision, nên health riêng lẻ không chứng minh đúng SHA triển khai. Cần báo đúng giới hạn xác minh release.

Phục hồi dữ liệu dự án production vẫn cần duyệt riêng: xác định đúng owner/job/project và giá trị trước/sau; xem methodology, phases/tasks/dependencies/lịch/Gantt/WBS; sửa đúng dự án qua luồng bảo vệ, không SQL hàng loạt, tăng quyền hoặc tạo project/providercall trùng. SupabasePGRST002 nếu còn là điều tra hạ tầng riêng. Khi regression, rollback ứng dụng về revision trước deploy đã ghi; giữ dữ liệu đã tạo thành công và không tự gọi lại provider.

## Các quyết định đã áp dụng

- Yêu cầu thực thi mới thay note plan-only cũ; checkpoint cục bộ có thể đảo ngược nếu hiểu sai.
- Làm trên main gốc theo chỉ dẫn người dùng, giữ TaskViews và plan; rủi ro nếu hiểu sai là phải chuyển các commit cục bộ.
- Dùng implementer/reviewer riêng theo yêu cầu, chi phí là thêm vòng review.
- Mở rộng hẹp auth.service để giữ bearer thu hồi logout khi clear ngay; rủi ro regression logout được test đỏ/xanh.
- Khi người dùng cho phép song song, chỉ QA và backend độc lập chạy đồng thời; frontend dùng tuần tự trước review, một worker commit mỗi lúc; rủi ro là tích hợp lại nếu phân ranh sai.

## File source thay đổi (trước final fix)
- backend/app/api/v1/endpoints/ai.py
- backend/app/schemas/ai.py
- backend/app/services/ai/durable_jobs.py
- backend/app/services/ai/persistence.py
- backend/app/services/ai/project_generator.py
- backend/app/services/ai_service.py
- backend/app/workers/ai_tasks.py
- backend/tests/integration/test_project_from_brief_job.py
- backend/tests/integration/test_requirement_briefs_api.py
- backend/tests/unit/test_ai_project_methodology.py
- frontend/messages/en.json
- frontend/messages/vi.json
- frontend/src/app/(dashboard)/layout.test.tsx
- frontend/src/features/ai/components/AIGeneratorModal.test.tsx
- frontend/src/features/ai/components/AIGeneratorRecovery.test.tsx
- frontend/src/features/ai/components/RequirementClarifier.tsx
- frontend/src/features/ai/hooks/useAIGenerator.ts
- frontend/src/features/ai/hooks/useRequirementBrief.ts
- frontend/src/features/ai/services/requirementBrief.service.ts
- frontend/src/features/jobs/hooks/jobPolling.ts
- frontend/src/features/jobs/hooks/useAIJobPolling.test.tsx
- frontend/src/hooks/useAuth.test.tsx
- frontend/src/hooks/useAuth.ts
- frontend/src/services/api.test.ts
- frontend/src/services/api.ts
- frontend/src/services/auth.service.test.ts
- frontend/src/services/auth.service.ts
- frontend/src/store/authStore.ts
- mobile/openapi/openapi.json
