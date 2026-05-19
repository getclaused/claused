# Claused MVP Bootstrap

## 0. 작업 개요

이 문서는 Claused MVP (계약서 업로드 → Claude API 분석 → 결과 표시) 를 한 번에 완성하기 위한 부트스트랩 명세이다.

Claude Code 는 본 문서를 처음부터 끝까지 읽고, Phase 1 부터 Phase 5 까지 **순차 자율 실행**한다. 각 Phase 사이에 사용자 승인 대기 없음. 단 이슈 발견 시 즉시 보고 + 사용자 확인 후 진행.

작업 후 보고는 본 문서 마지막의 "보고 형식" 그대로.

---

## 1. 현재 상태

- 디렉토리: `~/Projects/claused`
- 스택: Next.js 16.2.4 + Tailwind + Supabase + Vercel
- 랜딩 페이지: 완성됨 (`claused.kr`)
- 환경변수 4개 등록됨: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`
- 디자인 시스템: 기존 랜딩 페이지 코드 참조
- 인증/업로드/분석/결제: 미구현

---

## 2. MVP 범위 (엄격)

**포함:**
- PDF 계약서 업로드
- Claude API 분석 (claude-sonnet-4-20250514)
- 결과 화면 표시
- 분석 이력 저장 (Supabase DB)
- 세션 ID 기반 익명 사용

**제외 (명세 외 추가 금지):**
- 로그인/회원가입 (Phase 2 작업)
- 결제 (PortOne, TossPayments, Polar.sh — 모두 Phase 3 작업)
- 다국어 (영문은 Phase 2)
- 이메일 알림
- PDF 외 파일 포맷 (docx, hwp 등)
- 본문 하이라이트 / 인라인 코멘트 UI
- 사용자 대시보드

---

## 3. 명세 우선 원칙

- 본 문서에 명시되지 않은 디렉토리·파일·의존성·환경변수 **추가 금지**
- "편의를 위해" 추가하는 헬퍼·유틸 **금지**
- 기존 랜딩 페이지 디자인 시스템 (색상·폰트·간격) 그대로 사용
- 새 의존성 추가 시 결과 보고서에 이유 명시
- 빌드 통과 실패 시 즉시 중단 + 보고

---

## 4. 자율 결정 허용 범위

다음은 Claude Code 가 자율 결정하되 보고서에 이유 명시:

- PDF 텍스트 추출 라이브러리 선택 (`pdf-parse`, `pdfjs-dist`, `unpdf` 중)
- 결과 화면 컴포넌트 분리 단위
- 에러 처리 패턴 (try/catch 위치)
- 로딩 UI 스타일
- Supabase Storage 버킷 이름 (단 명세에 명시된 것은 그대로 사용)

다음은 자율 결정 **금지** (수정 시 즉시 보고 + 확인):

- 시스템 프롬프트 (Phase 2 정의 그대로)
- DB 스키마 (Phase 4 정의 그대로)
- Claude 모델명 (`claude-sonnet-4-20250514`)
- MVP 범위 (Section 2)

---

## Phase 1 — PDF 업로드

### 목표
사용자가 `/analyze` 페이지에서 PDF 를 드래그앤드롭하면 Supabase Storage 에 저장된다.

### 단계

**1-1. Supabase Storage 버킷 생성**

Supabase 콘솔에서 수동 생성 안내 출력. 자동 생성 시도 금지 (RLS 설정 충돌 위험).

출력:
```
[수동 작업 필요]
Supabase Dashboard → Storage → New bucket
- Name: contracts
- Public: false
- File size limit: 10 MB
- Allowed MIME types: application/pdf
완료 후 Enter 키로 진행
```

**1-2. `/analyze` 페이지 라우트 생성**

`app/analyze/page.tsx` — 클라이언트 컴포넌트.

UI 요소:
- 페이지 헤더: "계약서 검토" (h1, 기존 랜딩 폰트 사용)
- 부제: "PDF 파일을 업로드하면 AI 가 위험 조항을 분석합니다"
- 드래그앤드롭 영역 (점선 테두리, 클릭 시 파일 선택 다이얼로그)
- 파일 크기 제한: 10MB
- 허용 형식: `application/pdf` 만
- 업로드 진행 상태 표시 (idle / uploading / analyzing / done / error)

**1-3. 업로드 핸들러**

클라이언트에서 직접 Supabase Storage 업로드. 파일명: `${session_id}/${uuid}.pdf`.

`session_id` 는 `localStorage` 에서 읽거나 없으면 새로 생성 (`crypto.randomUUID()`).

업로드 성공 시 다음 Phase 2 API 호출.

**1-4. 검증**

- 10MB 초과 파일 업로드 시 클라이언트에서 차단
- PDF 가 아닌 파일 거부
- 빈 파일 거부

### 산출물
- `app/analyze/page.tsx`
- `lib/supabase/client.ts` (이미 있으면 재사용)
- Supabase Storage 버킷 `contracts`

---

## Phase 2 — Claude API 분석

### 목표
`/api/analyze` Route Handler 가 업로드된 PDF 를 받아 Claude API 로 분석한다.

### 단계

**2-1. Route Handler 생성**

`app/api/analyze/route.ts` — Node.js runtime (Edge 아님, `pdf-parse` 호환).

요청 body:
```json
{
  "file_path": "session_id/uuid.pdf",
  "session_id": "...",
  "file_name": "원본 파일명.pdf"
}
```

**2-2. PDF 텍스트 추출**

Supabase Storage `service_role` 키로 다운로드 → 텍스트 추출.

라이브러리 자율 선택. 단 빌드 통과 + Node 22 호환 확인.

추출 텍스트가 100자 미만이면 "스캔된 PDF (OCR 필요)" 에러 반환.

**2-3. Claude API 호출**

`@anthropic-ai/sdk` 사용. 모델: `claude-sonnet-4-20250514`. max_tokens: 4096.

**시스템 프롬프트 (이대로 사용, 수정 금지):**

```
당신은 계약서 검토 전문가입니다. 업로드된 계약서를 분석하여 다음 항목을 검토하세요:

