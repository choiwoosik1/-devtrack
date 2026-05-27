import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'devtrack_issues';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(issues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  } catch {
    alert('저장 실패: localStorage에 접근할 수 없습니다.');
  }
}

export function useIssues() {
  const [allIssues, setAllIssues] = useState(loadFromStorage);
  const [filter, setFilter] = useState({ status: 'all', priority: 'all' });

  useEffect(() => {
    saveToStorage(allIssues);
  }, [allIssues]);

  const issues = allIssues.filter(issue => {
    const statusOk = filter.status === 'all' || issue.status === filter.status;
    const priorityOk = filter.priority === 'all' || issue.priority === filter.priority;
    return statusOk && priorityOk;
  });

  const createIssue = useCallback(({ title, description, priority, tags }) => {
    const newIssue = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() || '',
      status: 'open',
      priority: priority || 'medium',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAllIssues(prev => [newIssue, ...prev]);
  }, []);

  const updateIssue = useCallback((id, updates) => {
    setAllIssues(prev =>
      prev.map(issue =>
        issue.id === id
          ? { ...issue, ...updates, updatedAt: new Date().toISOString() }
          : issue
      )
    );
  }, []);

  const deleteIssue = useCallback((id) => {
    setAllIssues(prev => prev.filter(issue => issue.id !== id));
  }, []);

  const changeStatus = useCallback((id, status) => {
    updateIssue(id, { status });
  }, [updateIssue]);

  return { issues, allIssues, filter, setFilter, createIssue, updateIssue, deleteIssue, changeStatus };
}
