/**
 * Determines the due status of a task based on its due date.
 * @param {string | Date} dueDateStr - The due date of the task.
 * @returns {'overdue' | 'due-soon' | null} - The status of the due date.
 */
export const getTaskDueStatus = (dueDateStr, status) => {
  if (['Submitted', 'Approved', 'Rejected'].includes(status)) return null;
  if (!dueDateStr) return null;

  let targetDate;
  if (typeof dueDateStr === 'string' && !dueDateStr.includes('T')) {
    // Treat date-only strings (YYYY-MM-DD) as local end of day
    const parts = dueDateStr.split('-');
    if (parts.length === 3) {
      targetDate = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
    }
  }

  if (!targetDate) {
    targetDate = new Date(dueDateStr);
  }

  if (isNaN(targetDate.getTime())) return null;

  const now = new Date();
  
  const timeDiff = targetDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff < 0) {
    return 'overdue';
  } else if (hoursDiff <= 24) {
    return 'due-soon';
  }

  return null;
};
