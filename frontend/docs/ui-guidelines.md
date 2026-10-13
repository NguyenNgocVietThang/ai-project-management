# UI Guidelines (design system noi bo)

Tai lieu ngan cho moi nguoi/agent khi lam giao dien. Nguon su that: `tailwind.config.ts`, `src/app/globals.css`, `src/components/ui/*`, `src/components/common/*`.

## Token

- Mau dung token ngu nghia, khong hard-code bang mau Tailwind (`emerald-*`, `slate-*`, `#22c55e`...):
  `background, foreground, card, popover, muted(-foreground), accent(-foreground), primary(-foreground), secondary, destructive, success, warning, info` (+ `-soft` cho nen nhat cua success/warning/info), `border`, `input`, `ring`.
- Teal (`primary`) la mau nhan duy nhat. Moi vung man hinh chi mot nut nen primary (CTA chinh).
- Chu: `text-display | text-h1 | text-h2 | text-h3 | text-h4 | text-lead | text-body | text-body-sm | text-caption | text-overline`. Khong dung `text-[Npx]`, han che `text-xs/sm/lg` khi them moi.
- Doan van dai: `max-w-prose-ui` (68ch).
- Spacing luoi 4px: stack trong component 8/12/16 (`gap-2/3/4`), giua card 16/24 (`gap-4/6`), giua section 32/40 (`space-y-8/10`). Khong dung gia tri `.5` (2px, 6px, 10px) tru `gap-1.5` icon-chu va `px-2.5` trong badge.
- Bo goc: input/button `rounded-lg`, card `rounded-xl`, modal/panel lon `rounded-2xl`, pill `rounded-full`.
- Bong: `shadow-xs` (input, nut), `shadow-soft` (card), `shadow-soft-md` (hover, tooltip), `shadow-soft-lg` (modal).
- Chuyen dong: 150-300ms, `ease-out-soft`; animation `animate-fade-up | fade-in | scale-in | word-rise | shimmer`. Reduced-motion da duoc xu ly toan cuc.

## Primitive

| Muc dich | Import |
| --- | --- |
| Nut / nut-lien-ket | `Button`, `ButtonLink`, `buttonClasses` tu `@/components/common/Button` (variant `default, secondary, outline, ghost, destructive, link`; size `sm, md, lg, icon`; `fullWidth` mac dinh true - truyen `fullWidth={false}` cho nut trong toolbar/header) |
| Khoi noi dung | `Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter` tu `@/components/ui/Card` (`interactive` cho card bam duoc, `flush` cho bang) |
| Nhan trang thai | `Badge` tu `@/components/ui/Badge` (tone `neutral, primary, success, warning, danger, info`, `dot`) |
| Dau trang | `PageHeader`, `SectionHeader` tu `@/components/ui/PageHeader` (H1 tu dong co hieu ung chu) |
| Select | `Select` tu `@/components/ui/Select` (native, cung kieu Input) |
| Chon che do | `SegmentedControl` tu `@/components/ui/SegmentedControl` |
| Tab dieu huong | `TabNav` tu `@/components/ui/TabNav` |
| Dang tai | `LoadingState` (variant `inline, cards, table, page`) tu `@/components/common/PageState`; khoi rieng: `Skeleton, SkeletonCard, SkeletonTable, SkeletonText, SkeletonStatGrid, SkeletonRegion` tu `@/components/ui/Skeleton` |
| Rong / loi | `EmptyState` (icon, action, secondaryAction), `ErrorState` (onRetry, retryLabel) tu `@/components/common/PageState` |
| Hieu ung | `RevealText`, `Reveal` (stagger) tu `@/components/motion/RevealText`; `CountUp` tu `@/components/motion/CountUp` |
| Breadcrumb dong | `useBreadcrumbLabel(href, label)` tu `@/components/layout/Breadcrumbs` |
| Input/Label/Modal/Alert | `@/components/common/*` (da cap nhat style) |

## Mau trang chuan

```tsx
<div className="space-y-8">
  <PageHeader eyebrow="..." title="..." description="..." actions={<>
    <Button variant="outline" fullWidth={false}>Phu</Button>
    <Button fullWidth={false}>CTA chinh</Button>
  </>} />
  <Card className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{/* toolbar bo loc */}</Card>
  {isLoading && <LoadingState variant="cards" label={...} />}
  {isError && <ErrorState message={...} onRetry={() => void refetch()} />}
  {empty && <EmptyState title="..." description="..." action={<Button fullWidth={false}>...</Button>} />}
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{/* Card interactive */}</div>
</div>
```

- Bang: boc trong `Card flush className="overflow-hidden"`, wrapper `overflow-x-auto`, `thead` `bg-muted/50 text-caption uppercase text-muted-foreground`, hang `border-t transition-colors hover:bg-muted/40`, o `px-4 py-3`.
- Bo cuc 2 cot: `grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]` (noi dung chinh trai, panel phu phai, xep doc tren mobile).
- Responsive: mobile < 640 (1 cot, nut full width), tablet 768-1024 (2 cot), desktop > 1024. Khong cuon ngang trang (bang tu cuon trong wrapper).
- A11y: icon trang tri `aria-hidden="true"`, nut chi co icon phai co `aria-label`, giu `role`/`aria-*` san co, vung cham >= 44px.
- Comment code viet tieng Viet.
