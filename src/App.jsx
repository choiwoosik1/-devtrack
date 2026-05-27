import { useState } from 'react';
import { useIssues } from './hooks/useIssues';
import IssueCard from './components/IssueCard';
import IssueModal from './components/IssueModal';
import FilterBar from './components/FilterBar';
import styles from './App.module.css';

export default function App() {
  const { issues, allIssues, filter, setFilter, createIssue, updateIssue, deleteIssue, changeStatus } = useIssues();
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', issue }

  const stats = {
    open: allIssues.filter(i => i.status === 'open').length,
    inProgress: allIssues.filter(i => i.status === 'in-progress').length,
    resolved: allIssues.filter(i => i.status === 'resolved').length,
    closed: allIssues.filter(i => i.status === 'closed').length,
  };

  function handleSave({ title, description, priority, tags }) {
    if (modal?.mode === 'edit') {
      updateIssue(modal.issue.id, { title, description, priority, tags });
    } else {
      createIssue({ title, description, priority, tags });
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>DevTrack</span>
          <span className={styles.logoSub}>// issue_tracker v1.0</span>
        </div>
        <button className={styles.newBtn} onClick={() => setModal({ mode: 'create' })}>
          + NEW_ISSUE
        </button>
      </header>

      <main className={styles.main}>
        <FilterBar filter={filter} setFilter={setFilter} stats={stats} />

        <div className={styles.listHeader}>
          <span className={styles.listCount}>
            {issues.length === allIssues.length
              ? `${allIssues.length} issues`
              : `${issues.length} / ${allIssues.length} issues`}
          </span>
        </div>

        {issues.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◎</div>
            <div className={styles.emptyText}>
              {allIssues.length === 0
                ? '이슈가 없습니다. + NEW_ISSUE 버튼으로 첫 이슈를 추가하세요.'
                : '필터 조건에 맞는 이슈가 없습니다.'}
            </div>
          </div>
        ) : (
          <div className={styles.list}>
            {issues.map(issue => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onEdit={(issue) => setModal({ mode: 'edit', issue })}
                onDelete={deleteIssue}
                onStatusChange={changeStatus}
              />
            ))}
          </div>
        )}
      </main>

      {modal && (
        <IssueModal
          issue={modal.mode === 'edit' ? modal.issue : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
