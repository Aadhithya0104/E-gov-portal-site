import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent],
  template: `
    <app-header />
    <div class="flex min-h-[calc(100vh-120px)]">

      <!-- SIDEBAR -->
      <aside class="w-60 bg-navy flex-shrink-0 flex flex-col py-6 sticky top-[120px] h-[calc(100vh-120px)] overflow-y-auto">
        <!-- User info -->
        <div class="px-5 pb-5 mb-2 border-b border-white/10">
          <div class="w-11 h-11 rounded-full bg-saffron flex items-center justify-center
                      font-bold text-white text-lg mb-3">
            {{ auth.currentUser()?.firstName?.charAt(0) }}
          </div>
          <div class="text-white text-sm font-semibold leading-tight">
            {{ auth.currentUser()?.firstName }} {{ auth.currentUser()?.lastName }}
          </div>
          <div class="text-white/40 text-xs mt-0.5">{{ auth.currentUser()?.id }}</div>
        </div>

        <div class="text-white/30 text-[10px] font-bold uppercase tracking-widest px-5 py-2">Main</div>
        <a routerLink="overview"  routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="sidebar-link"><span>🏠</span> Dashboard</a>
        <a routerLink="apply"     routerLinkActive="active" class="sidebar-link"><span>📝</span> Apply / Raise Issue</a>
        <a routerLink="my-issues" routerLinkActive="active" class="sidebar-link"><span>📋</span> My Applications</a>
        <a routerLink="updates"   routerLinkActive="active" class="sidebar-link"><span>🔔</span> Admin Updates</a>

        <div class="text-white/30 text-[10px] font-bold uppercase tracking-widest px-5 py-2 mt-2">Quick Services</div>
        <a routerLink="apply" class="sidebar-link"><span>🪪</span> Aadhaar Services</a>
        <a routerLink="apply" class="sidebar-link"><span>🍚</span> Ration Card</a>
        <a routerLink="apply" class="sidebar-link"><span>🗳</span> Voter ID</a>
        <a routerLink="apply" class="sidebar-link"><span>📜</span> Patta & Chitta</a>

        <div class="text-white/30 text-[10px] font-bold uppercase tracking-widest px-5 py-2 mt-2">Account</div>
        <a routerLink="profile" routerLinkActive="active" class="sidebar-link"><span>👤</span> My Profile</a>
        <button (click)="auth.logout()" class="sidebar-link w-full text-left mt-1 text-red-300/70 hover:text-red-300">
          <span>🚪</span> Logout
        </button>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 bg-gray-50 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class DashboardShellComponent {
  auth = inject(AuthService);
}
