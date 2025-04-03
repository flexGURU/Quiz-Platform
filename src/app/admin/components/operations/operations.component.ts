import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/models';
import { UserManagementService } from '../../services/user-management.service';
import { response } from 'express';

@Component({
  selector: 'app-operations',
  imports: [
    ButtonModule,
    SelectModule,
    TableModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css',
})
export class OperationsComponent {
  @ViewChild('dt') dt!: Table;
  userForm: FormGroup;
  users!: User[];

  userDialog: boolean = false;
  isNewUser: boolean = false;

  dialogTitle: string = 'Add';

  roleOptions = [
    { label: 'Student', value: 'student' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Admin', value: 'admin' },
  ];

  supaBase = inject(AuthService);
  userService = inject(UserManagementService);

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.nonNullable.group({
      id: [''],
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((response) => {
      this.users = response;
    });
  }
  getErrorMessage(field: string) {}

  showAddUserDialog() {
    this.isNewUser = true;
    this.userDialog = true;
  }

  editUser(user: any) {
    this.isNewUser = false;
    this.userDialog = true;
    this.dialogTitle = 'Edit';
    console.log('user', user);

    this.userForm.patchValue({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  hideDialog() {
    this.userDialog = false;
  }

  saveUser() {
    console.log('user frm data', this.userForm.getRawValue().full_name);
    const userForm = {
      email: this.userForm.getRawValue().email,
      password: this.userForm.getRawValue().password,
      username: this.userForm.getRawValue().full_name,
      role: this.userForm.getRawValue().role,
    };
    this.supaBase
      .signUp(
        userForm.email,
        userForm.password,
        userForm.username,
        userForm.role
      )
      .subscribe((response) => {
        console.log('logged i', response);
      });
  }

  addUserDetails = () => {
    if (this.isNewUser) {
      this.saveUser();
    } else {
      this.updateUser();
    }
  };

  confirmDelete(user: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.full_name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {},
    });
  }

  updateUser() {
    console.log('updating user', this.userForm.getRawValue());

    const updateValue: User = {
      email: this.userForm.getRawValue().email,
      full_name: this.userForm.getRawValue().full_name,
      role: this.userForm.getRawValue().role,
    };

    this.userService
      .updateUsers(this.userForm.getRawValue().id, updateValue)
      .subscribe((response) => {
        console.log('updated', response);
      });

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Role Updated',
      life: 3000,
    });
  }

  resetPassword(user: any) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to reset the password for ' +
        user.full_name +
        '?',
      header: 'Reset Password',
      icon: 'pi pi-question-circle',
      accept: () => {
        // Call API to reset password
        // this.userService.resetPassword(user.id).subscribe(result => {
        //   this.messageService.add({severity:'success', summary: 'Success', detail: 'Password Reset Email Sent', life: 3000});
        // });

        // Mock implementation
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password Reset Email Sent',
          life: 3000,
        });
      },
    });
  }
}
