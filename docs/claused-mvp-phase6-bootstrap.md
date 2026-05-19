# Claused MVP — Phase 6 Bootstrap

## 0. 작업 개요

Phase 1~5 (MVP) 완료 후 추가 기능. 분석 결과를 Markdown 파일로 다운로드.

본 문서는 Phase 6 단일 작업이라 사용자 승인 대기 없이 한 번에 자율 실행.

---

## 1. 현재 상태

- Claused MVP 라이브: `claused.kr/analyze`
- `/analyze/[id]` 결과 페이지 동작 중
- `analyses` 테이블에 분석 이력 저장 중
- 분석 결과 데이터 구조 (jsonb `result`):
  ```json
  {
    "summary": "...",
    "risk_level": "high | medium | low",
    "issues": [
      {
        "category": "...",
        "severity": "high | medium | low",
        "clause_excerpt": "...",
        "description": "...",
        "suggestion": "..."
      }
    ],
    "missing_clauses": ["..."],
    "positive_points": ["..."]
  }
  ```

---

## 2. 작업 범위

**포함:**
- 결과 페이지 (`/analyze/[id]`) 에 "다운로드" 버튼 추가
- 클릭 시 클라이언트 사이드에서 Markdown 파일 생성 + 다운로드
- 파일명: `{원본파일명}_분석결과.md`

**제외 (Phase 7+ 작업):**
- PDF 다운로드
- 이메일 전송
- 공유 링크 (이미 URL 자체가 공유 가능)
- 다운로드 이력 기록

---

## 3. 명세 우선 원칙

- 본 문서에 명시되지 않은 디렉토리·파일·의존성·환경변수 추가 금지
- 서버 라우트 추가 금지 (클라이언트 사이드 처리)
- 새 의존성 추가 금지 (Markdown 생성은 순수 JS 로 가능)
- 기존 디자인 시스템 (랜딩/분석 페이지) 그대로 사용
- 빌드 통과 실패 시 즉시 중단 + 보고

---

## 4. 자율 결정 허용 범위

다음은 자율 결정하되 보고서에 이유 명시:

- "다운로드" 버튼 위치 (헤더 우측 / 요약 카드 아래 / 푸터 등)
- 버튼 스타일 (primary / secondary / outline)
- Markdown 템플릿 세부 마크업 (헤더 레벨, 구분선 위치 등)

다음은 자율 결정 금지:

- Markdown 출력 구조 (Section 5 정의 그대로)
- 파일명 규칙 (Section 6 정의 그대로)
- 새 의존성 추가
- 서버 라우트 추가

---

## 5. Markdown 출력 구조 (필수)

다음 구조 그대로 출력:

```markdown
# 계약서 분석 결과

**파일명:** {file_name}
**분석일시:** {YYYY.MM.DD HH:mm}
**리스크 레벨:** {주의 필요 | 양호 | 위험}

---

## 요약

{summary}

---

## 발견된 이슈 ({issues.length})

### 1. {category} — {severity 한글}

> {clause_excerpt}

**문제점**
{description}

**제안**
{suggestion}

### 2. ...

(이슈 개수만큼 반복)

---

## 누락된 조항

- {missing_clauses[0]}
- {missing_clauses[1]}
- ...

(missing_clauses 가 빈 배열이면 이 섹션 생략)

---

## 잘 작성된 조항

- {positive_points[0]}
- {positive_points[1]}
- ...

(positive_points 가 빈 배열이면 이 섹션 생략)

---

*본 분석은 Claused AI 에 의해 생성되었습니다. 법률 자문이 아닌 참고 자료로 활용하시기 바랍니다.*
*claused.kr*
```

### severity 한글 변환
- `high` → "위험"
- `medium` → "주의 필요"
- `low` → "양호"

### risk_level 한글 변환
- `high` → "위험"
- `medium` → "주의 필요"
- `low` → "양호"

### 날짜 포맷
- `created_at` (timestamptz) 를 KST 기준 `YYYY.MM.DD HH:mm` 으로 변환
- 결과 페이지에 표시되는 형식과 동일

---

## 6. 파일명 규칙

```
{원본파일명 from analyses.file_name, 확장자 제거}_분석결과.md
```

예시:
- 원본: `231226_공통_표준계약서_최종.pdf`
- 다운로드: `231226_공통_표준계약서_최종_분석결과.md`

