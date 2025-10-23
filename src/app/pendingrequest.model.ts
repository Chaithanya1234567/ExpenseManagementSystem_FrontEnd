export interface PendingRequest {
  expenseId: number;
  employeeId: number;
  employeeName: string;
  expenseTypeName?: string;
  amount: number;
  expenseDate: string; // ISO string
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  receiptUrl?: string | null;
  expensetypename?: string;
  
}
