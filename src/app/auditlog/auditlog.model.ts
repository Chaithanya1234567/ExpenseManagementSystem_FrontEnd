export interface AuditLog {
  auditLogId: number;
  actionById: string;
  action: string;
  expenseId?: number;
  actionDate: Date;
  amount?: number;
  status?: 'approved' | 'rejected' | 'submitted' | 'updated';
}
