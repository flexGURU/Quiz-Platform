import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-report',
  imports: [
    ButtonModule,
    CardModule,
    ProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  providers: [MessageService],
})
export class ReportComponent {
  reportForm: FormGroup;
  contentType: string = '';
  threadId: number = 0;
  answerId?: number;
  contentTitle: string = '';
  contentAuthor: string = '';
  contentPreview: string = '';
  contentLoaded: boolean = false;
  submitting: boolean = false;
  showMessage: string = ''; // Used to show messages in UI

  reasonOptions = [
    { label: 'Inappropriate content', value: 'inappropriate' },
    { label: 'Spam', value: 'spam' },
    { label: 'Harassment or bullying', value: 'harassment' },
    { label: 'Incorrect information', value: 'incorrect' },
    { label: 'Duplicate content', value: 'duplicate' },
    { label: 'Violates community guidelines', value: 'guidelines' },
    { label: 'Other', value: 'other' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reportForm = this.fb.group({
      reason: ['', Validators.required],
      otherReason: [''],
      details: [''],
    });
  }

  ngOnInit() {
    // Mock authentication check (Assume user is logged in)
    const isLoggedIn = true;
    if (!isLoggedIn) {
      this.showMessage = 'Please log in to report content.';
      setTimeout(() => this.router.navigate(['/login']), 2000);
      return;
    }

    // Get query parameters
    this.route.queryParams.subscribe((params) => {
      this.contentType = params['contentType'] || 'thread';
      this.threadId = +params['threadId'] || 1;
      this.answerId = params['answerId'] ? +params['answerId'] : undefined;
      this.loadContentDetails();
    });

    // Add conditional validation for "Other" reason
    this.reportForm.get('reason')?.valueChanges.subscribe((reason) => {
      const otherReasonControl = this.reportForm.get('otherReason');
      if (reason === 'other') {
        otherReasonControl?.setValidators([
          Validators.required,
          Validators.minLength(10),
        ]);
      } else {
        otherReasonControl?.clearValidators();
      }
      otherReasonControl?.updateValueAndValidity();
    });
  }

  loadContentDetails() {
    // Static mock data for thread and answer details
    const threadMockData = {
      title: 'How to optimize Angular performance?',
      author: 'John Smith',
      preview: 'This thread discusses Angular performance optimizations...',
    };

    const answerMockData = {
      threadTitle: 'How to optimize Angular performance?',
      author: 'Alice Brown',
      preview: 'You should use OnPush change detection to improve performance.',
    };

    if (this.contentType === 'thread') {
      this.contentTitle = threadMockData.title;
      this.contentAuthor = threadMockData.author;
      this.contentPreview = threadMockData.preview;
    } else if (this.contentType === 'answer' && this.answerId) {
      this.contentTitle = answerMockData.threadTitle;
      this.contentAuthor = answerMockData.author;
      this.contentPreview = answerMockData.preview;
    }

    this.contentLoaded = true;
  }

  submitReport() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.showMessage = 'Please correct the errors in your form.';
      return;
    }

    this.submitting = true;

    // Simulated report submission (no API call)
    setTimeout(() => {
      this.showMessage =
        'Report submitted successfully. Thank you for keeping our community safe!';
      this.submitting = false;

      // Navigate back after success
      setTimeout(() => this.router.navigate(['/students/forums']), 2000);
    }, 1500);
  }
}
