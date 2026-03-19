import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IssueService } from '../../../core/services/issue.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { Issue, IssueStatus } from '../../../shared/models/index';

@Component({
  selector: 'app-admin-pending',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="p-8">
      <nav class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <a routerLink="../overview" class="hover:text-navy">Admin Dashboard</a>
        <span>›</span><span class="text-navy font-semibold">Pending Issues</span>
      </nav>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-serif text-lg font-bold text-navy">⏳ Pending Issues</h3>
          <span class="badge badge-pending">{{ pending().length }} pending</span>
        </div>
        <div class="overflow-x-auto">
          <table class="gov-table">
            <thead><tr>
              <th>App ID</th><th>Citizen</th><th>Service</th><th>District</th><th>Submitted</th><th>Status</th><th>Action</th>
            </tr></thead>
            <tbody>
              @if (pending().length === 0) {
                <tr><td colspan="7" class="text-center text-gray-400 py-12">
                  🎉 No pending issues. All caught up!
                </td></tr>
              }
              @for (issue of pending(); track issue.id) {
                <tr>
                  <td><span class="font-mono text-xs bg-blue-50 text-navy px-2 py-0.5 rounded">{{ issue.appId }}</span></td>
                  <td class="font-medium text-navy">{{ issue.userName }}</td>
                  <td><strong>{{ issue.service }}</strong><br><span class="text-xs text-gray-400">{{ issue.type }}</span></td>
                  <td class="text-gray-500 text-xs">{{ issue.district }}</td>
                  <td class="text-gray-400 text-xs">{{ issue.submittedAt }}</td>
                  <td><app-status-badge [status]="issue.status" /></td>
                  <td><button (click)="openModal(issue)" class="btn btn-primary btn-sm">Resolve →</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    @if (sel()) {
      <div class="modal-backdrop" (click)="close($event)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 animate-[popIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)] max-h-[85vh] overflow-y-auto">
          <div class="flex justify-between mb-5">
            <h3 class="font-serif text-lg font-bold text-navy">{{ sel()!.service }} — {{ sel()!.type }}</h3>
            <button (click)="sel.set(null)" class="text-gray-400 text-2xl leading-none">✕</button>
          </div>
          <p class="text-sm text-gray-600 mb-5 leading-relaxed">{{ sel()!.description }}</p>
          <div class="grid grid-cols-2 gap-3 mb-5 text-sm">
            <div><span class="text-gray-400 text-xs uppercase font-bold">Citizen:</span><br>{{ sel()!.userName }}</div>
            <div><span class="text-gray-400 text-xs uppercase font-bold">District:</span><br>{{ sel()!.district }}</div>
          </div>
          <div class="flex flex-wrap gap-2 mb-4">
            <button (click)="ps.set('working')"   [class]="bc('working')"   class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">⚙️ Working</button>
            <button (click)="ps.set('verify')"    [class]="bc('verify')"    class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">🔍 Need Verification</button>
            <button (click)="ps.set('completed')" [class]="bc('completed')" class="px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all">✅ Completed</button>
          </div>
          <textarea [(ngModel)]="note" rows="3" class="form-input resize-none" placeholder="Note to citizen..."></textarea>
          <div class="flex justify-end gap-3 mt-4">
            <button (click)="sel.set(null)" class="btn btn-navy btn-sm">Cancel</button>
            <button (click)="save()" class="btn btn-primary btn-sm">💾 Save</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminPendingComponent {
  private svc = inject(IssueService);
  notif       = inject(NotificationService);

  sel  = signal<Issue | null>(null);
  ps   = signal<IssueStatus | ''>('');
  note = '';

  pending = computed(() =>
    this.svc.allIssues().filter(i => i.status === 'applied' || i.status === 'pending')
  );

  openModal(issue: Issue): void {
    this.sel.set(issue);
    this.ps.set(issue.status);
    this.note = issue.adminNote ?? '';
  }

  close(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) this.sel.set(null);
  }

  bc(status: IssueStatus): string {
    const active = this.ps() === status;
    const map: Record<IssueStatus, string> = {
      working:   active ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-400 text-purple-600 hover:bg-purple-50',
      verify:    active ? 'bg-rose-600 border-rose-600 text-white'     : 'border-rose-400 text-rose-600 hover:bg-rose-50',
      completed: active ? 'bg-green-600 border-green-600 text-white'   : 'border-green-400 text-green-600 hover:bg-green-50',
      applied:   '',
      pending:   '',
    };
    return map[status] ?? '';
  }

  save(): void {
    const issue  = this.sel();
    const status = this.ps() as IssueStatus;
    if (!issue || !status) { this.notif.error('Select a status.'); return; }
    this.svc.updateByAdmin(issue.id, status, this.note);
    this.notif.success('✅ Issue updated!');
    this.sel.set(null);
  }
}
