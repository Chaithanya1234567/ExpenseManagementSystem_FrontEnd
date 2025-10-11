export interface AuditLog {
  auditLogId: number;
  actionById: string;
  action: string;
  expenseId?: number;
  actionDate: string;
  amount?: number;
  status?: string;
}
