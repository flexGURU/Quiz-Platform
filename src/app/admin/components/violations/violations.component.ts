import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-violations',
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    TableModule,
    TagModule,
    AvatarModule,
    CardModule,
    DropdownModule,
    TimelineModule, 
    ButtonModule
  ],
  templateUrl: './violations.component.html',
  styleUrl: './violations.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ViolationsComponent {
  // Reports listing
  reports: any[] = [];
  reportSearchTerm: string = '';
  selectedStatus: string = 'pending';
  reportStatusOptions: any[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'All', value: 'all' },
  ];

  // Selected report
  selectedReport: any = null;

  // Action options
  selectedAction: string = 'dismiss';
  actionOptions: any[] = [
    { label: 'Dismiss', value: 'dismiss' },
    { label: 'Warn User', value: 'warn' },
    { label: 'Temporarily Ban', value: 'temporarily-ban' },
    { label: 'Permanently Ban', value: 'permanently-ban' },
  ];

  // Ban duration options
  selectedBanDuration: string = '24h';
  banDurationOptions: any[] = [
    { label: '24 Hours', value: '24h' },
    { label: '3 Days', value: '3d' },
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
  ];

  // Action comment
  actionComment: string = '';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    // Sample report data
    this.reports = [
      {
        id: 1,
        type: 'Inappropriate Content',
        reporter: 'Alice Johnson',
        reporterAvatar: 'https://via.placeholder.com/150',
        reportedUser: 'John Doe',
        reportedUserAvatar: 'https://via.placeholder.com/150',
        status: 'pending',
        date: new Date(2025, 2, 22, 14, 30), // March 22, 2025, 2:30 PM
        reason:
          'This user posted content that violates community guidelines regarding appropriate classroom discussion topics.',
        evidenceType: 'text',
        evidenceText:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        history: [],
      },
      {
        id: 2,
        type: 'Harassment',
        reporter: 'Bob Smith',
        reporterAvatar: 'https://via.placeholder.com/150',
        reportedUser: 'Jane Williams',
        reportedUserAvatar: 'https://via.placeholder.com/150',
        status: 'pending',
        date: new Date(2025, 2, 21, 10, 15), // March 21, 2025, 10:15 AM
        reason:
          'This user has been repeatedly sending harassing messages to other students in the class chat.',
        evidenceType: 'screenshot',
        evidenceImage: 'https://via.placeholder.com/800x400',
        history: [],
      },
      {
        id: 3,
        type: 'Cheating',
        reporter: 'David Brown',
        reporterAvatar: 'https://via.placeholder.com/150',
        reportedUser: 'Michael Wilson',
        reportedUserAvatar: 'https://via.placeholder.com/150',
        status: 'pending',
        date: new Date(2025, 2, 20, 9, 45), // March 20, 2025, 9:45 AM
        reason:
          'I believe this student has been sharing answers during online exams based on the similarity of responses.',
        evidenceType: 'text',
        evidenceText:
          'The answers submitted by this student are identical to three other students, including the same unusual phrasing and even the same typographical errors.',
        history: [],
      },
      {
        id: 4,
        type: 'Inappropriate Content',
        reporter: 'Eva Davis',
        reporterAvatar: 'https://via.placeholder.com/150',
        reportedUser: 'Sarah Taylor',
        reportedUserAvatar: 'https://via.placeholder.com/150',
        status: 'resolved',
        date: new Date(2025, 2, 18, 13, 20), // March 18, 2025, 1:20 PM
        reason:
          "This user posted inappropriate content in the discussion forum that doesn't align with our community standards.",
        evidenceType: 'screenshot',
        evidenceImage: 'https://via.placeholder.com/800x400',
        history: [
          {
            action: 'Report Received',
            by: 'System',
            date: new Date(2025, 2, 18, 13, 20), // March 18, 2025, 1:20 PM
            comment: 'Automatic ticket created',
          },
          {
            action: 'Warning Issued',
            by: 'Admin',
            date: new Date(2025, 2, 19, 10, 30), // March 19, 2025, 10:30 AM
            comment:
              'First-time offense. User has been warned about community guidelines.',
          },
          {
            action: 'Report Resolved',
            by: 'Admin',
            date: new Date(2025, 2, 19, 10, 35), // March 19, 2025, 10:35 AM
            comment: 'Content removed and user notified',
          },
        ],
      },
    ];
  }

  getTagSeverity(type: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (type) {
      case 'Harassment':
        return 'danger';
      case 'Inappropriate Content':
        return 'warn';
      case 'Cheating':
        return 'info';
      default:
        return 'info';
    }
  }
  

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (status) {
      case 'pending':
        return 'warn';
      case 'resolved':
        return 'success';
      default:
        return 'info';
    }
  }

  selectReport(report: any) {
    this.selectedReport = report;
    this.selectedAction = 'dismiss';
    this.actionComment = '';
  }

  cancelAction() {
    this.selectedReport = null;
  }

  resolveReport() {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${this.getActionText()} ${
        this.selectedReport.reportedUser
      }?`,
      header: 'Confirm Action',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Add to history
        const now = new Date();
        this.selectedReport.history.push({
          action: this.getActionText(),
          by: 'Admin',
          date: now,
          comment: this.actionComment,
        });

        // Update status
        this.selectedReport.status = 'resolved';

        // Show message
        this.messageService.add({
          severity: 'success',
          summary: 'Report Resolved',
          detail: `Action taken: ${this.getActionText()}`,
        });

        // Reset selection
        this.selectedReport = null;
      },
    });
  }

  getActionText(): string {
    switch (this.selectedAction) {
      case 'dismiss':
        return 'Dismiss Report';
      case 'warn':
        return 'Warn User';
      case 'temporarily-ban':
        const duration = this.banDurationOptions.find(
          (o) => o.value === this.selectedBanDuration
        )?.label;
        return `Temporarily Ban User (${duration})`;
      case 'permanently-ban':
        return 'Permanently Ban User';
      default:
        return 'Take Action';
    }
  }
}
