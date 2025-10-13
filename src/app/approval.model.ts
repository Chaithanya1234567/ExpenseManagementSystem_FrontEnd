export interface Approval {
  expenseId: number;
  approverId: number;
  approvalStatus?: 'approved' | 'rejected';
  actionDate?: string; // or Date
}
