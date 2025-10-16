import { Component } from '@angular/core';
import { Approval } from './approvals.service'; 
import { ApprovalsService } from './approvals.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approvals',
  imports: [CommonModule],
  templateUrl: './approvals.html',
  styleUrl: './approvals.css'
})
export class Approvals {
 approvals: Approval[] = [];
  loading = false;

  constructor(private approvalService: ApprovalsService) {}

  ngOnInit() {
    this.fetchApprovals();
  }

  fetchApprovals() {
    this.loading = true;
    this.approvalService.getAllApprovals().subscribe({
      next: (res) => {
        this.approvals = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  approve(expenseId: number, approverId: number) {
    this.approvalService.approveExpense({ expenseId, approverId }).subscribe({
      next: () => this.fetchApprovals()
    });
  }

  reject(expenseId: number, approverId: number) {
    this.approvalService.rejectExpense({ expenseId, approverId }).subscribe({
      next: () => this.fetchApprovals()
    });
  }
}
