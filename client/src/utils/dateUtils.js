/**
 * Determines the due status of a task based on its due date.
 * @param {string | Date} dueDateStr - The due date of the task.
 * @returns {'overdue' | 'due-soon' | null} - The status of the due date.
 */
export const getTaskDueStatus = (dueDateStr, status) => {
  if (['Submitted', 'Approved', 'Rejected'].includes(status)) return null;
  if (!dueDateStr) return null;

  const dueDate = new Date(dueDateStr);
  if (isNaN(dueDate.getTime())) return null;

  const now = new Date();
  
  const timeDiff = dueDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  if (hoursDiff < 0) {
    return 'overdue';
  } else if (hoursDiff <= 24) {
    return 'due-soon';
  }

  return null;
};