1. 불리한 면책 조항: 일방에게만 유리한 면책 조항
2. 손해배상 범위: 과도하거나 불명확한 손해배상 조항
3. 자동갱신 조항: 불리한 조건의 자동갱신
4. 계약 해지 조건: 해지가 어렵거나 불리한 조건
5. 지식재산권: 불명확하거나 불리한 IP 귀속 조항
6. 준거법/관할: 불리한 분쟁 해결 조항
7. 비밀유지 의무: 과도하거나 일방적인 NDA 조항
8. 누락 조항: 반드시 있어야 할 조항의 부재

응답은 반드시 아래 JSON 형식으로만 출력하세요. 마크다운 백틱이나 설명 문장을 포함하지 마세요.

{
  "summary": "전체 요약 2~3 문장",
  "risk_level": "high | medium | low",
  "issues": [
    {
      "category": "카테고리명",
      "severity": "high | medium | low",
      "clause_excerpt": "문제 조항 원문 발췌 (50자 이내)",
      "description": "왜 문제인지 설명",
      "suggestion": "어떻게 수정하면 좋은지 제안"
    }
  ],
  "missing_clauses": ["누락된 조항 목록"],
  "positive_points": ["잘 작성된 조항 목록"]
}
```

**2-4. JSON 파싱**

응답 텍스트에서 마크다운 백틱 (``` 또는 ```json) 제거 후 `JSON.parse`. 실패 시 에러 로깅 + 500 반환.

**2-5. DB 저장**

Phase 4 의 `analyses` 테이블에 저장. (Phase 4 마이그레이션 후 가능)

순서: Phase 4 마이그레이션 먼저 → Phase 2 API 완성.

### 산출물
- `app/api/analyze/route.ts`
- `lib/anthropic/client.ts`
- `lib/pdf/extract.ts`

---

## Phase 3 — 결과 화면

### 목표
분석 완료 후 결과를 사용자에게 보여준다.

### 단계

**3-1. 결과 페이지 라우트**

`app/analyze/[id]/page.tsx` — 서버 컴포넌트. `id` 는 `analyses.id`.

Supabase 에서 `analyses` row 조회. 없으면 404.

**3-2. UI 구성**

- 상단: 파일명 + 분석 일시
- 리스크 레벨 배지 (high=빨강 #DC2626, medium=노랑 #F59E0B, low=초록 #10B981)
- 요약 카드 (`summary`)
- 이슈 목록: severity 별 색상 구분, `category` / `clause_excerpt` / `description` / `suggestion` 표시
- 누락 조항 섹션 (있을 때만)
- 긍정 조항 섹션 (있을 때만)
- 하단: "새 계약서 분석하기" 버튼 → `/analyze` 로 이동

**3-3. 로딩 / 폴링**

`/analyze` 페이지에서 업로드 + API 호출 완료 후 `/analyze/[id]` 로 라우팅.

API 가 동기 응답이므로 폴링 불필요. 분석 시간 30~60초 예상 → 로딩 화면에 진행 메시지 표시 ("AI 가 계약서를 검토하고 있습니다... 약 1분 소요됩니다").

### 산출물
- `app/analyze/[id]/page.tsx`
- `components/RiskBadge.tsx`
- `components/IssueCard.tsx`

---

## Phase 4 — 분석 이력 DB

### 목표
모든 분석 결과를 Supabase 에 저장한다.

### 단계

**4-1. 마이그레이션 작성**

`supabase/migrations/001_analyses.sql`:

```sql
create extension if not exists "pgcrypto";

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  file_name text not null,
  file_path text not null,
  risk_level text check (risk_level in ('high', 'medium', 'low')),
  result jsonb not null,
  status text not null default 'completed' check (status in ('processing', 'completed', 'failed')),
  error_message text
);

