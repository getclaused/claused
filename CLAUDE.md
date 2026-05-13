# CLAUDE.md — Claused 팀 컨벤션

> 이 파일은 Claude Code가 Claused 프로젝트에서 따라야 할 팀 규칙 문서입니다.
> 위치: `.claude/CLAUDE.md`
> 최초 작성: 2026.05 / 담당: 윤진 (Dev Lead)

---

## 0. 서비스 개요

**Claused** — AI 계약서 검토 서비스. 계약서(PDF/DOCX)를 업로드하면 Claude API가 독소조항을 분석하고 수정안을 제시한다.

### 사용자 흐름

```
회원가입/로그인 → 계약서 업로드 → AI 분석 → 리포트 확인 → 결제
```

### MVP 기능 목록 (개발 순서)

| 순서 | 기능 | 설명 |
|------|------|------|
| 1 | 회원가입 / 로그인 | 이메일 기반 인증. Supabase Auth 사용 |
| 2 | 계약서 업로드 | PDF, DOCX 파일 업로드. Supabase Storage에 저장 |
| 3 | AI 분석 | 업로드된 파일을 Claude API로 전송. 독소조항 탐지 + 위험도 분류 |
| 4 | 리포트 화면 | 분석 결과를 조항별로 표시. Critical / High / Medium / Low |
| 5 | 결제 | 결제 방식 확정 후 마지막에 붙임 (현재 미정) |

### 핵심 규칙

- 계약서 원문은 분석 완료 후 **24시간 내 자동 삭제**
- 모든 리포트 하단에 **"법률 자문 아님"** 문구 필수
- Claude API 응답을 그대로 노출하지 말 것 — 항상 UI로 가공해서 보여줄 것

---

## 1. 팀 구성

| 이름 | 역할 | 주요 책임 |
|------|------|-----------|
| 이동현 | CPO/CTO | 제품 방향, 아키텍처 설계, 최종 리뷰 |
| 김윤진 | Dev Lead | 프론트엔드 개발, 배포, 코드 리뷰 |
| 김선아 | Growth/GTM | 마케팅, 고객 인터뷰, 파트너십 |
| 이유정 | Ops/Trust | 고객 지원, 컴플라이언스, 재무 |

---

## 2. 기술 스택

- **프레임워크**: Next.js (App Router), TypeScript (strict mode)
- **백엔드/DB**: Supabase (Database, Storage, Edge Functions)
- **AI 엔진**: Claude API (claude-sonnet-4-20250514)
- **결제**: 미정 (국내/글로벌 결제 추후 확정)
- **배포**: Vercel
- **도메인**: claused.kr

---

## 3. 폴더 구조

```
claused/
├── .claude/
│   └── CLAUDE.md          # 이 파일
├── app/                   # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (dashboard)/       # 로그인 후 서비스 페이지
│   └── api/               # API Route Handlers
├── components/            # 재사용 UI 컴포넌트
├── lib/                   # 유틸 함수, API 클라이언트
├── supabase/
│   └── functions/         # Edge Functions
└── public/                # 정적 파일
```

---

## 4. 금지 패턴

- `any` 타입 사용 금지 — TypeScript strict 모드 유지
- `.env` 파일 커밋 금지 — API 키, Secret Key는 절대 코드에 직접 입력하지 말 것
- 계약서 원문을 DB에 평문 저장 금지 — 분석 완료 후 24시간 내 삭제 정책 준수
- Claude API 응답을 법률 자문으로 표현하는 문구 금지 — 모든 리포트에 "법률 자문 아님" 명시

---

## 5. 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정 (CLAUDE.md 포함)
style: 코드 포맷 변경 (기능 변경 없음)
refactor: 코드 리팩토링
chore: 빌드, 패키지 등 기타 작업
```

예시: `feat: 계약서 PDF 업로드 기능 추가`

---

## 6. Supabase Edge Function 배포 명령어

```bash
# 로그인
supabase login

# 로컬에서 함수 실행 (테스트)
supabase functions serve [함수명]

# 프로덕션 배포
supabase functions deploy [함수명]
```

---

## 7. PR 전 체크리스트

- [ ] `any` 타입 없는지 확인
- [ ] `.env` 파일이 커밋에 포함되지 않았는지 확인
- [ ] 새로운 기능에 간단한 주석 추가
- [ ] 로컬에서 실행해서 직접 확인함
- [ ] PR 제목은 커밋 메시지 규칙과 동일하게 작성

---

> **이 문서는 살아있는 문서입니다.**
> 팀 규칙이 바뀌면 바로 업데이트하고, PR로 올려주세요.
