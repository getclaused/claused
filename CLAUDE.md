# CLAUDE.md — Claused 팀 컨벤션

> Claude Code가 Claused 프로젝트에서 따라야 할 팀 규칙 문서.
> 최초 작성: 2026.05 / 담당: 윤진 (Dev Lead)

---

## 0. 서비스 개요

계약서(PDF/DOCX)를 업로드하면 Claude API가 독소조항을 분석하고 수정안을 제시하는 웹 서비스.
사용자 흐름: 회원가입/로그인 → 계약서 업로드 → AI 분석 → 리포트 확인 → 결제
계약서 원문은 분석 완료 후 24시간 내 자동 삭제. 모든 리포트에 "법률 자문 아님" 문구 필수.

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

- **프레임워크**: Next.js, TypeScript (strict mode)
- **백엔드/DB**: Supabase (Database, Storage, Edge Functions)
- **AI 엔진**: Claude API (claude-sonnet-4-20250514)
- **결제**: 미정 (국내/글로벌 추후 확정)
- **배포**: Vercel / 도메인: claused.kr

---

## 3. 폴더 구조

```
claused/
├── CLAUDE.md           # 팀 규칙 문서. 해당 문서를 기반으로 Claude Code가 코드 구성.
├── app/                # 페이지 및 API Route. 사용자가 브라우저에서 보는 페이지.
├── components/         # 재사용 UI 컴포넌트. 버튼, 카드, 헤더.
├── lib/                # 유틸 함수, API 클라이언트. 계산이나 데이터 처리 같은 기능.(ex. Claude API에 계약서 보내는 함수)
├── supabase/
│   └── functions/      # Edge Functions. 서버에서 실행되는 백그라운드 기능. (ex. 계약서 24시간 후 자동 삭제)
└── public/             # 정적 파일. 로고 이미지, 아이콘 같은 파일.
```

---

## 4. 금지 패턴

- `any` 타입 사용 금지 — TypeScript strict 모드 유지
- `.env` 파일 커밋 금지 — API 키는 절대 코드에 직접 입력하지 말 것 (Claude API 키, Supabase 비밀번호 같은 것들을 모아둔 파일)
- 계약서 원문 DB 평문 저장 금지 — 24시간 내 삭제 정책 준수
- Claude API 응답을 법률 자문으로 표현 금지

---

## 5. 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷 변경
refactor: 리팩토링
chore: 빌드, 패키지 등 기타
```

예시: `feat: 계약서 PDF 업로드 기능 추가`

---

## 6. Edge Function 배포 명령어

```bash
supabase login
supabase functions serve [함수명]   # 로컬 테스트
supabase functions deploy [함수명]  # 프로덕션 배포
```

---

## 7. PR 전 체크리스트

- [ ] `any` 타입 없는지 확인
- [ ] `.env` 파일이 커밋에 포함되지 않았는지 확인
- [ ] 로컬에서 직접 실행해서 확인함
- [ ] PR 제목은 커밋 메시지 규칙과 동일하게 작성

---

>이 문서는 살아있는 문서입니다. 팀 규칙이 바뀌면 바로 업데이트하고 PR로 올려주세요.
