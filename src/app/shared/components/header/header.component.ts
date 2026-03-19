import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Top stripe -->
    <div class="bg-navy text-white/70 text-xs py-1.5 px-6 flex justify-between items-center">
      <span>🇮🇳 Government of Tamil Nadu — Official E-Governance Portal</span>
      <span>📞 Helpline: 1800-100-4567 &nbsp;|&nbsp; ✉ helpdesk&#64;tn.gov.in</span>
    </div>

    <!-- Main header -->
    <header class="bg-white border-b-[3px] border-saffron shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-3 flex items-center gap-5">
        <!-- Emblem -->
        <a routerLink="/home" class="flex-shrink-0">
          <div class="w-14 h-14 rounded-full bg-navy flex items-center justify-center border-2 border-saffron/40">
            <span class="text-saffron font-serif text-2xl font-bold">த</span>
          </div>
        </a>

        <!-- Title -->
        <div>
          <h1 class="font-serif text-xl font-bold text-navy leading-tight">Tamil Nadu E-Governance Portal</h1>
          <p class="text-xs text-gray-500 mt-0.5">தமிழ்நாடு இ-ஆட்சி போர்டல் &nbsp;|&nbsp; Citizen Services Online</p>
        </div>

        <!-- Tricolor -->
        <div class="hidden md:flex gap-1 items-center ml-2">
          <div class="w-1 h-8 rounded bg-[#FF9933]"></div>
          <div class="w-1 h-8 rounded bg-gray-200 border border-gray-200"></div>
          <div class="w-1 h-8 rounded bg-govgreen"></div>
        </div>

        <!-- Right actions -->
        <div class="ml-auto flex items-center gap-3">
          @if (auth.isAuthenticated()) {
            <span class="text-sm text-gray-600 hidden md:block">
              👤 {{ auth.currentUser()?.firstName }} {{ auth.currentUser()?.lastName }}
            </span>
            <button (click)="auth.logout()"
                    class="btn btn-sm border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600">
              🚪 Logout
            </button>
          } @else {
            <a routerLink="/auth/login" class="btn btn-primary btn-sm">🔐 Login / Register</a>
          }
        </div>
      </div>
    </header>

    <!-- Nav bar -->
    <nav class="bg-navy">
      <div class="max-w-7xl mx-auto px-6 flex items-center">
        <a routerLink="/home" routerLinkActive="active-nav"
           class="nav-item">🏛 Home</a>
        @if (auth.isCitizen()) {
          <a routerLink="/dashboard" routerLinkActive="active-nav" class="nav-item">📊 My Dashboard</a>
          <a routerLink="/dashboard/apply" routerLinkActive="active-nav" class="nav-item">📝 Apply</a>
          <a routerLink="/dashboard/my-issues" routerLinkActive="active-nav" class="nav-item">📋 My Applications</a>
          <a routerLink="/dashboard/updates" routerLinkActive="active-nav" class="nav-item">🔔 Updates</a>
        }
        @if (auth.isAdmin()) {
          <a routerLink="/admin" routerLinkActive="active-nav" class="nav-item">📊 Admin Dashboard</a>
          <a routerLink="/admin/issues" routerLinkActive="active-nav" class="nav-item">📋 All Issues</a>
        }
        @if (!auth.isAuthenticated()) {
          <a routerLink="/auth/login" class="nav-item">📋 Services</a>
          <a routerLink="/auth/login" class="nav-item">📞 Grievance</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .nav-item {
      @apply text-white/80 px-4 py-3 text-sm font-medium transition-all duration-200
             border-b-[3px] border-transparent inline-block hover:text-saffron-light hover:border-saffron hover:bg-white/5;
    }
    .active-nav {
      @apply text-saffron-light border-b-[3px] border-saffron bg-white/5;
    }
  `],
})
export class HeaderComponent {
  auth = inject(AuthService);
}
