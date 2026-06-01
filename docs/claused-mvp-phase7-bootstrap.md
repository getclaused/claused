# Claused MVP — Phase 7 Bootstrap

## 0. 작업 개요

Phase 1~6 완료 후 SMB 타겟 검증을 위한 3개 필수 기능 추가.

본 문서는 Phase 7 단일 작업이라 사용자 승인 대기 없이 한 번에 자율 실행.
Phase 7-1 → 7-2 → 7-3 순차 진행. 각 Phase 사이 사용자 승인 대기 없음.
이슈 발견 시 즉시 보고 + 사용자 확인 후 진행.

---

## 1. 추가할 기능 3개

### Phase 7-1: 분석 이력 페이지 (`/history`)
같은 `session_id` 의 모든 분석 목록을 시간 역순으로 표시.

### Phase 7-2: 비교 분석 (`/compare`)
두 개의 PDF 를 업로드하여 차이점 + 위험 변화 분석.
예: "받은 초안" vs "협상 후 수정본"

### Phase 7-3: 스캔 PDF OCR 지원
텍스트 추출 실패 시 OCR 폴백으로 스캔 PDF 도 분석 가능.

---

## 2. 현재 상태

- Claused MVP 라이브: `claused.kr/analyze`
- 단일 PDF 분석 + 결과 페이지 + Markdown 다운로드 동작
- Supabase Storage: `contracts` 버킷
- Supabase 테이블: `analyses`
- 세션 ID 기반 익명 사용

---

## 3. 명세 우선 원칙

- 본 문서에 명시되지 않은 디렉토리·파일·환경변수 추가 금지
- 새 의존성 추가 시 결과 보고서에 이유 명시 (Phase 7-3 의 OCR 은 예외 — 필수)
- 기존 디자인 시스템 (랜딩/분석 페이지) 그대로 사용
- 기존 `/analyze` 흐름 건드리지 말 것 (별도 라우트로 추가)
- 빌드 통과 실패 시 즉시 중단 + 보고
- MVP 범위 외 추가 금지 (회원가입, 결제, 다국어, 알림 등)

---

## 4. 자율 결정 허용 범위

다음은 자율 결정하되 보고서에 이유 명시:

- 이력 페이지 UI 레이아웃 (리스트 / 카드 / 테이블)
- 비교 분석 UI (좌우 분할 / 상하 / 탭)
- OCR 라이브러리 선택 (`tesseract.js`, Google Vision API, `unpdf` OCR mode 등)
- 페이지네이션 적용 여부 (이력이 많아질 때)
- 비교 결과 JSON 스키마 확장 부분
- 헤더에 `/history` 링크 추가 위치

다음은 자율 결정 금지:

- 기존 `/analyze`, `/analyze/[id]` 페이지 구조 큰 수정
- 기존 `analyses` 테이블 스키마 변경 (컬럼 추가만 허용)
- Claude 모델명 (`claude-sonnet-4-20250514`)
- 회원가입/결제 도입
- MVP 범위 (Section 1)

---

# Phase 7-1: 분석 이력 페이지

## 7-1-1. 라우트 생성

`app/history/page.tsx` — 클라이언트 컴포넌트 또는 서버 컴포넌트 (자율 결정).

UI 요소:
- 페이지 헤더: "내 분석 이력"
- 부제: "이 브라우저에서 분석한 계약서 목록입니다."
- 분석 목록 (시간 역순, `created_at desc`)
- 각 항목 정보:
  - 파일명 (`file_name`)
  - 분석 일시 (KST `YYYY.MM.DD HH:mm`)
  - 리스크 레벨 배지 (high / medium / low 색상)
  - 이슈 개수 (`result.issues.length`)
- 항목 클릭 → `/analyze/[id]` 이동
- 빈 상태: "아직 분석한 계약서가 없습니다." + "계약서 분석하기" 버튼 → `/analyze`

## 7-1-2. 데이터 조회

`session_id` 는 `localStorage` 에서 읽기 (없으면 빈 목록).

Supabase `analyses` 테이블에서:
```sql
select id, file_name, created_at, risk_level, result
from public.analyses
where session_id = ?
order by created_at desc
```

`result` 에서 `issues.length` 만 추출하여 표시 (전체 result 는 클릭 시 결과 페이지에서 보기).

## 7-1-3. 헤더 네비게이션 추가

기존 헤더 메뉴 (데모 / 기능 / 가격 / 약관) 에 "내 분석 이력" 링크 추가.

위치 자율 결정. "데모" 옆 또는 우측 끝 권장.

## 7-1-4. 결과 페이지에서 이력 페이지로 가는 링크

`/analyze/[id]` 페이지의 "새 계약서 분석하기" 버튼 옆에 "내 분석 이력" 보조 버튼 추가.

## 7-1-5. 산출물

