import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-instructions',
  imports: [DialogModule, ButtonModule],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.css',
})
export class InstructionsComponent {
  visible: boolean = true;
  @Output() startQuizEvent = new EventEmitter<void>();

  startQuiz(): void {
    this.visible = false;
    this.startQuizEvent.emit();
  }
}
