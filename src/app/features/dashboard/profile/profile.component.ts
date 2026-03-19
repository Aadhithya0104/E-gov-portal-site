import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="p-8 max-w-3xl">
      <nav class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <a routerLink="../overview" class="hover:text-navy">Dashboard</a>
        <span>›</span><span class="text-navy font-semibold">My Profile</span>
      </nav>

      <div class="card">
        <div class="border-b border-gray-100 px-8 py-5">
          <h3 class="font-serif text-xl font-bold text-navy">👤 My Profile</h3>
          <p class="text-sm text-gray-400 mt-1">Your registered information on Tamil Nadu E-Governance Portal</p>
        </div>
        <div class="p-8">
          <!-- Avatar block -->
          <div class="flex items-center gap-5 mb-8 p-5 bg-navy/5 rounded-xl border border-navy/10">
            <div class="w-16 h-16 rounded-full bg-navy flex items-center justify-center
                        font-bold text-white text-2xl flex-shrink-0">
              {{ user?.firstName?.charAt(0) }}
            </div>
            <div>
              <h4 class="font-serif text-lg font-bold text-navy">
                {{ user?.firstName }} {{ user?.lastName }}
              </h4>
              <p class="text-sm text-gray-500 mt-0.5">{{ user?.id }}</p>
              <span class="inline-flex items-center gap-1 mt-2 bg-green-50 text-green-700 border border-green-100
                           text-xs px-2.5 py-1 rounded-full font-semibold">
                ✅ Verified Account
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="form-label">First Name</label>
              <input class="form-input bg-gray-50 cursor-not-allowed" [value]="user?.firstName ?? ''" readonly>
            </div>
            <div>
              <label class="form-label">Last Name</label>
              <input class="form-input bg-gray-50 cursor-not-allowed" [value]="user?.lastName ?? ''" readonly>
            </div>
            <div>
              <label class="form-label">Email Address</label>
              <input class="form-input bg-gray-50 cursor-not-allowed" [value]="user?.email ?? ''" readonly>
            </div>
            <div>
              <label class="form-label">Mobile Number</label>
              <input class="form-input bg-gray-50 cursor-not-allowed" [value]="user?.mobile ?? ''" readonly>
            </div>
            <div>
              <label class="form-label">Citizen ID</label>
              <input class="form-input bg-gray-50 cursor-not-allowed font-mono" [value]="user?.id ?? ''" readonly>
            </div>
            <div>
              <label class="form-label">Account Created</label>
              <input class="form-input bg-gray-50 cursor-not-allowed" [value]="user?.createdAt ?? ''" readonly>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-100 flex gap-3 justify-end">
            <button class="btn btn-navy btn-sm" disabled>✏️ Edit Profile (Coming Soon)</button>
            <button class="btn btn-navy btn-sm" disabled>🔑 Change Password (Coming Soon)</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent {
  auth = inject(AuthService);
  get user() { return this.auth.currentUser(); }
}
