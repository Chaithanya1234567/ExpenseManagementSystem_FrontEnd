export interface Expense {
  expenseId: number;
  employeeId: number;
  employeeName?: string;
  expenseTypeName?: string;
  expensetypeId: number;
  amount: number;
  expenseDate: string;
  description: string;
  receiptUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  createdDate: string;
  approverId?: number;
  paymentStatus?: string;
}
