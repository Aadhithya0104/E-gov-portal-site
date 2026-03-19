import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent],
  template: `
    <app-header />
    <div class="flex min-h-[calc(100vh-120px)]">

      <!-- SIDEBAR -->
      <aside class="w-60 bg-navy flex-shrink-0 flex flex-col py-6 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
        <div class="px-5 pb-5 mb-2 border-b border-white/10">
          <div class="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center
                      font-bold text-white text-sm mb-3">ADM</div>
          <div class="text-white text-sm font-semibold">Admin Officer</div>
          <div class="text-white/40 text-xs mt-0.5">TN-ADMIN-001</div>
        </div>

        <div class="text-white/30 text-[10px] font-bold uppercase tracking-widest px-5 py-2">Admin Panel</div>
        <a routerLink="overview"  routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="sidebar-link"><span>📊</span> Overview</a>
        <a routerLink="issues"    routerLinkActive="active" class="sidebar-link"><span>📋</span> All Issues</a>
        <a routerLink="pending"   routerLinkActive="active" class="sidebar-link"><span>⏳</span> Pending</a>
        <a routerLink="completed" routerLinkActive="active" class="sidebar-link"><span>✅</span> Completed</a>

        <div class="text-white/30 text-[10px] font-bold uppercase tracking-widest px-5 py-2 mt-2">Account</div>
        <button (click)="auth.logout()" class="sidebar-link w-full text-left text-red-300/70 hover:text-red-300">
          <span>🚪</span> Logout
        </button>
      </aside>

      <!-- MAIN -->
      <main class="flex-1 bg-gray-50 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminShellComponent {
  auth = inject(AuthService);
}
