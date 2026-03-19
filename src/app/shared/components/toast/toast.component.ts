import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
      @for (toast of notif.toasts(); track toast.id) {
        <div [class]="toastClass(toast.type)"
             style="animation: slideInRight 0.3s ease">
          <span class="text-lg">{{ icon(toast.type) }}</span>
          <span class="flex-1 text-sm font-medium text-gray-800">{{ toast.message }}</span>
          <button (click)="notif.remove(toast.id)"
                  class="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  notif = inject(NotificationService);

  toastClass(type: string) {
    const base = 'flex items-center gap-3 bg-white rounded-xl shadow-2xl px-5 py-4 min-w-[300px] max-w-sm border-l-4';
    const map: Record<string, string> = {
      success: `${base} border-green-500`,
      error:   `${base} border-red-500`,
      info:    `${base} border-blue-500`,
    };
    return map[type] ?? base;
  }

  icon(type: string) {
    return { success: '✅', error: '❌', info: 'ℹ️' }[type] ?? '🔔';
  }
}
