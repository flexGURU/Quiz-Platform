import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TabPanel, TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputSwitchModule } from 'primeng/inputswitch';

interface PointRule {
  id: number;
  name: string;
  actionType: string;
  pointValue: number;
  description: string;
  dailyCap?: number;
  isActive: boolean;
}
interface Reward {
  id: number;
  name: string;
  description: string;
  pointThreshold: number;
  badgeImage: string;
}

@Component({
  selector: 'app-point-rules',
  imports: [
    TableModule,
    CommonModule,
    TabViewModule,
    ToastModule,
    FileUploadModule,
    ConfirmDialog,
    InputNumberModule,
    DialogModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DropdownModule,
    ButtonModule,
    TagModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './point-rules.component.html',
  styleUrl: './point-rules.component.css',
})
export class PointRulesComponent {
  pointRules: any[] = [];
  rewards: any[] = [];
  ruleForm: FormGroup;
  rewardForm: FormGroup;
  actionTypes: any[] = [];
  displayRuleModal: boolean = false;
  displayRewardModal: boolean = false;
  selectedRule: any = null;
  selectedReward: any = null;
  isEditingRule: boolean = false;
  isEditingReward: boolean = false;

  constructor(private fb: FormBuilder) {
    this.ruleForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      actionType: ['', Validators.required],
      pointValue: [1, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      dailyCap: [null],
      isActive: [true],
    });

    this.rewardForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      pointThreshold: [100, [Validators.required, Validators.min(1)]],
      badgeImage: [''],
    });

    this.loadDummyData();
  }

  loadDummyData() {
    this.pointRules = [
      {
        id: 1,
        name: 'Daily Login',
        actionType: 'daily_login',
        pointValue: 5,
        description: 'Points for daily login',
        dailyCap: 10,
        isActive: true,
      },
      {
        id: 2,
        name: 'Correct Answer',
        actionType: 'correct_answer',
        pointValue: 2,
        description: 'Points for each correct answer',
        dailyCap: 20,
        isActive: true,
      },
    ];

    this.rewards = [
      {
        id: 1,
        name: 'Bronze Badge',
        description: 'Awarded for 100 points',
        pointThreshold: 100,
        badgeImage: 'bronze.png',
      },
      {
        id: 2,
        name: 'Silver Badge',
        description: 'Awarded for 200 points',
        pointThreshold: 200,
        badgeImage: 'silver.png',
      },
    ];

    this.actionTypes = [
      { label: 'Correct Answer', value: 'correct_answer' },
      { label: 'Speed Bonus', value: 'speed_bonus' },
      { label: 'Answer Streak', value: 'answer_streak' },
      { label: 'Quiz Completion', value: 'quiz_completion' },
      { label: 'Daily Login', value: 'daily_login' },
    ];
  }

  openNewRuleModal() {
    this.isEditingRule = false;
    this.ruleForm.reset({ pointValue: 1, isActive: true });
    this.displayRuleModal = true;
  }

  openEditRuleModal(rule: any) {
    this.isEditingRule = true;
    this.selectedRule = rule;
    this.ruleForm.patchValue(rule);
    this.displayRuleModal = true;
  }

  openNewRewardModal() {
    this.isEditingReward = false;
    this.rewardForm.reset({ pointThreshold: 100 });
    this.displayRewardModal = true;
  }

  openEditRewardModal(reward: any) {
    this.isEditingReward = true;
    this.selectedReward = reward;
    this.rewardForm.patchValue(reward);
    this.displayRewardModal = true;
  }

  saveRule() {
    if (this.ruleForm.invalid) return;
    if (this.isEditingRule && this.selectedRule) {
      const index = this.pointRules.findIndex(
        (r) => r.id === this.selectedRule.id
      );
      this.pointRules[index] = this.ruleForm.value;
    } else {
      const newRule = { ...this.ruleForm.value, id: Date.now() };
      this.pointRules.push(newRule);
    }
    this.displayRuleModal = false;
  }

  saveReward() {
    if (this.rewardForm.invalid) return;
    if (this.isEditingReward && this.selectedReward) {
      const index = this.rewards.findIndex(
        (r) => r.id === this.selectedReward.id
      );
      this.rewards[index] = this.rewardForm.value;
    } else {
      const newReward = { ...this.rewardForm.value, id: Date.now() };
      this.rewards.push(newReward);
    }
    this.displayRewardModal = false;
  }

  deleteRule(ruleId: number) {
    this.pointRules = this.pointRules.filter((r) => r.id !== ruleId);
    console.log("deleted");
    
  }

  deleteReward(rewardId: number) {
    this.rewards = this.rewards.filter((r) => r.id !== rewardId);
  }

  toggleRuleStatus(rule: any) {
    rule.isActive = !rule.isActive;
  }

  saveAllChanges() {
    console.log('All changes saved successfully');
  }
}
