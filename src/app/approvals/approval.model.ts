export interface Approval {
  approvalId?: number;
  expenseId: number;
  approverId: number;
  approverName: string;
  approvalStatus: 'Approved' | 'Rejected' | string;
  comments?: string | null;
  actionDate: string; 
  employeeId: number;
}
