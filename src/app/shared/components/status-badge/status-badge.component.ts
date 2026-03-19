import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueStatus } from '../../models/index';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span [class]="badgeClass">{{ dot }} {{ label }}</span>`,
})
export class StatusBadgeComponent {
  @Input() status: IssueStatus = 'applied';

  get badgeClass(): string {
    const map: Record<IssueStatus, string> = {
      applied:   'badge badge-applied',
      pending:   'badge badge-pending',
      working:   'badge badge-working',
      verify:    'badge badge-verify',
      completed: 'badge badge-completed',
    };
    return map[this.status];
  }

  get label(): string {
    return {
      applied:   'Applied',
      pending:   'Pending',
      working:   'Working',
      verify:    'Need Verification',
      completed: 'Completed',
    }[this.status];
  }

  get dot(): string {
    return { applied:'🔵', pending:'🟠', working:'🟣', verify:'🔴', completed:'🟢' }[this.status];
  }
}
