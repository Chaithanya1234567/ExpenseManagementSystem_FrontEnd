export interface Employee {
  employeeId?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  dob: Date;
  doj: Date;
  salary: number;
  address: string;
  gender: string; // 'Male' | 'Female' | 'Other'
  employeeType: string; // 'FullTime' | 'PartTime' | 'Contract'
  status?: string;
  departmentId: number;
  roleId: number;
  roleName?: string;
  departmentName?: string;
}
