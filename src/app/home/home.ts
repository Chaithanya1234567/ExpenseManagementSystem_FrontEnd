import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../expense/expense.service';
import { Expense } from '../expense/expense.model';
import { HomeService } from './home.service';
import { AuditLogService } from '../auditlog/auditlog.service';
import { AuditLog } from '../auditlog/auditlog.model';
import { ApprovalService } from '../approvals/approvals.service';
import { signal } from '@angular/core';
import { DashboardStats } from './dashboard.service';
import { DashboardService } from './dashboard.service';
import { Component,OnInit,Signal } from '@angular/core';  
import { finalize } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';



interface PendingRequest {
  employeeName: string;
  expenseType: string;
  date: string;
  amount: number;
  expenseId: number;
  approverId: number;
}

interface RecentRequest {
  employeeName: string;
  expenseTypeName: string;
  date: string;
  amount: number;
  status: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'] ,
  standalone: true
})
export class Home implements OnInit {
  thisMonthExpenses: number = 0;
  pendingRequests: number = 0;
  pendingRequestsList: PendingRequest[] = [];
  auditLogs: AuditLog[] = [];
   recentRequests: RecentRequest[] = [];
  // loading = true;
  stats = signal<DashboardStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private homeService: HomeService ,
    private auditLogService: AuditLogService,
    private approvalService: ApprovalService,
    private dashboardSvc: DashboardService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadAuditLogs();
    this.fetchDashboardStats();
     this.loadRecentRequests(); 
  }

  loadDashboardData(): void {
    this.homeService.getThisMonthExpenses().subscribe({
      next: (data) => this.thisMonthExpenses = data,
      error: (err) => console.error('Error fetching monthly expenses', err)
    });

    this.homeService.getPendingRequests().subscribe({
  next: (data) => {
    if (Array.isArray(data)) {
      this.pendingRequests = data.length;  
      this.pendingRequestsList = data;
    } else {
     
      this.pendingRequests = 0;
      this.pendingRequestsList = [];
    }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching pending requests', err);
        this.loading.set(false);
      }
    });
  }
    loadAuditLogs(): void {
    this.auditLogService.getAllLogs().subscribe({ 
      next: (logs) => this.auditLogs = logs,
      error: (err) => console.error('Error loading audit logs', err)
    });
  }
  approveRequest(request: PendingRequest) {
  const approverId = 22; 
  this.loading.set(true);

  this.approvalService.getEmployeeNameById(approverId).pipe(
    switchMap((employee: any) => {
      const approverName = `${employee.firstName} ${employee.lastName}`;
      const payload = {
        expenseId: request.expenseId,
        approverId,
        approverName,
        approvalStatus: 'Approved',
        actionDate: new Date().toISOString(),
        employeeId: (request as any).employeeId || null, 
      };

      // Optimistic UI update
      const prevList = [...this.pendingRequestsList];
      this.pendingRequestsList = this.pendingRequestsList.filter(r => r.expenseId !== request.expenseId);

      return this.approvalService.approve(payload).pipe(
        catchError(err => {
          console.error('Approve failed:', err);
          alert('Failed to approve expense. Try again.');
          // revert on failure
          this.pendingRequestsList = prevList;
          return of(null);
        })
      );
    }),
    finalize(() => this.loading.set(false))
  ).subscribe({
    next: (res) => {
      if (res) {
        this.refreshDashboard();
      }
    }
  });
}


rejectRequest(request: PendingRequest) {
  const approverId = 22;
  const reason = prompt(`Reject expense #${request.expenseId}. Optional comment:`, '');
  const confirmed = confirm(`Are you sure you want to reject expense #${request.expenseId}?`);
  if (!confirmed) return;

  this.loading.set(true);

  this.approvalService.getEmployeeNameById(approverId).pipe(
    switchMap((employee: any) => {
      const approverName = `${employee.firstName} ${employee.lastName}`;
      const payload = {
        expenseId: request.expenseId,
        approverId,
        approverName,
        approvalStatus: 'Rejected',
        comments: reason || null,
        actionDate: new Date().toISOString(),
        employeeId: (request as any).employeeId || null
      };

      // Optimistic UI update
      const prevList = [...this.pendingRequestsList];
      this.pendingRequestsList = this.pendingRequestsList.filter(r => r.expenseId !== request.expenseId);

      return this.approvalService.reject(payload).pipe(
        catchError(err => {
          console.error('Reject failed:', err);
          alert('Failed to reject expense. Try again.');
          // revert on failure
          this.pendingRequestsList = prevList;
          return of(null);
        })
      );
    }),
    finalize(() => this.loading.set(false))
  ).subscribe({
    next: (res) => {
      if (res) {
        this.refreshDashboard();
      }
    }
  });
}


  refreshDashboard() {
    this.loadDashboardData();
    this.loadAuditLogs();
    this.loadRecentRequests();
  }
  
  fetchDashboardStats() {
    this.loading.set(true);
    this.dashboardSvc.getStats().subscribe({
      next: (res) => {
        this.stats.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard data');
        this.loading.set(false);
      }
    });
    
  }
 loadRecentRequests(): void {
  this.expenseService.getRecentExpenses(5).subscribe({
    next: (data: any[]) => {
      this.recentRequests = data.map(exp => ({
        employeeName: exp.employeeName,
        expenseTypeName: exp.expenseTypeName,
        date: exp.expenseDate,   
        amount: exp.amount,
        status: exp.status
      }));
    },
    error: (err: any) => console.error('Error loading recent requests:', err)
  });
}
}
