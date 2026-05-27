import styles from './IssueCard.module.css';

const STATUS_LABELS = {
  'open': 'OPEN',
  'in-progress': 'IN_PROGRESS',
  'resolved': 'RESOLVED',
  'closed': 'CLOSED',
};

const STATUS_ORDER = ['open', 'in-progress', 'resolved', 'closed'];

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function IssueCard({ issue, onEdit, onDelete, onStatusChange }) {
  const currentIdx = STATUS_ORDER.indexOf(issue.status);
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;

  function handleDelete() {
    if (window.confirm(`"${issue.title}" 이슈를 삭제할까요?`)) {
      onDelete(issue.id);
    }
  }

  return (
    <div className={`${styles.card} ${styles[`status_${issue.status.replace('-','_')}`]}`}>
      <div className={styles.topRow}>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[`prio_${issue.priority}`]}`}>
            {issue.priority.toUpperCase()}
          </span>
          <span className={`${styles.badge} ${styles[`stat_${issue.status.replace('-','_')}`]}`}>
            {STATUS_LABELS[issue.status]}
          </span>
          {issue.tags.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
        <div className={styles.actions}>
          {nextStatus && (
            <button
              className={styles.nextBtn}
              onClick={() => onStatusChange(issue.id, nextStatus)}
              title={`→ ${STATUS_LABELS[nextStatus]}`}
            >
              → {STATUS_LABELS[nextStatus]}
            </button>
          )}
          {issue.status !== 'closed' && (
            <button
              className={styles.closeBtn2}
              onClick={() => onStatusChange(issue.id, 'closed')}
              title="CLOSE"
            >
              ✕ CLOSE
            </button>
          )}
          <button className={styles.editBtn} onClick={() => onEdit(issue)} title="수정">✎</button>
          <button className={styles.deleteBtn} onClick={handleDelete} title="삭제">🗑</button>
        </div>
      </div>

      <div className={styles.title}>{issue.title}</div>

      {issue.description && (
        <div className={styles.description}>{issue.description}</div>
      )}

      <div className={styles.meta}>
        <span className={styles.id}>#{issue.id.slice(0, 8)}</span>
        <span className={styles.date}>created {formatDate(issue.createdAt)}</span>
        {issue.updatedAt !== issue.createdAt && (
          <span className={styles.date}>· updated {formatDate(issue.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}
