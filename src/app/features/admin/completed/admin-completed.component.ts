import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueService } from '../../../core/services/issue.service';

@Component({
  selector: 'app-admin-completed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <a routerLink="../overview" class="hover:text-navy cursor-pointer">Admin Dashboard</a>
        <span>›</span>
        <span class="text-navy font-semibold">Completed Issues</span>
      </nav>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-serif text-lg font-bold text-navy">✅ Completed Issues</h3>
          <span class="badge badge-completed">{{ completed().length }} completed</span>
        </div>

        <div class="overflow-x-auto">
          <table class="gov-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Citizen</th>
                <th>Service</th>
                <th>Type</th>
                <th>District</th>
                <th>Submitted</th>
                <th>Resolved</th>
                <th>Admin Note</th>
              </tr>
            </thead>
            <tbody>
              @if (completed().length === 0) {
                <tr>
                  <td colspan="8" class="text-center text-gray-400 py-12">
                    No completed issues yet.
                  </td>
                </tr>
              }
              @for (issue of completed(); track issue.id) {
                <tr>
                  <td>
                    <span class="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                      {{ issue.appId }}
                    </span>
                  </td>
                  <td>
                    <span class="font-medium text-navy">{{ issue.userName }}</span><br>
                    <span class="text-xs text-gray-400">{{ issue.userMobile }}</span>
                  </td>
                  <td><strong>{{ issue.service }}</strong></td>
                  <td class="text-gray-500 text-xs">{{ issue.type }}</td>
                  <td class="text-gray-500 text-xs">{{ issue.district }}</td>
                  <td class="text-gray-400 text-xs">{{ issue.submittedAt }}</td>
                  <td class="text-gray-400 text-xs">{{ issue.updatedAt }}</td>
                  <td class="text-xs text-gray-600 max-w-xs">
                    @if (issue.adminNote) {
                      <span class="line-clamp-2">{{ issue.adminNote }}</span>
                    } @else {
                      <span class="text-gray-300">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Summary footer -->
        @if (completed().length > 0) {
          <div class="px-6 py-3 bg-green-50 border-t border-green-100 text-xs text-green-700 font-medium">
            ✅ {{ completed().length }} issue{{ completed().length !== 1 ? 's' : '' }} resolved successfully
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminCompletedComponent {
  private svc = inject(IssueService);

  completed = computed(() =>
    this.svc.allIssues().filter(i => i.status === 'completed')
  );
}
