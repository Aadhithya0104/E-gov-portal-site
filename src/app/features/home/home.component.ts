import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { GOV_SERVICES } from '../../shared/models/index';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header />

    <!-- HERO -->
    <section class="relative bg-gradient-to-br from-navy via-navy-mid to-[#1a4a8a] py-20 px-6 text-white overflow-hidden">
      <div class="absolute inset-0 opacity-[0.04]"
           style="background-image:url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=%23fff fill-opacity=1%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/svg%3E')">
      </div>
      <div class="relative max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 bg-saffron/15 border border-saffron/40 text-saffron-light
                    px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          🌐 Digital Tamil Nadu Initiative
        </div>
        <h1 class="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5">
          One Portal for <span class="text-saffron-light">All Government</span><br>Services & Grievances
        </h1>
        <p class="text-white/70 text-lg max-w-xl mx-auto mb-10">
          Apply for documents, raise issues, track status — all from the comfort of your home.
          Fast. Transparent. Digital.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <a routerLink="/auth/login" class="btn btn-primary btn-lg">🚀 Access Services</a>
          <a routerLink="/auth/login" class="btn btn-outline btn-lg">📋 Track My Application</a>
        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5">
        @for (s of stats; track s.label) {
          <div class="text-center px-6 py-5 border-r border-gray-100 last:border-0">
            <div class="font-serif text-2xl font-bold text-navy">{{ s.value }}</div>
            <div class="text-xs text-gray-400 uppercase tracking-wide mt-1">{{ s.label }}</div>
          </div>
        }
      </div>
    </div>

    <!-- SERVICES GRID -->
    <section class="max-w-7xl mx-auto px-6 py-16">
      <h2 class="font-serif text-2xl font-bold text-navy">Government Services</h2>
      <p class="text-gray-400 text-sm mt-1 mb-3">Click any service to apply or raise an issue</p>
      <div class="w-12 h-1 bg-saffron rounded-full mb-8"></div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        @for (svc of services; track svc.id) {
          <a routerLink="/auth/login"
             class="group bg-white border border-gray-100 rounded-xl p-5 text-center cursor-pointer
                    hover:border-saffron hover:shadow-md hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl"
                 [style.background]="svc.color">{{ svc.icon }}</div>
            <h4 class="text-xs font-bold text-navy leading-tight">{{ svc.title }}</h4>
            <p class="text-[11px] text-gray-400 mt-1 leading-snug">{{ svc.description }}</p>
          </a>
        }
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="bg-navy/5 py-16 px-6">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="font-serif text-2xl font-bold text-navy mb-2">How It Works</h2>
        <div class="w-12 h-1 bg-saffron rounded-full mx-auto mb-10"></div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          @for (step of steps; track step.n) {
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="w-10 h-10 rounded-full bg-navy text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {{ step.n }}
              </div>
              <div class="text-2xl mb-2">{{ step.icon }}</div>
              <h4 class="font-semibold text-navy text-sm mb-1">{{ step.title }}</h4>
              <p class="text-xs text-gray-400 leading-relaxed">{{ step.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <app-footer />
  `,
})
export class HomeComponent {
  services = GOV_SERVICES;

  stats = [
    { value: '2.4M+',   label: 'Citizens Registered' },
    { value: '18',      label: 'Government Services' },
    { value: '98.2%',   label: 'Resolution Rate' },
    { value: '4.8 ★',  label: 'Citizen Rating' },
    { value: '3.2 Days',label: 'Avg Resolution Time' },
  ];

  steps = [
    { n: '1', icon: '🔐', title: 'Register / Login',   desc: 'Create an account with mobile OTP or login with your credentials.' },
    { n: '2', icon: '📝', title: 'Select & Apply',     desc: 'Choose the government service and fill the application form.' },
    { n: '3', icon: '📁', title: 'Upload Documents',   desc: 'Attach supporting PDF documents for verification.' },
    { n: '4', icon: '📊', title: 'Track Status',       desc: 'Receive real-time updates and admin messages on your dashboard.' },
  ];
}