특수문자 처리:
- 파일명에 사용 불가능한 문자 (`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`) 는 `_` 로 치환
- 공백은 유지

---

## 7. 구현 단계

### 7-1. Markdown 생성 함수

`lib/markdown/generate-report.ts` 생성.

```typescript
export function generateAnalysisMarkdown(
  fileName: string,
  createdAt: string,
  result: {
    summary: string;
    risk_level: 'high' | 'medium' | 'low';
    issues: Array<{
      category: string;
      severity: 'high' | 'medium' | 'low';
      clause_excerpt: string;
      description: string;
      suggestion: string;
    }>;
    missing_clauses: string[];
    positive_points: string[];
  }
): string {
  // Section 5 의 구조 그대로 생성
}
```

순수 함수. 외부 의존성 없음.

### 7-2. 파일명 생성 함수

`lib/markdown/generate-report.ts` 에 함께.

```typescript
export function generateMarkdownFileName(originalFileName: string): string {
  const nameWithoutExt = originalFileName.replace(/\.pdf$/i, '');
  const sanitized = nameWithoutExt.replace(/[\/\\:*?"<>|]/g, '_');
  return `${sanitized}_분석결과.md`;
}
```

### 7-3. 다운로드 버튼 컴포넌트

`components/DownloadButton.tsx` (클라이언트 컴포넌트).

```typescript
'use client';

interface DownloadButtonProps {
  fileName: string;
  createdAt: string;
  result: AnalysisResult;
}

export function DownloadButton({ fileName, createdAt, result }: DownloadButtonProps) {
  const handleDownload = () => {
    const markdown = generateAnalysisMarkdown(fileName, createdAt, result);
    const downloadFileName = generateMarkdownFileName(fileName);
    
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <button onClick={handleDownload} className="...">
      <DownloadIcon /> 분석 결과 다운로드
    </button>
  );
}
```

### 7-4. 결과 페이지 통합

`app/analyze/[id]/page.tsx` 에 `DownloadButton` 컴포넌트 배치.

배치 위치 (자율 결정 허용):
- 권장 A: 페이지 상단 (리스크 배지 + 파일명 영역 우측)
- 권장 B: "새 계약서 분석하기" 버튼 옆 (페이지 하단)

서버 컴포넌트에서 클라이언트 컴포넌트로 props 전달.

### 7-5. 빌드 검증

```bash
pnpm build
```

통과 확인.

### 7-6. 로컬 테스트

```bash
pnpm dev
```

`http://localhost:3000/analyze/[기존 분석 id]` 접근:
- 다운로드 버튼 표시 확인
- 클릭 시 `.md` 파일 다운로드 확인
- 다운로드된 파일 열어서 Section 5 구조 일치 확인
- 파일명이 Section 6 규칙 일치 확인

### 7-7. 커밋 + 푸시

커밋 메시지:
```
feat(analyze): markdown download for analysis result

- 결과 페이지에 "분석 결과 다운로드" 버튼 추가
- 클라이언트 사이드 Markdown 생성 (외부 의존성 없음)
- 파일명: {원본파일명}_분석결과.md
```

`git push origin main` → Vercel 자동 배포.

### 7-8. Production 검증

`https://claused.kr/analyze/[기존 id]` 접근 → 다운로드 동작 확인.

---

## 8. 보고 형식

```
Phase 6 — Markdown 다운로드
✅ 완료: 산출물 N개
- lib/markdown/generate-report.ts
- components/DownloadButton.tsx
- app/analyze/[id]/page.tsx (수정)
- ...

자율 결정:
- 버튼 위치: [위치]: [이유]
- 버튼 스타일: [스타일]: [이유]

추가 의존성: 없음

이슈/특이사항:
- [있으면 기술, 없으면 "없음"]

빌드: ✅ 통과
로컬 테스트: ✅ 통과 (다운로드 동작 + 파일 내용 검증)
커밋: [hash]
Production: ✅ [URL]
```

---

## 9. 중단 조건

다음 상황에서 작업 중단 + 사용자 확인 대기:

1. 빌드 실패
2. 명세에 없는 디렉토리·파일 추가 필요성 발견
3. 새 의존성 추가 필요성 발견
4. 기존 결과 페이지 구조 큰 수정 필요성 발견

중단 시 다음 정보 보고:
- 어느 Step 인지
- 무슨 문제인지
- 어떤 선택지가 있는지
- 추천하는 선택지 + 이유