- `app/history/page.tsx`
- `components/HistoryList.tsx` (필요 시)
- `components/HistoryItem.tsx` (필요 시)
- 기존 헤더 컴포넌트 수정 (메뉴 추가)
- 기존 `/analyze/[id]` 페이지 수정 (이력 링크 추가)

---

# Phase 7-2: 비교 분석

## 7-2-1. DB 스키마 확장

새 테이블 `comparisons`:

```sql
create table public.comparisons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  file_name_a text not null,
  file_name_b text not null,
  file_path_a text not null,
  file_path_b text not null,
  result jsonb not null,
  status text not null default 'completed' check (status in ('processing', 'completed', 'failed')),
  error_message text
);

create index comparisons_session_id_idx on public.comparisons (session_id, created_at desc);

alter table public.comparisons enable row level security;

create policy "anyone can insert comparison"
  on public.comparisons for insert
  with check (true);

create policy "anyone can read comparison"
  on public.comparisons for select
  using (true);
```

마이그레이션 파일: `supabase/migrations/0003_comparisons.sql`.

적용 안내: 사용자에게 SQL Editor 실행 요청 출력.

## 7-2-2. 업로드 페이지 (`/compare`)

`app/compare/page.tsx` — 클라이언트 컴포넌트.

UI 요소:
- 페이지 헤더: "계약서 비교"
- 부제: "두 개의 계약서를 비교하여 변경점과 위험 변화를 분석합니다."
- 업로드 영역 2개 (좌우 또는 상하):
  - "A. 받은 초안" (라벨, 자율 결정 가능)
  - "B. 협상 후 수정본"
- 각각 PDF 드래그앤드롭, 10MB 제한, application/pdf 만
- 두 파일 모두 업로드되면 "비교 분석 시작" 버튼 활성화
- 분석 중: "AI 가 두 계약서를 비교하고 있습니다... 약 1~2분 소요됩니다."

## 7-2-3. 비교 분석 API

`app/api/compare/route.ts` — Node.js runtime.

요청 body:
```json
{
  "file_path_a": "session_id/uuid-a.pdf",
  "file_path_b": "session_id/uuid-b.pdf",
  "session_id": "...",
  "file_name_a": "초안.pdf",
  "file_name_b": "수정본.pdf"
}
```

처리:
1. Supabase Storage 에서 두 PDF 다운로드
2. 각각 텍스트 추출 (Phase 7-3 OCR 폴백 활용)
3. Claude API 단일 호출로 비교 분석 (두 텍스트 모두 전달)

## 7-2-4. 비교 분석 시스템 프롬프트

다음 그대로 사용:

```
당신은 계약서 비교 검토 전문가입니다. 두 개의 계약서 (A: 받은 초안, B: 협상 후 수정본) 를 비교 분석하세요.

다음 항목을 검토하세요:

1. 주요 변경점: A 에서 B 로 어떤 조항이 바뀌었는지
2. 새로 추가된 조항: B 에만 있는 조항
3. 삭제된 조항: A 에만 있는 조항
4. 위험 변화: 변경으로 인해 위험이 증가 / 감소 / 동일한 부분
5. 협상 성과 평가: B 가 A 대비 사용자 (B 측) 에게 유리해졌는지, 불리해졌는지, 변화 없는지

응답은 반드시 아래 JSON 형식으로만 출력하세요. 마크다운 백틱이나 설명 문장을 포함하지 마세요.

{
  "summary": "비교 요약 2~3 문장",
  "negotiation_outcome": "favorable | neutral | unfavorable",
  "outcome_reason": "왜 그렇게 평가하는지 설명",
  "changes": [
    {
      "category": "조항 카테고리",
      "change_type": "modified | added | removed",
      "risk_change": "increased | decreased | unchanged",
      "before": "A 의 내용 (modified/removed 일 때만, 50자 이내)",
      "after": "B 의 내용 (modified/added 일 때만, 50자 이내)",
      "impact": "이 변경이 사용자에게 미치는 영향",
      "recommendation": "추가 협상이 필요하면 제안, 만족스러우면 그대로 진행 권장"
    }
  ],
  "remaining_concerns": ["B 에도 여전히 남아있는 위험 조항 목록"],
  "successful_negotiations": ["B 에서 성공적으로 개선된 조항 목록"]
}
```

## 7-2-5. 비교 결과 페이지

`app/compare/[id]/page.tsx` — 서버 컴포넌트.

UI 요소:
- 상단: 두 파일명 (A → B) + 분석 일시
- 협상 성과 배지: favorable=초록, neutral=노랑, unfavorable=빨강
- 요약 카드 + 평가 이유
- 변경점 목록:
  - change_type 색상 구분 (modified=파랑, added=초록, removed=회색)
  - risk_change 아이콘 (increased ↑, decreased ↓, unchanged →)
  - before / after 인용 (있는 경우만)
  - impact + recommendation
