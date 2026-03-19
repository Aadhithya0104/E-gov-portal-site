import { Injectable, signal, computed } from '@angular/core';
import { Issue, IssueStatus, TimelineEntry } from '../../shared/models/index';

const ISSUES_KEY = 'egov_issues';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private _issues = signal<Issue[]>(this.loadIssues());
  private counter = this.loadCounter();

  readonly allIssues = computed(() => this._issues());

  // ── For a specific user ──────────────────────────────────────
  forUser(userId: string) {
    return computed(() => this._issues().filter(i => i.userId === userId));
  }

  getById(id: number): Issue | undefined {
    return this._issues().find(i => i.id === id);
  }

  // ── Submit new issue ─────────────────────────────────────────
  submit(data: Omit<Issue, 'id' | 'appId' | 'status' | 'adminNote' | 'submittedAt' | 'updatedAt' | 'timeline'>): Issue {
    this.counter++;
    const now = new Date().toLocaleString('en-IN');
    const issue: Issue = {
      ...data,
      id: this.counter,
      appId: `TN-${this.counter}-${new Date().getFullYear()}`,
      status: 'applied',
      adminNote: '',
      submittedAt: now,
      updatedAt: now,
      timeline: [{ time: now, message: 'Application submitted successfully.', actor: 'citizen' }],
    };
    this._issues.update(list => [issue, ...list]);
    this.persist();
    return issue;
  }

  // ── Admin: update status + note ───────────────────────────────
  updateByAdmin(id: number, status: IssueStatus, note: string): void {
    const now = new Date().toLocaleString('en-IN');
    this._issues.update(list =>
      list.map(i => {
        if (i.id !== id) return i;
        const entry: TimelineEntry = {
          time: now,
          message: `Status changed to "${statusLabel(status)}"${note ? `. Admin: ${note}` : ''}`,
          actor: 'admin',
        };
        return { ...i, status, adminNote: note, updatedAt: now, timeline: [...i.timeline, entry] };
      })
    );
    this.persist();
  }

  // ── Counts helpers ────────────────────────────────────────────
  countsByUser(userId: string) {
    const mine = this._issues().filter(i => i.userId === userId);
    return {
      total:     mine.length,
      applied:   mine.filter(i => i.status === 'applied').length,
      pending:   mine.filter(i => i.status === 'pending').length,
      working:   mine.filter(i => i.status === 'working').length,
      verify:    mine.filter(i => i.status === 'verify').length,
      completed: mine.filter(i => i.status === 'completed').length,
      inProgress: mine.filter(i => ['working','verify','pending'].includes(i.status)).length,
    };
  }

  countAll() {
    const all = this._issues();
    return {
      total:     all.length,
      applied:   all.filter(i => i.status === 'applied').length,
      pending:   all.filter(i => i.status === 'pending').length,
      working:   all.filter(i => i.status === 'working').length,
      verify:    all.filter(i => i.status === 'verify').length,
      completed: all.filter(i => i.status === 'completed').length,
    };
  }

  // ── Persist ───────────────────────────────────────────────────
  private persist(): void {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(this._issues()));
    localStorage.setItem('egov_issue_counter', String(this.counter));
  }

  private loadIssues(): Issue[] {
    const raw = localStorage.getItem(ISSUES_KEY);
    if (!raw) return this.seedDemoIssues();
    return JSON.parse(raw);
  }

  private loadCounter(): number {
    return parseInt(localStorage.getItem('egov_issue_counter') || '2000', 10);
  }

  private seedDemoIssues(): Issue[] {
    const demo: Issue[] = [
      {
        id: 2001, appId: 'TN-2001-2025',
        userId: 'TN-CIT-9876', userName: 'Rajesh Kumar', userMobile: '9876543210',
        service: 'Aadhaar', type: 'Name Change',
        description: 'My name is misspelled on my Aadhaar card. Need correction from "Rajesh Cumar" to "Rajesh Kumar".',
        district: 'Chennai', aadhaar: '9876-5432-1098', fileName: 'aadhaar_docs.pdf',
        status: 'working', adminNote: 'Documents verified. Name correction is being processed. Expected completion in 3-5 business days.',
        submittedAt: '15/03/2025, 10:30 AM', updatedAt: '18/03/2025, 11:00 AM',
        timeline: [
          { time: '15/03/2025, 10:30 AM', message: 'Application submitted successfully.', actor: 'citizen' },
          { time: '16/03/2025, 2:15 PM',  message: 'Documents verified. Status updated to Working.', actor: 'admin' },
          { time: '18/03/2025, 11:00 AM', message: 'Admin: Documents verified. Name correction is being processed.', actor: 'admin' },
        ],
      },
      {
        id: 2002, appId: 'TN-2002-2025',
        userId: 'TN-CIT-9876', userName: 'Rajesh Kumar', userMobile: '9876543210',
        service: 'Ration Card', type: 'Member Addition',
        description: 'Need to add my newborn child to the family ration card.',
        district: 'Chennai', fileName: 'birth_certificate.pdf',
        status: 'completed', adminNote: 'Member has been added to the ration card. You may collect the updated card from your nearby ration shop.',
        submittedAt: '01/02/2025, 09:00 AM', updatedAt: '10/02/2025, 04:00 PM',
        timeline: [
          { time: '01/02/2025, 09:00 AM', message: 'Application submitted successfully.', actor: 'citizen' },
          { time: '05/02/2025, 10:30 AM', message: 'Under verification.', actor: 'admin' },
          { time: '10/02/2025, 04:00 PM', message: 'Completed. Member added to ration card.', actor: 'admin' },
        ],
      },
    ];
    localStorage.setItem(ISSUES_KEY, JSON.stringify(demo));
    localStorage.setItem('egov_issue_counter', '2002');
    this.counter = 2002;
    return demo;
  }
}

export function statusLabel(s: IssueStatus): string {
  return { applied:'Applied', pending:'Pending', working:'Working', verify:'Need Verification', completed:'Completed' }[s] ?? s;
}
