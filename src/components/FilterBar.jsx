import styles from './FilterBar.module.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'ALL' },
  { value: 'open', label: 'OPEN' },
  { value: 'in-progress', label: 'IN_PROGRESS' },
  { value: 'resolved', label: 'RESOLVED' },
  { value: 'closed', label: 'CLOSED' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'ALL' },
  { value: 'critical', label: 'CRITICAL' },
  { value: 'high', label: 'HIGH' },
  { value: 'medium', label: 'MEDIUM' },
  { value: 'low', label: 'LOW' },
];

export default function FilterBar({ filter, setFilter, stats }) {
  return (
    <div className={styles.bar}>
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>STATUS:</span>
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`${styles.filterBtn} ${filter.status === opt.value ? styles.active : ''}`}
            onClick={() => setFilter(f => ({ ...f, status: opt.value }))}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>PRIORITY:</span>
        {PRIORITY_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`${styles.filterBtn} ${filter.priority === opt.value ? styles.active : ''}`}
            onClick={() => setFilter(f => ({ ...f, priority: opt.value }))}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={styles.stats}>
        <span className={styles.statItem} style={{ color: 'var(--status-open)' }}>{stats.open} OPEN</span>
        <span className={styles.sep}>·</span>
        <span className={styles.statItem} style={{ color: 'var(--status-progress)' }}>{stats.inProgress} IN_PROGRESS</span>
        <span className={styles.sep}>·</span>
        <span className={styles.statItem} style={{ color: 'var(--status-resolved)' }}>{stats.resolved} RESOLVED</span>
        <span className={styles.sep}>·</span>
        <span className={styles.statItem} style={{ color: 'var(--status-closed)' }}>{stats.closed} CLOSED</span>
      </div>
    </div>
  );
}
