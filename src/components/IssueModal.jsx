import { useState, useEffect } from 'react';
import styles from './IssueModal.module.css';

const TAGS = ['bug', 'feature', 'improvement', 'question'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export default function IssueModal({ issue, onSave, onClose }) {
  const isEdit = !!issue;
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [priority, setPriority] = useState(issue?.priority || 'medium');
  const [tags, setTags] = useState(issue?.tags || []);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function toggleTag(tag) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  function handleSubmit() {
    if (!title.trim()) { setError('제목을 입력하세요.'); return; }
    if (title.trim().length > 100) { setError('제목은 100자 이하여야 합니다.'); return; }
    onSave({ title, description, priority, tags });
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.headerLabel}>{isEdit ? '// EDIT_ISSUE' : '// NEW_ISSUE'}</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>TITLE <span className={styles.required}>*</span></label>
            <input
              className={styles.input}
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="이슈 제목을 입력하세요..."
              maxLength={100}
              autoFocus
            />
            <span className={styles.charCount}>{title.length}/100</span>
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>DESCRIPTION</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="자세한 설명 (선택사항)..."
              maxLength={500}
              rows={4}
            />
            <span className={styles.charCount}>{description.length}/500</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>PRIORITY</label>
            <div className={styles.priorityGroup}>
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  className={`${styles.priorityBtn} ${styles[`prio_${p}`]} ${priority === p ? styles.active : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>TAGS</label>
            <div className={styles.tagGroup}>
              {TAGS.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagBtn} ${tags.includes(tag) ? styles.tagActive : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>CANCEL</button>
          <button className={styles.saveBtn} onClick={handleSubmit}>
            {isEdit ? 'SAVE_CHANGES' : 'CREATE_ISSUE'}
          </button>
        </div>
      </div>
    </div>
  );
}
