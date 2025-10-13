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

  loading = true;

  constructor(private homeService: HomeService ,
    private auditLogService: AuditLogService,
    private approvalService: ApprovalService 
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadAuditLogs();
  }

  loadDashboardData(): void {
    this.homeService.getThisMonthExpenses().subscribe({
      next: (data) => this.thisMonthExpenses = data,
      error: (err) => console.error('Error fetching monthly expenses', err)
    });

    this.homeService.getPendingRequests().subscribe({
  next: (data) => {
    if (Array.isArray(data)) {
      this.pendingRequests = data.length;  // count
      this.pendingRequestsList = data.map(item => ({
        expenseId: item.expenseId,
        approverId: item.approverId,
        employeeName: item.employeeName,
        expenseType: item.expenseType, 
        date: item.date, 
        amount: item.amount
      }));
    } else {
     
      this.pendingRequests = 0;
      this.pendingRequestsList = [];
    }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching pending requests', err);
        this.loading = false;
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
    this.approvalService.approve(request.expenseId, request.approverId).subscribe({
      next: () => this.refreshDashboard(),
      error: (err) => console.error('Error approving expense', err)
    });
  }

  rejectRequest(request: PendingRequest) {
    this.approvalService.reject(request.expenseId, request.approverId).subscribe({
      next: () => this.refreshDashboard(),
      error: (err) => console.error('Error rejecting expense', err)
    });
  }

  refreshDashboard() {
    this.loadDashboardData();
    this.loadAuditLogs();
  }
  }
