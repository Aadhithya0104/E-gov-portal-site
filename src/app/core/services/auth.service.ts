import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/index';

const TOKEN_KEY = 'egov_token';
const USER_KEY  = 'egov_user';

// Seed demo users
const DEMO_USERS: User[] = [
  {
    id: 'TN-CIT-9876',
    firstName: 'Rajesh', lastName: 'Kumar',
    email: 'rajesh@email.com', mobile: '9876543210',
    password: 'citizen123', role: 'citizen', verified: true,
    createdAt: '2025-01-10',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _users = signal<User[]>(this.loadUsers());
  private _currentUser = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly currentUser      = computed(() => this._currentUser());
  readonly isAuthenticated  = computed(() => !!this._token());
  readonly isAdmin          = computed(() => this._currentUser()?.role === 'admin');
  readonly isCitizen        = computed(() => this._currentUser()?.role === 'citizen');

  private usedOtps = new Set<string>();

  constructor(private router: Router) {}

  // ── Citizen Login ────────────────────────────────────────────
  loginCitizen(mobile: string, password: string): boolean {
    const user = this._users().find(u => u.mobile === mobile && u.password === password && u.role === 'citizen');
    if (!user) return false;
    this.setSession(user);
    this.router.navigate(['/dashboard']);
    return true;
  }

  // ── Admin Login ──────────────────────────────────────────────
  loginAdmin(employeeId: string, password: string): boolean {
    if (employeeId === 'TN-ADMIN-001' && password === 'admin@2025') {
      const adminUser: User = {
        id: 'TN-ADMIN-001', firstName: 'Admin', lastName: 'Officer',
        email: 'admin@tn.gov.in', mobile: '0000000000',
        password: '', role: 'admin', verified: true, createdAt: '2024-01-01',
      };
      this.setSession(adminUser);
      this.router.navigate(['/admin']);
      return true;
    }
    return false;
  }

  // ── OTP ──────────────────────────────────────────────────────
  generateOtp(): string {
    let otp: string;
    do { otp = Math.floor(100000 + Math.random() * 900000).toString(); }
    while (this.usedOtps.has(otp));
    this.usedOtps.add(otp);
    return otp;
  }

  mobileExists(mobile: string): boolean {
    return this._users().some(u => u.mobile === mobile);
  }

  // ── Register ─────────────────────────────────────────────────
  registerUser(firstName: string, lastName: string, email: string, mobile: string): User {
    const newUser: User = {
      id: 'TN-CIT-' + Math.floor(1000 + Math.random() * 9000),
      firstName, lastName, email, mobile,
      password: mobile.slice(-4),
      role: 'citizen', verified: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this._users.update(u => [...u, newUser]);
    this.saveUsers(this._users());
    this.setSession(newUser);
    return newUser;
  }

  // ── Logout ───────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
    this._token.set(null);
    this.router.navigate(['/']);
  }

  // ── Private helpers ──────────────────────────────────────────
  private setSession(user: User): void {
    const token = btoa(user.id + ':' + Date.now());
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
    this._token.set(token);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  private loadUsers(): User[] {
    const raw = localStorage.getItem('egov_users');
    if (!raw) {
      localStorage.setItem('egov_users', JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    const stored: User[] = JSON.parse(raw);
    // Merge so demo user is always present
    const hasDemoUser = stored.some(u => u.mobile === '9876543210');
    return hasDemoUser ? stored : [...DEMO_USERS, ...stored];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem('egov_users', JSON.stringify(users));
  }
}
