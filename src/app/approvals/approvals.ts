import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ApprovalService,Employee } from './approvals.service';
import { PendingRequest } from '../pendingrequest.model';
import { Approval } from './approval.model';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 import { switchMap,  catchError, of } from 'rxjs';




@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './approvals.html',
  styleUrls: ['./approvals.css']
})
export class ApprovalsComponent implements OnInit {
  pendingRequests: PendingRequest[] = [];
  approvedRequests: PendingRequest[] = [];

  loading = false;
  processingMap = new Map<number, boolean>();

  constructor(private approvalService: ApprovalService) {}

  private getApproverId(): number {
    // Hardcoded manager ID (you can adjust this to get dynamically, if needed)
    return 22;
  }

  ngOnInit(): void {
    this.loadPendingRequests();
    this.loadApprovedRequests();
  }

  loadPendingRequests(): void {
    this.loading = true;
    this.approvalService.getPendingRequests()
      .pipe(finalize(() => (this.loading = false))) 
      .subscribe({
        next: (list) => this.pendingRequests = list || [],
        error: (err) => {
          console.error('Failed to load pending requests:', err);
          alert('Unable to load pending requests. Try again later.');
        }
      });
  }

  loadApprovedRequests(): void {
    this.approvalService.getApprovedRequests()
      .subscribe({
        next: (list) => this.approvedRequests = list || [],
        error: (err) => console.error('Failed to load approved requests:', err)
      });
  }

  canApprove(req: PendingRequest): boolean {
    return req.status === 'Pending' && !this.processingMap.get(req.expenseId);
  }

  canReject(req: PendingRequest): boolean {
    return req.status === 'Pending' && !this.processingMap.get(req.expenseId);
  }

  // Method to fetch approver's full name based on ID
  private getApproverName(approverId: number): Observable<string> {
  return this.approvalService.getEmployeeNameById(approverId).pipe(
    map((employee: Employee) => `${employee.firstName} ${employee.lastName}`)  // Now mapping Employee to string
  );
}



onApprove(req: PendingRequest): void {
  if (!this.canApprove(req)) return;

  const approverId = this.getApproverId();

  // Start processing
  this.processingMap.set(req.expenseId, true);

  this.getApproverName(approverId).pipe(
    switchMap(approverName => {
      const payload: Approval = {
        expenseId: req.expenseId,
        approverId,
        approverName,
        approvalStatus: 'Approved',
        actionDate: new Date().toISOString(),
        employeeId: req.employeeId
      };

      // Optimistically update UI
      const previousStatus = req.status;
      req.status = 'Approved';

      return this.approvalService.approve(payload).pipe(
        catchError(err => {
          // Revert UI on error
          req.status = previousStatus;
          console.error('Approve error:', err);
          alert('Failed to approve expense. Try again.');
          return of(null); // Continue the stream
        })
      );
    }),
    finalize(() => this.processingMap.delete(req.expenseId))
  ).subscribe(res => {
    if (res) {
      // Move approved request to approvedRequests array
      this.approvedRequests.unshift({ ...req });
      this.pendingRequests = this.pendingRequests.filter(r => r.expenseId !== req.expenseId);
    }
  });
}

  onReject(req: PendingRequest): void {
    if (!this.canReject(req)) return;

    const reason = prompt(`Reject expense #${req.expenseId}. Optional comment:`, '');
    const confirmed = confirm(`Are you sure you want to reject expense #${req.expenseId}?`);
    if (!confirmed) return;

    const approverId = this.getApproverId();
    
    // Fetch approver's name before submitting the rejection
    this.getApproverName(approverId).subscribe({
      next: (approverName) => {
        this.processingMap.set(req.expenseId, true);
        const prevStatus = req.status;
        req.status = 'Rejected';

        const payload: Approval = {
          expenseId: req.expenseId,
          approverId,
          approverName,  
          approvalStatus: 'Rejected',
          comments: reason || null,
          actionDate: new Date().toISOString(),
          employeeId: req.employeeId
        };

        this.approvalService.reject(payload)
          .pipe(finalize(() => this.processingMap.delete(req.expenseId)))
          .subscribe({
            next: () => {
            },
            error: (err) => {
              console.error('Rejection failed:', err);
              req.status = prevStatus;
              alert('Failed to reject. Please try again.');
            }
          });
      },
      error: (err) => {
        console.error('Failed to fetch approver name:', err);
        alert('Unable to fetch approver name. Please try again.');
      }
    });
  }

  viewReceipt(url?: string | null): void {
    if (!url) {
      alert('No receipt available.');
      return;
    }
    window.open(url, '_blank');
  }
}
