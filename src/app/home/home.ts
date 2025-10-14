import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpenseService } from '../expense/expense.service';
import { Expense } from '../expense/expense.model';
import { HomeService } from './home.service';
import { OnInit } from '@angular/core';
import { AuditLogService } from '../auditlog.service';
import { AuditLog } from '../auditlog.model';
import { ApprovalService } from '../approval.service';
import { signal } from '@angular/core';
import { DashboardStats } from './dashboard.service';
import { DashboardService } from './dashboard.service';

interface PendingRequest {
  employeeName: string;
  expenseType: string;
  date: string;
  amount: number;
  expenseId: number;
  approverId: number;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'] 
})
export class Home implements OnInit {
  thisMonthExpenses: number = 0;
  pendingRequests: number = 0;
  pendingRequestsList: PendingRequest[] = [];
  auditLogs: AuditLog[] = [];
  // loading = true;
  stats = signal<DashboardStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private homeService: HomeService ,
    private auditLogService: AuditLogService,
    private approvalService: ApprovalService,
    private dashboardSvc: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadAuditLogs();
    this.fetchDashboardStats();
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
    const approverName = 'Manager';
    this.approvalService.approve(request.expenseId, request.approverId).subscribe({
      next: () => this.refreshDashboard(),
      
      error: (err) => console.error('Error approving expense', err)
    });
  }

  rejectRequest(request: PendingRequest) {
    const approverName = 'Manager';
    this.approvalService.reject(request.expenseId, request.approverId).subscribe({
      next: () => this.refreshDashboard(),
      error: (err) => console.error('Error rejecting expense', err)
    });
  }

  refreshDashboard() {
    this.loadDashboardData();
    this.loadAuditLogs();
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

}
