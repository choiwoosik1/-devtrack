# 시스템 설계 문서 (System Design)

**프로젝트명:** DevTrack  
**버전:** 1.0  
**작성일:** 2026-05-28  
**작성자:** 최우식  

---

## 1. 아키텍처 개요

DevTrack은 단일 페이지 애플리케이션(SPA)으로 구성된다. 서버 없이 React + localStorage만으로 동작하는 클라이언트 전용 아키텍처를 채택한다.

```
┌─────────────────────────────────────┐
│           Browser (SPA)             │
│                                     │
│  ┌──────────┐    ┌───────────────┐  │
│  │   UI     │◄──►│  State (Hook) │  │
│  │Components│    │  useIssues()  │  │
│  └──────────┘    └──────┬────────┘  │
│                         │           │
│                  ┌──────▼────────┐  │
│                  │  localStorage │  │
│                  └───────────────┘  │
└─────────────────────────────────────┘
```

---

## 2. 데이터 모델

### Issue 객체

```typescript
interface Issue {
  id: string;           // UUID (crypto.randomUUID())
  title: string;        // 이슈 제목 (max 100자)
  description: string;  // 이슈 설명 (max 500자)
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: Array<'bug' | 'feature' | 'improvement' | 'question'>;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

### localStorage 스키마

```
Key: "devtrack_issues"
Value: JSON.stringify(Issue[])
```

---

## 3. 컴포넌트 구조

```
App
├── Header
│     └── (앱 타이틀, 이슈 생성 버튼)
├── FilterBar
│     ├── StatusFilter
│     └── PriorityFilter
├── IssueList
│     └── IssueCard (×N)
│           ├── IssueStatusBadge
│           ├── IssuePriorityBadge
│           └── IssueActions (수정/삭제 버튼)
└── IssueModal (생성/수정 공용)
      ├── TitleInput
      ├── DescriptionTextarea
      ├── PrioritySelect
      └── TagCheckboxGroup
```

---

## 4. 커스텀 훅 설계

### `useIssues()`

이슈 CRUD 및 필터링 로직을 캡슐화하는 핵심 훅.

```javascript
const {
  issues,          // 필터 적용된 이슈 배열
  allIssues,       // 전체 이슈 배열 (통계용)
  filter,          // 현재 필터 상태
  setFilter,       // 필터 변경
  createIssue,     // 이슈 생성
  updateIssue,     // 이슈 수정
  deleteIssue,     // 이슈 삭제
  changeStatus,    // 상태만 빠르게 변경
} = useIssues();
```

---

## 5. 상태 흐름도

```
         생성
[없음] ────────► [Open]
                   │
                   ▼
             [In Progress]
                   │
                   ▼
              [Resolved]
                   │
                   ▼
              [Closed] ◄──── 어느 상태에서든 직접 전환 가능
```

---

## 6. 와이어프레임 (텍스트)

```
┌─────────────────────────────────────────────┐
│  DevTrack 🐛              [+ New Issue]      │
├─────────────────────────────────────────────┤
│  Status: [All▼]   Priority: [All▼]          │
│  3 Open · 1 In Progress · 2 Resolved        │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │
│  │ [CRITICAL] [BUG]                    │    │
│  │ 로그인 시 앱이 크래시됨               │    │
│  │ 2026-05-27          Open [✏️] [🗑️]  │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │ [HIGH] [FEATURE]                    │    │
│  │ 다크 모드 지원 추가                   │    │
│  │ 2026-05-27     In Progress [✏️] [🗑️] │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 7. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2026-05-28 | 최초 작성 |
