import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IssueService } from '../../../core/services/issue.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="p-8">
      <nav class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <a routerLink="../overview" class="hover:text-navy">Dashboard</a>
        <span>›</span><span class="text-navy font-semibold">Admin Updates</span>
      </nav>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="font-serif text-lg font-bold text-navy">🔔 Updates & Messages from Admin</h3>
        </div>

        @if (updatedIssues().length === 0) {
          <div class="p-10 text-center text-gray-400">
            <div class="text-4xl mb-3">🔕</div>
            <p>No updates from admin yet. We'll notify you when your applications are reviewed.</p>
          </div>
        }

        <div class="divide-y divide-gray-50">
          @for (issue of updatedIssues(); track issue.id) {
            <div class="p-6 hover:bg-gray-50/50 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-semibold text-navy text-sm">{{ issue.service }} – {{ issue.type }}</h4>
                  <p class="text-xs text-gray-400 mt-0.5">
                    App ID: <span class="font-mono text-navy">{{ issue.appId }}</span>
                    &nbsp;|&nbsp; Filed: {{ issue.submittedAt }}
                  </p>
                </div>
                <app-status-badge [status]="issue.status" />
              </div>

              <!-- Admin message box -->
              <div class="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <div class="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">
                  📌 Admin Message
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">{{ issue.adminNote }}</p>
                <p class="text-xs text-gray-400 mt-2">Updated: {{ issue.updatedAt }}</p>
              </div>

              <!-- Timeline -->
              <div class="mt-4 space-y-2">
                @for (entry of issue.timeline; track entry.time) {
                  <div class="flex gap-3 items-start">
                    <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                         [class]="entry.actor === 'admin' ? 'bg-saffron' : 'bg-navy'"></div>
                    <div>
                      <p class="text-xs text-gray-400">{{ entry.time }}</p>
                      <p class="text-xs text-gray-600 mt-0.5">{{ entry.message }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class UpdatesComponent {
  private auth = inject(AuthService);
  private svc  = inject(IssueService);

  updatedIssues = computed(() =>
    this.svc.allIssues()
      .filter(i => i.userId === this.auth.currentUser()?.id && i.adminNote)
      .reverse()
  );
}
