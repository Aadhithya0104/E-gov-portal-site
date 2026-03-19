import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IssueService } from '../../../core/services/issue.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Issue, IssueStatus } from '../../../shared/models/index';

@Component({
  selector: 'app-admin-issues',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="p-8">
      <nav class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <a routerLink="../overview" class="hover:text-navy">Admin Dashboard</a>
        <span>›</span><span class="text-navy font-semibold">All Issues</span>
      </nav>

      <!-- Filter bar -->
      <div class="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <input type="text" [(ngModel)]="searchTerm" placeholder="🔍 Search by name, App ID, service..."
               class="form-input max-w-xs">
        <select [(ngModel)]="filterStatus" class="form-select max-w-[180px]">
          <option value="">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="pending">Pending</option>
          <option value="working">Working</option>
          <option value="verify">Need Verification</option>
          <option value="completed">Completed</option>
        </select>
        <select [(ngModel)]="filterService" class="form-select max-w-[200px]">
          <option value="">All Services</option>
          @for (s of uniqueServices(); track s) {
            <option [value]="s">{{ s }}</option>
          }
        </select>
        <span class="text-xs text-gray-400 ml-auto">{{ filtered().length }} issues found</span>
      </div>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="font-serif text-lg font-bold text-navy">📋 All Citizen Issues</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="gov-table">
            <thead><tr>
              <th>App ID</th><th>Citizen</th><th>Service</th><th>Type</th>
              <th>District</th><th>Submitted</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              @if (filtered().length === 0) {
                <tr><td colspan="8" class="text-center text-gray-400 py-12">No issues found.</td></tr>
              }
              @for (issue of filtered(); track issue.id) {
                <tr>
                  <td><span class="font-mono text-xs bg-blue-50 text-navy px-2 py-0.5 rounded">{{ issue.appId }}</span></td>
                  <td class="font-medium text-navy">{{ issue.userName }}<br>
                    <span class="text-xs text-gray-400 font-normal">{{ issue.userMobile }}</span></td>
                  <td><span class="font-semibold">{{ issue.service }}</span></td>
                  <td class="text-gray-500 text-xs">{{ issue.type }}</td>
                  <td class="text-gray-500 text-xs">{{ issue.district }}</td>
                  <td class="text-gray-400 text-xs">{{ issue.submittedAt }}</td>
                  <td><app-status-badge [status]="issue.status" /></td>
                  <td><button (click)="openModal(issue)" class="btn btn-navy btn-sm">View & Update</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    @if (selectedIssue()) {
      <div class="modal-backdrop" (click)="closeModal($event)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8
                    animate-[popIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="font-serif text-xl font-bold text-navy">
                {{ selectedIssue()!.service }} — {{ selectedIssue()!.type }}
              </h3>
              <p class="text-xs text-gray-400 mt-1">App ID: {{ selectedIssue()!.appId }}</p>
            </div>
            <button (click)="selectedIssue.set(null)" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div><label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Applicant</label>
              <span class="text-sm">{{ selectedIssue()!.userName }}</span></div>
            <div><label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Mobile</label>
              <span class="text-sm">{{ selectedIssue()!.userMobile }}</span></div>
            <div><label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">District</label>
              <span class="text-sm">{{ selectedIssue()!.district }}</span></div>
            <div><label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Submitted</label>
              <span class="text-sm">{{ selectedIssue()!.submittedAt }}</span></div>
            <div class="col-span-2">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
              <p class="text-sm text-gray-700 leading-relaxed">{{ selectedIssue()!.description }}</p>
            </div>
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Document</label>
              <span class="text-sm text-navy font-medium">📄 {{ selectedIssue()!.fileName }}</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-6">
            <h4 class="text-sm font-bold text-navy mb-4">🛡 Admin Actions</h4>
            <div class="flex flex-wrap gap-2 mb-5">
              <button (click)="pendingStatus.set('working')"
                      [class]="btnCls('working')" class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">
                ⚙️ Working
              </button>
              <button (click)="pendingStatus.set('verify')"
                      [class]="btnCls('verify')" class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">
                🔍 Need Verification
              </button>
              <button (click)="pendingStatus.set('completed')"
                      [class]="btnCls('completed')" class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">
                ✅ Completed
              </button>
            </div>
            <label class="form-label">Note / Message to Citizen</label>
            <textarea [(ngModel)]="adminNote" rows="3" class="form-input resize-none mt-1"
                      placeholder="Type a note for the citizen..."></textarea>
            <div class="flex justify-end gap-3 mt-4">
              <button (click)="selectedIssue.set(null)" class="btn btn-navy btn-sm">Cancel</button>
              <button (click)="save()" class="btn btn-primary btn-sm">💾 Save & Notify</button>
            </div>
          </div>

          <div class="border-t border-gray-100 mt-6 pt-5">
            <h4 class="text-sm font-bold text-navy mb-3">📅 Timeline</h4>
            <div class="space-y-3">
              @for (e of selectedIssue()!.timeline; track e.time) {
                <div class="flex gap-3">
                  <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                       [class]="e.actor === 'admin' ? 'bg-saffron' : 'bg-navy'"></div>
                  <div>
                    <p class="text-xs text-gray-400">{{ e.time }}</p>
                    <p class="text-xs text-gray-700 mt-0.5">{{ e.message }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminIssuesComponent {
  private svc  = inject(IssueService);
  notif        = inject(NotificationService);

  searchTerm    = '';
  filterStatus  = '';
  filterService = '';
  adminNote     = '';

  selectedIssue  = signal<Issue | null>(null);
  pendingStatus  = signal<IssueStatus | ''>('');

  all            = computed(() => this.svc.allIssues());
  uniqueServices = computed(() => [...new Set(this.all().map(i => i.service))]);

  filtered = computed(() => {
    let list = this.all();
    if (this.filterStatus)  list = list.filter(i => i.status === this.filterStatus);
    if (this.filterService) list = list.filter(i => i.service === this.filterService);
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(i =>
        i.appId.toLowerCase().includes(q) ||
        i.userName.toLowerCase().includes(q) ||
        i.service.toLowerCase().includes(q)
      );
    }
    return list;
  });

  openModal(issue: Issue): void {
    this.selectedIssue.set(issue);
    this.pendingStatus.set(issue.status);
    this.adminNote = issue.adminNote ?? '';
  }

  closeModal(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
      this.selectedIssue.set(null);
  }

  btnCls(status: IssueStatus): string {
    const active = this.pendingStatus() === status;
    const map: Record<IssueStatus, string> = {
      working:   active ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-400 text-purple-600 hover:bg-purple-50',
      verify:    active ? 'bg-rose-600 border-rose-600 text-white'     : 'border-rose-400 text-rose-600 hover:bg-rose-50',
      completed: active ? 'bg-green-600 border-green-600 text-white'   : 'border-green-400 text-green-600 hover:bg-green-50',
      applied:   active ? 'bg-blue-600 border-blue-600 text-white'     : 'border-blue-400 text-blue-600 hover:bg-blue-50',
      pending:   active ? 'bg-amber-600 border-amber-600 text-white'   : 'border-amber-400 text-amber-600 hover:bg-amber-50',
    };
    return map[status] ?? '';
  }

  save(): void {
    const issue  = this.selectedIssue();
    const status = this.pendingStatus() as IssueStatus;
    if (!issue || !status) { this.notif.error('Select a status first.'); return; }
    this.svc.updateByAdmin(issue.id, status, this.adminNote);
    this.notif.success('✅ Status updated and citizen notified!');
    this.selectedIssue.set(null);
  }
}