- 남은 우려 사항 (있을 때만)
- 성공적 협상 사항 (있을 때만)
- 하단: "내 분석 이력" + "새 비교 분석하기" 버튼
- Markdown 다운로드 버튼 (Phase 6 패턴 재활용)

## 7-2-6. 비교 분석 Markdown 다운로드

Phase 6 의 `generateAnalysisMarkdown` 패턴을 비교용으로 확장.

`lib/markdown/generate-comparison-report.ts` 생성:

```markdown
# 계약서 비교 분석 결과

**A (받은 초안):** {file_name_a}
**B (협상 후 수정본):** {file_name_b}
**분석일시:** {YYYY.MM.DD HH:mm}
**협상 성과:** {유리함 | 변화 없음 | 불리함}

---

## 요약

{summary}

**평가 이유:** {outcome_reason}

---

## 변경점 ({changes.length})

### 1. {category} — {change_type 한글} / 위험 {risk_change 한글}

**이전 (A)**
> {before}

**이후 (B)**
> {after}

**영향**
{impact}

**제안**
{recommendation}

...

---

## 남은 우려 사항

- {remaining_concerns[0]}
- ...

---

## 성공적으로 개선된 조항

- {successful_negotiations[0]}
- ...

---

*본 분석은 Claused AI 에 의해 생성되었습니다. 법률 자문이 아닌 참고 자료로 활용하시기 바랍니다.*
*claused.kr*
```

한글 변환:
- `change_type`: modified="변경", added="추가", removed="삭제"
- `risk_change`: increased="증가 ↑", decreased="감소 ↓", unchanged="동일 →"
- `negotiation_outcome`: favorable="유리함", neutral="변화 없음", unfavorable="불리함"

## 7-2-7. 이력 페이지 (Phase 7-1) 에 비교 분석 통합

이력 페이지에서 단일 분석과 비교 분석을 모두 표시:
- 단일 분석: 파일명 1개 + 리스크 배지
- 비교 분석: 파일명 2개 (A → B) + 협상 성과 배지

타입 구분 표시 (예: 아이콘 또는 라벨 "분석" / "비교")

## 7-2-8. 헤더 네비게이션 추가

기존 헤더 메뉴에 "비교" 링크 추가. "데모" 옆 권장.

## 7-2-9. 산출물

- `app/compare/page.tsx`
- `app/compare/[id]/page.tsx`
- `app/api/compare/route.ts`
- `lib/markdown/generate-comparison-report.ts`
- `supabase/migrations/0003_comparisons.sql`
- 기존 헤더 컴포넌트 수정
- 기존 `app/history/page.tsx` 수정 (비교 통합)

---

# Phase 7-3: 스캔 PDF OCR

## 7-3-1. OCR 라이브러리 선택

자율 결정. 권장 옵션:

**A. `tesseract.js`**
- 장점: 무료, 클라이언트 또는 서버 사이드 가능, 추가 인프라 불필요
- 단점: 한국어 정확도 중간, 1MB 이상 PDF 시 처리 시간 길어짐
- 적합도: MVP 단계에 적합

**B. Google Cloud Vision API**
- 장점: 정확도 매우 높음, 한국어 강함
- 단점: 비용 발생, GCP 키 발급 필요
- 적합도: 유료 고객 생긴 후

**C. `pdfjs-dist` + Tesseract.js 조합**
- PDF 페이지를 이미지로 렌더링 → Tesseract.js 로 OCR
- 가장 유연

권장: **A (tesseract.js) 로 시작**. 새 환경변수 불필요.

만약 다른 라이브러리 선택 시 보고서에 이유 명시 + 새 환경변수 필요하면 사용자에게 요청.

## 7-3-2. PDF 텍스트 추출 로직 수정

`lib/pdf/extract.ts` (기존) 수정.

흐름:
1. 기존 `pdf-parse` 또는 사용 중인 라이브러리로 텍스트 추출 시도
2. 추출 텍스트 길이 < 100자 → 스캔 PDF 로 판단
3. OCR 폴백 실행 (tesseract.js 또는 선택한 라이브러리)
4. OCR 결과 < 100자 → "OCR 도 실패. PDF 가 손상되었거나 텍스트가 없습니다." 에러

```typescript
export async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  // 1. 일반 추출 시도
  const directText = await extractDirectly(pdfBuffer);
  
  if (directText.length >= 100) {
    return directText;
  }
  
  // 2. OCR 폴백
  console.log('Direct extraction yielded < 100 chars, falling back to OCR');
  const ocrText = await extractWithOcr(pdfBuffer);
  
  if (ocrText.length < 100) {
    throw new Error('OCR_FAILED');
  }
  
  return ocrText;
}
```

## 7-3-3. OCR 실행 시간 처리

