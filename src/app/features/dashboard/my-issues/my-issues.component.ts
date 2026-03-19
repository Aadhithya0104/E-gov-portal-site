import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IssueService } from '../../../core/services/issue.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-my-issues',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="p-8">
      <nav class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <a routerLink="../overview" class="hover:text-navy">Dashboard</a>
        <span>›</span><span class="text-navy font-semibold">My Applications</span>
      </nav>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-serif text-lg font-bold text-navy">📋 All My Applications</h3>
          <a routerLink="../apply" class="btn btn-primary btn-sm">+ New Application</a>
        </div>

        <div class="overflow-x-auto">
          <table class="gov-table">
            <thead>
              <tr>
                <th>App ID</th><th>Service</th><th>Type</th>
                <th>District</th><th>Submitted</th><th>Status</th><th>Admin Note</th>
              </tr>
            </thead>
            <tbody>
              @if (issues().length === 0) {
                <tr><td colspan="7" class="text-center text-gray-400 py-12">
                  No applications yet.
                  <a routerLink="../apply" class="text-navy font-semibold hover:underline ml-1">Apply now →</a>
                </td></tr>
              }
              @for (issue of issues(); track issue.id) {
                <tr>
                  <td>
                    <span class="font-mono text-xs bg-blue-50 text-navy px-2 py-0.5 rounded">
                      {{ issue.appId }}
                    </span>
                  </td>
                  <td><span class="font-semibold text-navy">{{ issue.service }}</span></td>
                  <td class="text-gray-500 text-xs">{{ issue.type }}</td>
                  <td class="text-gray-500 text-xs">{{ issue.district }}</td>
                  <td class="text-gray-400 text-xs">{{ issue.submittedAt }}</td>
                  <td><app-status-badge [status]="issue.status" /></td>
                  <td class="text-xs max-w-[180px]">
                    @if (issue.adminNote) {
                      <span class="text-amber-700 font-medium truncate block">
                        📌 {{ issue.adminNote }}
                      </span>
                    } @else {
                      <span class="text-gray-400">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class MyIssuesComponent {
  private auth  = inject(AuthService);
  private svc   = inject(IssueService);

  issues = computed(() =>
    this.svc.allIssues().filter(i => i.userId === this.auth.currentUser()?.id)
  );
}
