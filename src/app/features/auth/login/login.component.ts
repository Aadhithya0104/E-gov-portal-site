import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

type Tab = 'citizen' | 'admin' | 'register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header />

    <div class="min-h-[calc(100vh-156px)] bg-gradient-to-br from-blue-50 to-indigo-50
                flex items-center justify-center px-4 py-16">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">

        <!-- Header band -->
        <div class="bg-navy px-8 py-7 text-center">
          <div class="w-14 h-14 rounded-full bg-saffron/20 border border-saffron/40
                      flex items-center justify-center mx-auto mb-3">
            <span class="text-2xl">🔐</span>
          </div>
          <h2 class="font-serif text-xl text-white font-bold">Welcome to TN E-Governance</h2>
          <p class="text-white/60 text-xs mt-1">Secure citizen login portal</p>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-100">
          @for (tab of tabs; track tab.id) {
            <button (click)="activeTab.set(tab.id)"
                    [class]="activeTab() === tab.id ? activeTabCls : inactiveTabCls">
              {{ tab.label }}
            </button>
          }
        </div>

        <!-- ── CITIZEN LOGIN ── -->
        @if (activeTab() === 'citizen') {
          <div class="p-8 animate-fade-up">
            <div class="space-y-4">
              <div>
                <label class="form-label">Mobile Number</label>
                <input type="text" [(ngModel)]="citizenMobile" class="form-input"
                       placeholder="10-digit mobile number" maxlength="10">
              </div>
              <div>
                <label class="form-label">Password</label>
                <input type="password" [(ngModel)]="citizenPass" class="form-input"
                       placeholder="Enter your password"
                       (keydown.enter)="doCitizenLogin()">
                <p class="text-xs text-gray-400 mt-1.5">
                  Demo: mobile = <strong class="text-navy">9876543210</strong>
                  &nbsp;|&nbsp; password = <strong class="text-navy">citizen123</strong>
                </p>
              </div>
            </div>
            <button (click)="doCitizenLogin()"
                    class="btn btn-navy w-full justify-center mt-6 py-3 text-base">
              Login as Citizen →
            </button>
            <p class="text-center text-sm text-gray-400 mt-4">
              New user?
              <button (click)="activeTab.set('register')"
                      class="text-navy font-semibold hover:underline bg-transparent border-0 cursor-pointer">
                Register here
              </button>
            </p>
          </div>
        }

        <!-- ── ADMIN LOGIN ── -->
        @if (activeTab() === 'admin') {
          <div class="p-8 animate-fade-up">
            <div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5
                        flex items-center gap-2 text-xs text-amber-700">
              🔒 Restricted Access — Authorised Personnel Only
            </div>
            <div class="space-y-4">
              <div>
                <label class="form-label">Admin Employee ID</label>
                <input type="text" [(ngModel)]="adminId" class="form-input"
                       placeholder="e.g. TN-ADMIN-001">
              </div>
              <div>
                <label class="form-label">Password</label>
                <input type="password" [(ngModel)]="adminPass" class="form-input"
                       placeholder="Enter admin password"
                       (keydown.enter)="doAdminLogin()">
                <p class="text-xs text-gray-400 mt-1.5">
                  Demo: ID = <strong class="text-navy">TN-ADMIN-001</strong>
                  &nbsp;|&nbsp; password = <strong class="text-navy">admin&#64;2025</strong>
                </p>
              </div>
            </div>
            <button (click)="doAdminLogin()"
                    class="btn btn-primary w-full justify-center mt-6 py-3 text-base">
              Login as Admin →
            </button>
          </div>
        }

        <!-- ── NEW USER REGISTER ── -->
        @if (activeTab() === 'register') {
          <div class="p-8 animate-fade-up">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="form-label">First Name *</label>
                <input type="text" [(ngModel)]="regFirst" class="form-input" placeholder="First name">
              </div>
              <div>
                <label class="form-label">Last Name *</label>
                <input type="text" [(ngModel)]="regLast" class="form-input" placeholder="Last name">
              </div>
            </div>
            <div class="mb-4">
              <label class="form-label">Email Address *</label>
              <input type="email" [(ngModel)]="regEmail" class="form-input"
                     placeholder="your&#64;email.com">
            </div>
            <div class="mb-2">
              <label class="form-label">Mobile Number *</label>
              <input type="tel" [(ngModel)]="regMobile" class="form-input"
                     placeholder="10-digit mobile number" maxlength="10">
              <p class="text-xs text-gray-400 mt-1.5">An OTP will be sent for verification</p>
            </div>
            <button (click)="doRegister()"
                    class="btn btn-green w-full justify-center mt-5 py-3 text-base">
              Send OTP & Register →
            </button>
          </div>
        }
      </div>
    </div>

    <!-- ── OTP MODAL ── -->
    @if (showOtpModal()) {
      <div class="modal-backdrop" (click)="closeOtpOnBackdrop($event)">
        <div class="modal-box text-center">
          <!-- Icon -->
          <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center
                      mx-auto mb-4 text-3xl">📱</div>

          <h3 class="font-serif text-xl text-navy font-bold mb-2">OTP Verification</h3>
          <p class="text-sm text-gray-400 mb-5">
            Your One-Time Password has been sent to<br>
            <strong class="text-navy">+91 {{ regMobile.slice(0, 5) }}XXXXX</strong>
          </p>

          <!-- OTP display box (demo) -->
          <div class="bg-navy rounded-xl py-5 px-6 mb-2 font-mono text-white text-4xl
                      font-bold tracking-[14px] select-all">
            {{ currentOtp() }}
          </div>
          <p class="text-[11px] text-gray-400 mb-6">
            ⚠️ Demo Mode — OTP shown above for testing purposes
          </p>

          <!-- OTP input boxes -->
          <div class="flex gap-2 justify-center mb-6">
            @for (idx of otpIndexes; track idx) {
              <input
                type="text"
                inputmode="numeric"
                maxlength="1"
                [(ngModel)]="otpDigits[idx]"
                (input)="onOtpInput(idx)"
                (keydown)="onOtpKeydown(idx, $event)"
                [id]="'otp_' + idx"
                class="otp-digit"
              >
            }
          </div>

          <button (click)="verifyOtp()"
                  class="btn btn-primary w-full justify-center py-3 text-base">
            Verify & Complete Registration
          </button>
          <p class="text-xs text-gray-400 mt-4">
            Didn't get it?
            <button (click)="resendOtp()"
                    class="text-navy font-semibold hover:underline bg-transparent border-0 cursor-pointer">
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    }

    <app-footer />
  `,
})
export class LoginComponent {
  private auth  = inject(AuthService);
  private notif = inject(NotificationService);

  activeTab = signal<Tab>('citizen');

  /* Citizen */
  citizenMobile = '';
  citizenPass   = '';

  /* Admin */
  adminId   = '';
  adminPass = '';

  /* Register */
  regFirst  = '';
  regLast   = '';
  regEmail  = '';
  regMobile = '';

  /* OTP */
  showOtpModal = signal(false);
  currentOtp   = signal('');
  otpDigits: string[] = ['', '', '', '', '', ''];
  readonly otpIndexes = [0, 1, 2, 3, 4, 5];

  tabs: { id: Tab; label: string }[] = [
    { id: 'citizen',  label: '👤 Citizen Login' },
    { id: 'admin',    label: '🛡 Admin Login' },
    { id: 'register', label: '✨ New User' },
  ];

  activeTabCls   = 'flex-1 py-3.5 text-xs font-bold text-navy border-b-4 border-saffron bg-orange-50/40 transition-all cursor-pointer bg-transparent';
  inactiveTabCls = 'flex-1 py-3.5 text-xs font-medium text-gray-400 border-b-4 border-transparent hover:text-navy transition-all cursor-pointer bg-transparent';

  /* ── Login handlers ────────────────────────────────── */
  doCitizenLogin(): void {
    if (!this.citizenMobile || !this.citizenPass) {
      this.notif.error('Please enter your mobile number and password.'); return;
    }
    const ok = this.auth.loginCitizen(this.citizenMobile.trim(), this.citizenPass);
    if (!ok) {
      this.notif.error('Invalid credentials. Try 9876543210 / citizen123');
    } else {
      this.notif.success('Welcome back!');
    }
  }

  doAdminLogin(): void {
    if (!this.adminId || !this.adminPass) {
      this.notif.error('Please enter employee ID and password.'); return;
    }
    const ok = this.auth.loginAdmin(this.adminId.trim(), this.adminPass);
    if (!ok) {
      this.notif.error('Invalid admin credentials.');
    } else {
      this.notif.success('Admin logged in successfully.');
    }
  }

  doRegister(): void {
    if (!this.regFirst || !this.regLast || !this.regEmail || !this.regMobile) {
      this.notif.error('Please fill all fields.'); return;
    }
    if (!/^\d{10}$/.test(this.regMobile)) {
      this.notif.error('Enter a valid 10-digit mobile number.'); return;
    }
    if (this.auth.mobileExists(this.regMobile)) {
      this.notif.error('Mobile already registered. Please login.'); return;
    }
    const otp = this.auth.generateOtp();
    this.currentOtp.set(otp);
    this.otpDigits = ['', '', '', '', '', ''];
    this.showOtpModal.set(true);
  }

  /* ── OTP handlers ──────────────────────────────────── */
  onOtpInput(index: number): void {
    // Keep only numeric, single digit
    const raw = this.otpDigits[index].replace(/\D/g, '');
    this.otpDigits[index] = raw ? raw.charAt(raw.length - 1) : '';
    if (this.otpDigits[index] && index < 5) {
      setTimeout(() => {
        const el = document.getElementById(`otp_${index + 1}`) as HTMLInputElement | null;
        el?.focus();
      }, 0);
    }
  }

  onOtpKeydown(index: number, event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      setTimeout(() => {
        const el = document.getElementById(`otp_${index - 1}`) as HTMLInputElement | null;
        el?.focus();
      }, 0);
    }
  }

  verifyOtp(): void {
    const entered = this.otpDigits.join('');
    if (entered.length < 6) {
      this.notif.error('Please enter all 6 digits.'); return;
    }
    if (entered !== this.currentOtp()) {
      this.notif.error('Incorrect OTP. Please try again.'); return;
    }
    const user = this.auth.registerUser(
      this.regFirst.trim(),
      this.regLast.trim(),
      this.regEmail.trim(),
      this.regMobile.trim()
    );
    this.showOtpModal.set(false);
    this.notif.success(`🎉 Registration successful! Welcome, ${user.firstName}!`);
    setTimeout(() => {
      this.notif.info(`Your default password: last 4 digits of mobile (${user.password})`);
    }, 900);
  }

  resendOtp(): void {
    const otp = this.auth.generateOtp();
    this.currentOtp.set(otp);
    this.otpDigits = ['', '', '', '', '', ''];
    this.notif.info('A new OTP has been generated!');
  }

  closeOtpOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showOtpModal.set(false);
    }
  }
}
