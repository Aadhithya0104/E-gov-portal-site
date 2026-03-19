import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IssueService } from '../../../core/services/issue.service';
import { NotificationService } from '../../../core/services/notification.service';
import { GOV_SERVICES, DISTRICTS } from '../../../shared/models/index';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <a routerLink="../overview" class="hover:text-navy cursor-pointer" (click)="router.navigate(['/dashboard/overview'])">Dashboard</a>
        <span>›</span><span class="text-navy font-semibold">New Application</span>
      </nav>

      <div class="card">
        <div class="border-b border-gray-100 px-8 py-5">
          <h3 class="font-serif text-xl font-bold text-navy">📝 Submit New Application / Grievance</h3>
          <p class="text-sm text-gray-400 mt-1">
            Fill the form below. Attach supporting documents as PDF. You will receive updates on your registered mobile.
          </p>
        </div>

        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Service Category -->
            <div>
              <label class="form-label">Service Category *</label>
              <select [(ngModel)]="form.service" (ngModelChange)="onServiceChange()" class="form-select">
                <option value="">Select a service</option>
                @for (svc of services; track svc.id) {
                  <option [value]="svc.title">{{ svc.icon }} {{ svc.title }}</option>
                }
              </select>
            </div>

            <!-- Sub Service -->
            <div>
              <label class="form-label">Request Type *</label>
              <select [(ngModel)]="form.type" class="form-select" [disabled]="!form.service">
                <option value="">Select category first</option>
                @for (sub of subServices; track sub) {
                  <option [value]="sub">{{ sub }}</option>
                }
              </select>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label class="form-label">Issue Description *</label>
              <textarea [(ngModel)]="form.description" class="form-input resize-none" rows="4"
                        placeholder="Describe your issue or request in detail..."></textarea>
            </div>

            <!-- Applicant Name -->
            <div>
              <label class="form-label">Applicant Name *</label>
              <input type="text" [(ngModel)]="form.userName" class="form-input"
                     placeholder="Full name as per records">
            </div>

            <!-- Aadhaar -->
            <div>
              <label class="form-label">Aadhaar Number</label>
              <input type="text" [(ngModel)]="form.aadhaar" class="form-input"
                     placeholder="12-digit Aadhaar number" maxlength="14">
            </div>

            <!-- Mobile -->
            <div>
              <label class="form-label">Mobile Number *</label>
              <input type="tel" [(ngModel)]="form.userMobile" class="form-input"
                     placeholder="Registered mobile number" maxlength="10">
            </div>

            <!-- District -->
            <div>
              <label class="form-label">District *</label>
              <select [(ngModel)]="form.district" class="form-select">
                <option value="">Select district</option>
                @for (d of districts; track d) {
                  <option [value]="d">{{ d }}</option>
                }
              </select>
            </div>

            <!-- File Upload -->
            <div class="md:col-span-2">
              <label class="form-label">Upload Supporting Document (PDF) *</label>
              <div class="upload-zone" (click)="fileInput.click()">
                @if (!uploadedFile()) {
                  <div class="text-4xl mb-3">📁</div>
                  <p class="text-sm text-gray-500"><strong class="text-navy">Click to upload</strong> or drag & drop</p>
                  <p class="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
                } @else {
                  <div class="flex items-center gap-3 justify-center bg-green-50 rounded-lg px-4 py-3">
                    <span class="text-2xl">📄</span>
                    <span class="text-sm font-semibold text-green-700">{{ uploadedFile()?.name }}</span>
                    <span class="text-xs text-gray-400">({{ (uploadedFile()!.size / 1024).toFixed(1) }} KB)</span>
                    <button (click)="clearFile($event)" class="text-red-400 hover:text-red-600 ml-2 text-lg">✕</button>
                  </div>
                }
              </div>
              <input #fileInput type="file" accept=".pdf" class="hidden" (change)="onFileChange($event)">
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button (click)="router.navigate(['/dashboard/overview'])" class="btn btn-navy">Cancel</button>
            <button (click)="submit()" [disabled]="submitting()" class="btn btn-primary">
              @if (submitting()) { ⏳ Submitting... } @else { Submit Application → }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ApplyComponent {
  auth         = inject(AuthService);
  issueService = inject(IssueService);
  notif        = inject(NotificationService);
  router       = inject(Router);

  services   = GOV_SERVICES;
  districts  = DISTRICTS;
  subServices: string[] = [];

  submitting   = signal(false);
  uploadedFile = signal<File | null>(null);

  form = {
    service: '', type: '', description: '',
    userName: '', aadhaar: '', userMobile: '', district: '',
  };

  ngOnInit(): void {
    const u = this.auth.currentUser();
    if (u) {
      this.form.userName   = `${u.firstName} ${u.lastName}`;
      this.form.userMobile = u.mobile;
    }
  }

  onServiceChange(): void {
    this.form.type = '';
    const svc = this.services.find(s => s.title === this.form.service);
    this.subServices = svc?.subServices ?? [];
  }

  onFileChange(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.pdf')) { this.notif.error('Only PDF files are allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { this.notif.error('File size must be under 5MB.'); return; }
    this.uploadedFile.set(file);
  }

  clearFile(e: Event): void {
    e.stopPropagation();
    this.uploadedFile.set(null);
  }

  submit(): void {
    const { service, type, description, userName, userMobile, district } = this.form;
    if (!service || !type || !description || !userName || !userMobile || !district) {
      this.notif.error('Please fill all required fields.'); return;
    }
    if (!this.uploadedFile()) {
      this.notif.error('Please upload a supporting document.'); return;
    }
    this.submitting.set(true);
    setTimeout(() => {
      const userId = this.auth.currentUser()!.id;
      const issue = this.issueService.submit({
        userId,
        userName,
        userMobile,
        service,
        type,
        description,
        district,
        aadhaar: this.form.aadhaar,
        fileName: this.uploadedFile()!.name,
      });
      this.submitting.set(false);
      this.notif.success(`✅ Application ${issue.appId} submitted successfully!`);
      this.router.navigate(['/dashboard/my-issues']);
    }, 800);
  }
}
