import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueService } from '../../../core/services/issue.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Issue, IssueStatus } from '../../../shared/models/index';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, FormsModule],
  template: `
    <div class="p-8">
      <div class="mb-8">
        <h2 class="font-serif text-2xl font-bold text-navy">Admin Dashboard 🛡</h2>
        <p class="text-gray-400 text-sm mt-1">Tamil Nadu E-Governance — Issue Management System</p>
      </div>

      <!-- Summary cards -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        @for (c of cards(); track c.label) {
          <div class="card p-5 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                 [style.background]="c.bg">{{ c.icon }}</div>
            <div>
              <div class="font-serif text-3xl font-bold text-navy">{{ c.value }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ c.label }}</div>
            </div>
          </div>
        }
      </div>

      <!-- Recent issues table -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-serif text-lg font-bold text-navy">📋 Recent Issues</h3>
          <a routerLink="../issues" class="text-xs text-navy font-semibold hover:underline">View all →</a>
        </div>
        <div class="overflow-x-auto">
          <table class="gov-table">
            <thead><tr>
              <th>App ID</th><th>Citizen</th><th>Service</th><th>District</th><th>Date</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              @if (recent().length === 0) {
                <tr><td colspan="7" class="text-center text-gray-400 py-10">No issues yet.</td></tr>
              }
              @for (issue of recent(); track issue.id) {
                <tr>
                  <td><span class="font-mono text-xs bg-blue-50 text-navy px-2 py-0.5 rounded">{{ issue.appId }}</span></td>
                  <td class="font-medium text-navy">{{ issue.userName }}</td>
                  <td><span class="font-semibold">{{ issue.service }}</span><br><span class="text-xs text-gray-400">{{ issue.type }}</span></td>
                  <td class="text-gray-500 text-xs">{{ issue.district }}</td>
                  <td class="text-gray-400 text-xs">{{ issue.submittedAt }}</td>
                  <td><app-status-badge [status]="issue.status" /></td>
                  <td>
                    <button (click)="openModal(issue)" class="btn btn-navy btn-sm">View & Update</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Issue detail modal -->
    <ng-container *ngTemplateOutlet="issueModalTpl" />

    <ng-template #issueModalTpl>
      @if (modalIssue()) {
        <div class="modal-backdrop" (click)="closeModal($event)">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8
                      animate-[popIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
            <!-- Header -->
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="font-serif text-xl font-bold text-navy">
                  {{ modalIssue()!.service }} — {{ modalIssue()!.type }}
                </h3>
                <p class="text-xs text-gray-400 mt-1">App ID: {{ modalIssue()!.appId }}</p>
              </div>
              <button (click)="selectedIssue.set(null)" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
            </div>

            <!-- Info grid -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              @for (info of issueInfo(); track info.label) {
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">{{ info.label }}</label>
                  <span class="text-sm text-gray-800">{{ info.value }}</span>
                </div>
              }
              <div class="col-span-2">
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                <p class="text-sm text-gray-700 leading-relaxed">{{ modalIssue()!.description }}</p>
              </div>
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Document</label>
                <span class="text-sm text-navy font-medium">📄 {{ modalIssue()!.fileName }}</span>
              </div>
            </div>

            <!-- Admin actions -->
            <div class="border-t border-gray-100 pt-6">
              <h4 class="text-sm font-bold text-navy mb-4">🛡 Admin Actions</h4>

              <!-- Status buttons -->
              <div class="flex flex-wrap gap-2 mb-5">
                <button (click)="setStatus('working')"
                        [class]="statusBtnClass('working')"
                        class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">
                  ⚙️ Working
                </button>
                <button (click)="setStatus('verify')"
                        [class]="statusBtnClass('verify')"
                        class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">
                  🔍 Need Verification
                </button>
                <button (click)="setStatus('completed')"
                        [class]="statusBtnClass('completed')"
                        class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">
                  ✅ Completed
                </button>
              </div>

              <label class="form-label mb-2">Add Note / Message to Citizen</label>
              <textarea [(ngModel)]="adminNote" rows="3"
                        class="form-input resize-none"
                        placeholder="Type a message or update for the citizen..."></textarea>

              <div class="flex justify-end gap-3 mt-4">
                <button (click)="selectedIssue.set(null)" class="btn btn-navy btn-sm">Cancel</button>
                <button (click)="save()" class="btn btn-primary btn-sm">💾 Save & Notify Citizen</button>
              </div>
            </div>

            <!-- Timeline -->
            <div class="border-t border-gray-100 mt-6 pt-5">
              <h4 class="text-sm font-bold text-navy mb-4">📅 Timeline</h4>
              <div class="space-y-3">
                @for (entry of modalIssue()!.timeline; track entry.time) {
                  <div class="flex gap-3 items-start">
                    <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                         [class]="entry.actor === 'admin' ? 'bg-saffron' : 'bg-navy'"></div>
                    <div>
                      <p class="text-xs text-gray-400">{{ entry.time }}</p>
                      <p class="text-xs text-gray-700 mt-0.5">{{ entry.message }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </ng-template>
  `,
})
export class AdminOverviewComponent {
  issueService  = inject(IssueService);
  notif         = inject(NotificationService);

  selectedIssue = signal<Issue | null>(null);
  selectedStatus = signal<IssueStatus | ''>('');
  adminNote      = '';

  private counts = computed(() => this.issueService.countAll());
  all    = computed(() => this.issueService.allIssues());
  recent = computed(() => [...this.all()].slice(0, 8));

  cards = computed(() => [
    { icon: '📋', bg: '#dbeafe', value: this.counts().total,     label: 'Total Issues' },
    { icon: '⏳', bg: '#fef3c7', value: this.counts().applied + this.counts().pending,   label: 'Pending' },
    { icon: '⚙️', bg: '#ede9fe', value: this.counts().working,   label: 'Working' },
    { icon: '🔍', bg: '#fce7f3', value: this.counts().verify,    label: 'Need Verification' },
    { icon: '✅', bg: '#dcfce7', value: this.counts().completed, label: 'Completed' },
  ]);

  modalIssue = computed(() => this.selectedIssue());

  issueInfo = computed(() => {
    const i = this.selectedIssue();
    if (!i) return [];
    return [
      { label: 'Applicant',   value: i.userName },
      { label: 'Mobile',      value: i.userMobile },
      { label: 'District',    value: i.district },
      { label: 'Submitted',   value: i.submittedAt },
      { label: 'Aadhaar',     value: i.aadhaar || '—' },
      { label: 'Status',      value: i.status },
    ];
  });

  openModal(issue: Issue): void {
    this.selectedIssue.set(issue);
    this.selectedStatus.set(issue.status);
    this.adminNote = issue.adminNote ?? '';
  }

  closeModal(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.selectedIssue.set(null);
    }
  }

  setStatus(status: IssueStatus): void {
    this.selectedStatus.set(status);
  }

  statusBtnClass(status: IssueStatus): string {
    const active = this.selectedStatus() === status;
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
    const issue = this.selectedIssue();
    const status = this.selectedStatus();
    if (!issue || !status) {
      this.notif.error('Please select a status first.'); return;
    }
    this.issueService.updateByAdmin(issue.id, status as IssueStatus, this.adminNote);
    this.notif.success('✅ Status updated and citizen notified!');
    this.selectedIssue.set(null);
  }
}