create index analyses_session_id_idx on public.analyses (session_id, created_at desc);

alter table public.analyses enable row level security;

create policy "anyone can insert"
  on public.analyses for insert
  with check (true);

create policy "anyone can read own session"
  on public.analyses for select
  using (true);
```

**4-2. 마이그레이션 적용**

`supabase db push` 또는 콘솔에서 SQL 실행 안내.

**4-3. TypeScript 타입 생성**

`supabase gen types typescript --project-id <project_id> > lib/supabase/database.types.ts`

Supabase project_id 는 사용자에게 확인 요청.

### 산출물
- `supabase/migrations/001_analyses.sql`
- `lib/supabase/database.types.ts`

---

## Phase 5 — 통합 테스트 + 배포

### 목표
End-to-end 흐름이 동작하는지 확인하고 Vercel 에 배포한다.

### 단계

**5-1. 로컬 빌드 검증**

```bash
pnpm install
pnpm build
```

빌드 실패 시 즉시 중단 + 보고.

**5-2. 로컬 통합 테스트**

`pnpm dev` 후 다음 시나리오 수동 검증:

- `/analyze` 접근 → 페이지 정상 표시
- 10MB 초과 PDF 거부 확인
- 정상 PDF (테스트용 NDA 샘플) 업로드 → 분석 → 결과 페이지
- 결과 페이지 새로고침 시 데이터 유지
- "새 계약서 분석하기" 버튼 동작

테스트 PDF 가 없으면 사용자에게 요청 (`테스트용 계약서 PDF 1개를 ~/Projects/claused/test-fixtures/ 에 넣어주세요`).

**5-3. 커밋 + 배포**

커밋 메시지:
```
feat(mvp): pdf upload + claude analysis + result view

- /analyze: PDF 드래그앤드롭 업로드 (10MB 한도)
- /api/analyze: Supabase Storage → Claude API → 결과 저장
- /analyze/[id]: 분석 결과 표시 (리스크 배지 + 이슈 카드)
- analyses 테이블 + RLS 정책
```

`git push origin main` → Vercel 자동 배포.

**5-4. Production 검증**

`https://claused.kr/analyze` 접근 → 동일 시나리오 검증.

Vercel 환경변수 확인:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`

누락된 게 있으면 보고.

---

## 보고 형식

각 Phase 완료 후 다음 표 출력:

```
Phase N — [제목]
✅ 완료: 산출물 N개
- app/.../file.tsx
- lib/.../file.ts
- ...

자율 결정:
- [결정 1]: [이유]
- [결정 2]: [이유]

추가 의존성:
- [패키지명@버전]: [이유]

이슈/특이사항:
- [있으면 기술, 없으면 "없음"]

다음: Phase N+1 진입
```

모든 Phase 완료 후 최종 보고:

```
✅ Claused MVP 완성

총 소요 시간: [분]
빌드: ✅ 통과
로컬 테스트: ✅ 통과
Production 배포: ✅ [URL]

다음 작업 (Phase 2 - MVP 이후):
- 회원가입/로그인
- 결제 연동
- 다국어 (영문)
```

---

## 중단 조건

다음 상황에서 작업 중단 + 사용자 확인 대기:

1. 빌드 실패 (TypeScript 에러, 빌드 도구 오류)
2. Supabase Storage 버킷 생성 미완료
3. 환경변수 누락
4. Claude API 401/403 응답
5. 명세에 없는 디렉토리·파일 추가 필요성 발견
6. MVP 범위 외 기능 요청 발견

중단 시 다음 정보 보고:
- 어느 Phase / Step 인지
- 무슨 오류인지 (원문)
- 어떤 선택지가 있는지
- 추천하는 선택지 + 이유
