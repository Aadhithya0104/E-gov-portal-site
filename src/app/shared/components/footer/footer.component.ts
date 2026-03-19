import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-navy text-white/60 mt-auto">
      <div class="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h5 class="text-white text-sm font-semibold mb-3">Tamil Nadu E-Governance</h5>
            <p class="text-xs leading-loose">Secretariat, Fort St. George<br>Chennai - 600 009<br>Tamil Nadu, India</p>
          </div>
          <div>
            <h5 class="text-white text-sm font-semibold mb-3">Quick Links</h5>
            <div class="flex flex-col gap-1 text-xs leading-loose">
              <a href="#" class="hover:text-saffron-light transition-colors">TN Government Portal</a>
              <a href="#" class="hover:text-saffron-light transition-colors">TNPSC</a>
              <a href="#" class="hover:text-saffron-light transition-colors">Digital India</a>
              <a href="#" class="hover:text-saffron-light transition-colors">MyGov</a>
            </div>
          </div>
          <div>
            <h5 class="text-white text-sm font-semibold mb-3">Help & Support</h5>
            <div class="flex flex-col gap-1 text-xs leading-loose">
              <a href="#" class="hover:text-saffron-light transition-colors">User Guide</a>
              <a href="#" class="hover:text-saffron-light transition-colors">FAQs</a>
              <a href="#" class="hover:text-saffron-light transition-colors">Technical Support</a>
              <a href="#" class="hover:text-saffron-light transition-colors">Grievance Cell</a>
            </div>
          </div>
          <div>
            <h5 class="text-white text-sm font-semibold mb-3">Contact</h5>
            <div class="text-xs leading-loose">
              <p>📞 1800-100-4567 (Toll Free)</p>
              <p>✉ helpdesk&#64;tn.gov.in</p>
              <p>⏰ Mon–Sat, 9AM–6PM</p>
            </div>
          </div>
        </div>
        <div class="border-t border-white/10 pt-5 text-center text-xs">
          © {{ year }} Government of Tamil Nadu. All Rights Reserved. &nbsp;|&nbsp; NIC India &nbsp;|&nbsp;
          <a href="#" class="hover:text-saffron-light">Privacy Policy</a> &nbsp;|&nbsp;
          <a href="#" class="hover:text-saffron-light">Disclaimer</a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
