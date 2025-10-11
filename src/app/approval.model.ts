export interface Approval {
  approvalId?: number;
  expenseId: number;
  approverId: number;
  approvalStatus?: string;
  actionDate?: string;
}
