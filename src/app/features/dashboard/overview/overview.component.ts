import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { IssueService } from '../../../core/services/issue.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="p-8">
      <!-- Greeting -->
      <div class="mb-8">
        <h2 class="font-serif text-2xl font-bold text-navy">
          Good day, {{ auth.currentUser()?.firstName }}! 👋
        </h2>
        <p class="text-gray-400 text-sm mt-1">{{ today }} &nbsp;|&nbsp; Tamil Nadu E-Governance Portal</p>
      </div>

      <!-- Summary cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        @for (card of summaryCards(); track card.label) {
          <div class="card p-5 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                 [style.background]="card.bg">{{ card.icon }}</div>
            <div>
              <div class="font-serif text-3xl font-bold text-navy">{{ card.value }}</div>
              <div class="text-xs text-gray-400 mt-0.5">{{ card.label }}</div>
            </div>
          </div>
        }
      </div>

      <!-- Recent applications -->
      <div class="card overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-serif text-lg font-bold text-navy">📋 Recent Applications</h3>
          <a routerLink="../apply" class="btn btn-primary btn-sm">+ New Application</a>
        </div>
        <div class="overflow-x-auto">
          <table class="gov-table">
            <thead>
              <tr>
                <th>App ID</th><th>Service</th><th>Date</th><th>Status</th><th>Admin Note</th>
              </tr>
            </thead>
            <tbody>
              @if (recentIssues().length === 0) {
                <tr><td colspan="5" class="text-center text-gray-400 py-10">
                  No applications yet. <a routerLink="../apply" class="text-navy font-semibold hover:underline">Apply now →</a>
                </td></tr>
              }
              @for (issue of recentIssues(); track issue.id) {
                <tr>
                  <td>
                    <span class="font-mono text-xs bg-blue-50 text-navy px-2 py-0.5 rounded">{{ issue.appId }}</span>
                  </td>
                  <td><span class="font-semibold">{{ issue.service }}</span><span class="text-gray-400 text-xs ml-1">· {{ issue.type }}</span></td>
                  <td class="text-gray-400 text-xs">{{ issue.submittedAt }}</td>
                  <td><app-status-badge [status]="issue.status" /></td>
                  <td class="text-xs text-gray-500 max-w-[200px] truncate">
                    {{ issue.adminNote || '—' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Admin updates widget -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-serif text-lg font-bold text-navy">🔔 Latest Updates from Admin</h3>
          <a routerLink="../updates" class="text-xs text-navy font-semibold hover:underline">View all →</a>
        </div>
        <div class="divide-y divide-gray-50">
          @if (issuesWithNotes().length === 0) {
            <p class="text-gray-400 text-sm p-6">No updates from admin yet.</p>
          }
          @for (issue of issuesWithNotes().slice(0, 3); track issue.id) {
            <div class="flex gap-4 p-5 hover:bg-gray-50 transition-colors">
              <div class="text-2xl">📌</div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm text-navy">{{ issue.service }} — {{ issue.appId }}</div>
                <div class="text-sm text-gray-600 mt-0.5 truncate">{{ issue.adminNote }}</div>
                <div class="flex items-center gap-2 mt-1.5">
                  <app-status-badge [status]="issue.status" />
                  <span class="text-xs text-gray-400">Updated: {{ issue.updatedAt }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class OverviewComponent {
  auth        = inject(AuthService);
  issueService = inject(IssueService);

  today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  private userId = computed(() => this.auth.currentUser()?.id ?? '');
  private counts  = computed(() => this.issueService.countsByUser(this.userId()));
  private myIssues = computed(() => this.issueService.allIssues().filter(i => i.userId === this.userId()));

  summaryCards = computed(() => [
    { icon: '📋', bg: '#dbeafe', value: this.counts().total,      label: 'Total Applied' },
    { icon: '⏳', bg: '#fef3c7', value: this.counts().inProgress,  label: 'In Progress' },
    { icon: '⚙️', bg: '#ede9fe', value: this.counts().working,     label: 'Working' },
    { icon: '✅', bg: '#dcfce7', value: this.counts().completed,   label: 'Completed' },
  ]);

  recentIssues  = computed(() => [...this.myIssues()].slice(0, 5));
  issuesWithNotes = computed(() => this.myIssues().filter(i => i.adminNote).reverse());
}
