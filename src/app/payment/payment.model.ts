export interface Payment {
  paymentId?: number;
  expenseId: number;
  amount: number;
  paymentDate?: Date;
  status: string;
}

export interface ApprovedExpense {
  expenseId: number;
  employeeName: string;
  expenseTypeName: string;
  amount: number;
  status: string;
  paymentStatus: string;
}
