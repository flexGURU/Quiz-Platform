import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { Violation } from './types';

@Directive({
  selector: '[appViolation]',
})
export class ViolationDirective {
  @Output() quizViolation = new EventEmitter<Violation>();

  constructor() {}

  private recordViolation(violation: Violation) {
    this.quizViolation.emit({
      type: violation.type,
      timestamp: new Date(),
    });
  }

  @HostListener('window:blur', ['$event'])
  onCopy(): void {
    this.recordViolation({ type: 'User switched tab' });
  }

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event) {
    if (document.hidden) {
      this.recordViolation({ type: 'Switched to another tab' });
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check for Ctrl+C (Windows/Linux) or Cmd+C (Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      this.recordViolation({ type: 'Attempted to copy content' });
      event.preventDefault(); // Optional: prevent the copy action
    }
  }
}
