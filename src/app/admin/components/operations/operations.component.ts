import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ColorPickerModule } from 'primeng/colorpicker';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-operations',
  imports: [
    TabViewModule,
    ProgressSpinnerModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TagModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    TableModule,
    AvatarModule,
    ColorPickerModule, 
    PasswordModule,
    CheckboxModule,
    InputNumberModule,
    TableModule,
    InputSwitchModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css',
})
export class OperationsComponent {
  cpuData: any;
  memoryData: any;
  chartOptions: any;
  dbStatus = {
    connected: true,
    lastBackup: new Date(2025, 2, 20, 8, 30), // March 20, 2025, 8:30 AM
    backupSize: '246.5 MB',
  };

  // User Management
  users: any[] = [];
  userSearchTerm: string = '';
  selectedUserType: string = '';
  userTypeOptions: any[] = [
    { label: 'All Users', value: '' },
    { label: 'Students', value: 'student' },
    { label: 'Teachers', value: 'teacher' },
  ];
  totalStudents: number = 0;
  totalTeachers: number = 0;
  totalActive: number = 0;

  // Backup & Restore
  backups: any[] = [];
  backupInProgress: boolean = false;

  // Settings
  themes: any[] = [
    { id: 'light', name: 'Light Theme', primaryColor: '#4F46E5' },
    { id: 'dark', name: 'Dark Theme', primaryColor: '#1F2937' },
    { id: 'colorful', name: 'Colorful', primaryColor: '#06B6D4' },
  ];
  selectedTheme: string = 'light';
  customTheme = {
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
  };
  emailSettings = {
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    username: 'notifications@example.com',
    password: '',
    fromEmail: 'no-reply@example.com',
    enableSSL: true,
  };

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initChartData();
    this.loadUsers();
    this.loadBackups();
  }

  initChartData() {
    // Generate sample CPU data
    this.cpuData = {
      labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
      datasets: [
        {
          label: 'CPU Usage',
          data: [25, 30, 45, 65, 52, 38],
          fill: true,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          tension: 0.4,
        },
      ],
    };

    // Generate sample Memory data
    this.memoryData = {
      labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
      datasets: [
        {
          label: 'Memory Usage',
          data: [42, 45, 60, 75, 68, 55],
          fill: true,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          tension: 0.4,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value: any) {
              return value + '%';
            },
          },
        },
      },
    };
  }

  loadUsers() {
    // Sample user data
    this.users = [
      {
        id: 1,
        name: 'Alice Johnson',
        role: 'Student',
        active: true,
        avatar: 'https://via.placeholder.com/150',
      },
      {
        id: 2,
        name: 'Bob Smith',
        role: 'Student',
        active: true,
        avatar: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        name: 'Carol Williams',
        role: 'Teacher',
        active: true,
        avatar: 'https://via.placeholder.com/150',
      },
      {
        id: 4,
        name: 'David Brown',
        role: 'Student',
        active: false,
        avatar: 'https://via.placeholder.com/150',
      },
      {
        id: 5,
        name: 'Eva Davis',
        role: 'Teacher',
        active: true,
        avatar: 'https://via.placeholder.com/150',
      },
    ];

    // Calculate totals
    this.totalStudents = this.users.filter((u) => u.role === 'Student').length;
    this.totalTeachers = this.users.filter((u) => u.role === 'Teacher').length;
    this.totalActive = this.users.filter((u) => u.active).length;
  }

  loadBackups() {
    // Sample backup data
    this.backups = [
      {
        id: 1,
        date: new Date(2025, 2, 20, 8, 30), // March 20, 2025, 8:30 AM
        size: '246.5 MB',
      },
      {
        id: 2,
        date: new Date(2025, 2, 15, 9, 0), // March 15, 2025, 9:00 AM
        size: '240.2 MB',
      },
      {
        id: 3,
        date: new Date(2025, 2, 10, 8, 45), // March 10, 2025, 8:45 AM
        size: '235.8 MB',
      },
    ];
  }

  toggleUserStatus(user: any) {
    // In a real app, call API to update user status
    this.messageService.add({
      severity: user.active ? 'success' : 'info',
      summary: 'User Status Updated',
      detail: `${user.name} has been ${
        user.active ? 'activated' : 'deactivated'
      }`,
    });
    this.totalActive = this.users.filter((u) => u.active).length;
  }

  createBackup() {
    this.backupInProgress = true;
    // Simulate backup creation
    setTimeout(() => {
      const newBackup = {
        id: this.backups.length + 1,
        date: new Date(),
        size: '248.0 MB',
      };
      this.backups.unshift(newBackup);
      this.backupInProgress = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Backup Created',
        detail: `Backup created successfully (${newBackup.size})`,
      });
    }, 2000);
  }

  downloadBackup(backup: any) {
    // In a real app, trigger file download
    this.messageService.add({
      severity: 'info',
      summary: 'Download Started',
      detail: `Downloading backup from ${backup.date.toLocaleString()}`,
    });
  }

  confirmRestore(backup: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to restore the backup from ${backup.date.toLocaleString()}? This will replace all current data.`,
      header: 'Confirm Restore',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Simulate restore operation
        setTimeout(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Restore Complete',
            detail: 'System has been restored to previous state',
          });
        }, 2000);
      },
    });
  }

  selectTheme(themeId: string) {
    this.selectedTheme = themeId;
    // In a real app, apply theme
  }

  testEmailConnection() {
    // Simulate email connection test
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Connection Successful',
        detail: 'Email configuration is working correctly',
      });
    }, 1500);
  }

  saveChanges() {
    // Simulate saving configurations
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Changes Saved',
        detail: 'Platform configurations have been updated',
      });
    }, 1000);
  }
}