OCR 은 일반 추출보다 훨씬 오래 걸림 (페이지당 5~15초).

Vercel Hobby 의 함수 시간 제한 (10초) 에 걸릴 수 있음.

대응:
- `app/api/analyze/route.ts` 에 `export const maxDuration = 60;` 추가 (Vercel Pro 필요)
- 만약 Hobby 플랜이면 maxDuration = 10 으로 제약. 그 경우 OCR 은 첫 페이지만 처리하고 그래도 100자 미만이면 실패 처리.

자율 결정: 사용자에게 현재 플랜 확인 요청 또는 기본값 60 으로 설정 후 보고.

## 7-3-4. UI 안내

`/analyze` 페이지에 안내 문구 추가:
- 기존: "최대 10MB · PDF 파일만 지원"
- 추가: "스캔된 PDF 도 자동 인식 (다소 시간 소요)"

분석 중 로딩 메시지 업데이트:
- 일반: "AI 가 계약서를 검토하고 있습니다... 약 1분 소요됩니다."
- OCR 폴백 시: "스캔된 PDF 인식 중... 최대 2~3분 소요될 수 있습니다."

상태 구분이 어려우면 통합 메시지로:
- "AI 가 계약서를 분석하고 있습니다... 최대 2~3분 소요될 수 있습니다."

## 7-3-5. 산출물

- `lib/pdf/extract.ts` (수정 — OCR 폴백 추가)
- 새 의존성: `tesseract.js` (또는 선택한 OCR 라이브러리)
- `app/analyze/page.tsx` (UI 안내 수정)
- `app/api/analyze/route.ts` (maxDuration 설정)
- `app/api/compare/route.ts` (maxDuration 설정)

---

## 5. 전체 작업 순서

```
1. Phase 7-1 (이력 페이지) — 약 1~2시간
   1-1. /history 라우트
   1-2. 헤더 메뉴 추가
   1-3. 결과 페이지 이력 링크
   1-4. 빌드 검증

2. Phase 7-2 (비교 분석) — 약 2~4시간
   2-1. DB 마이그레이션 생성
   2-2. 사용자에게 마이그레이션 실행 안내
   2-3. /compare 업로드 페이지
   2-4. /api/compare API
   2-5. /compare/[id] 결과 페이지
   2-6. Markdown 다운로드
   2-7. 이력 페이지 통합
   2-8. 헤더 메뉴 추가
   2-9. 빌드 검증

3. Phase 7-3 (OCR) — 약 1~2시간
   3-1. tesseract.js 설치
   3-2. extract.ts OCR 폴백
   3-3. maxDuration 설정
   3-4. UI 안내
   3-5. 빌드 검증

4. 통합 테스트 + 커밋 + 푸시
   - 로컬 빌드 통과
   - 커밋: feat(mvp): history + comparison + ocr
   - git push origin main
```

---

## 6. 보고 형식

각 Phase 완료 후 다음 출력:

```
Phase 7-N — [제목]
✅ 완료: 산출물 N개
- 파일 경로 1
- 파일 경로 2
- ...

자율 결정:
- [결정 1]: [이유]
- [결정 2]: [이유]

추가 의존성:
- [패키지명@버전]: [이유]

이슈/특이사항:
- [있으면 기술, 없으면 "없음"]

다음: Phase 7-(N+1) 진입
```

모든 Phase 완료 후:

```
✅ Phase 7 완성

총 소요 시간: [분]
빌드: ✅ 통과
커밋: [hash]

사용자 수동 작업 필요:
1. supabase/migrations/0003_comparisons.sql 실행 (Phase 7-2)
2. Vercel 플랜 확인 (Phase 7-3 OCR 처리 시간 관련)
3. git push origin main

추가된 페이지:
- /history (분석 이력)
- /compare (비교 업로드)
- /compare/[id] (비교 결과)

향상된 기능:
- 스캔 PDF OCR 자동 폴백 (/analyze, /compare 모두)
```

---

## 7. 중단 조건

다음 상황에서 작업 중단 + 사용자 확인 대기:

1. 빌드 실패 (TypeScript 에러, 빌드 도구 오류)
2. 명세에 없는 디렉토리·파일 추가 필요성 발견
3. MVP 범위 외 기능 요청 발견 (회원가입 / 결제 등)
4. 기존 `/analyze` 흐름 큰 수정 필요성 발견
5. OCR 라이브러리 설치 실패 (네이티브 의존성 문제 등)
6. Vercel maxDuration 제약으로 OCR 동작 불가 판단 시
7. Claude API 응답 형식이 예상과 크게 다를 때

중단 시 다음 정보 보고:
- 어느 Phase / Step 인지
- 무슨 오류인지 (원문)
- 어떤 선택지가 있는지
- 추천하는 선택지 + 이유
