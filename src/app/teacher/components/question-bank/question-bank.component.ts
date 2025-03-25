import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { Questions, QuestionsDB, Topic } from '../../../shared/models';
import { QuestionBankService } from '../../services/question-bank.service';

interface Question {
  id: number;
  text: string;
  type: string;
  options?: string[];
  correctAnswer: string | number;
  difficulty: string;
  pointValue: number;
  subject: string;
}

@Component({
  selector: 'app-question-bank',
  imports: [
    ButtonModule,
    InputNumberModule,
    DropdownModule,
    TableModule,
    TagModule,
    DialogModule,
    CommonModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    MessagesModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.css',
})
export class QuestionBankComponent {
  private supabaseService = inject(QuestionBankService);
  excelData: Questions[] = [];
  dbQuestions: QuestionsDB[] = [];
  subjects: string[] = [];
  questions: Question[] = [
    {
      id: 1,
      text: 'What is 2 + 2?',
      type: 'mcq',
      options: ['2', '3', '4', '5'],
      correctAnswer: '4',
      difficulty: 'easy',
      pointValue: 1,
      subject: 'mathematics',
    },
    {
      id: 2,
      text: 'Is the sky blue?',
      type: 'truefalse',
      options: ['True', 'False'],
      correctAnswer: 'True',
      difficulty: 'easy',
      pointValue: 1,
      subject: 'science',
    },
  ];

  filteredQuestions: Question[] = [...this.questions];

  subjectForm!: FormGroup;

  displayAddModal: boolean = false;
  displayEditModal: boolean = false;
  selectedQuestion: Question | null = null;
  isEditing: boolean = false;

  private messageService = inject(MessageService);
  constructor(private fb: FormBuilder) {
    this.initSubjectForm();
  }
  ngOnInit(): void {
    this.supabaseService.getSubjects().subscribe((response) => {
      console.log('subjects:', response);
  
      // Access the 'name' field from each subject
      const subjectNames = response.map((subject: { name: string }) => subject.name);
      console.log('Subject Names:', subjectNames);
  
      this.subjects = subjectNames; // Store the names if needed
    });
  }
  
  initSubjectForm = () => {
    this.subjectForm = this.fb.group({
      subjectName: ['essase', Validators.required],
    });
    console.log(this.subjectForm.getRawValue());
  };

  openNewQuestionModal() {
    this.isEditing = false;
    // this.subjectForm.reset({ pointValue: 1 });
    this.displayAddModal = true;
  }

  openEditQuestionModal(question: Question) {
    this.isEditing = true;
    this.selectedQuestion = question;
    this.subjectForm.patchValue(question);
    this.displayEditModal = true;
  }

  saveSubject = () => {
    if (this.subjectForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }
    const questionData: Topic = {
      name: this.subjectForm.value.subjectName,
    };
    console.log(questionData);

    this.supabaseService.addSubjects(questionData).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (err) => {
        console.error('🚨 Error Adding Questions:', err.message);
      },
      complete: () => {
        console.log('suuccesful');
      },
    });
  };
  onFileUpload(event: any) {
    const file = event.files[0]; // Get the first uploaded file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        if (this.excelData && this.excelData.length > 0) {
          this.addQuestions(this.excelData); // ✅ Call AFTER data is ready
        } else {
          console.error('❌ No questions to add. Excel file might be empty.');
        }
      };
      reader.readAsBinaryString(file); // Trigger file read
    } else {
      console.error('🚨 No file uploaded');
    }
  }

  addQuestions = (bulkQuestions: Questions[]): void => {
    this.supabaseService.getQuestions().subscribe((resp) => {
      console.log(resp);
    });
    if (!bulkQuestions || bulkQuestions.length === 0) {
      return;
    }

    bulkQuestions.forEach((question: Questions) => {
      const formattedQuestion: QuestionsDB = {
        question_text: question.question_text,
        question_type: question.question_type.toLowerCase(),
        options: {
          A: question.optionA,
          B: question.optionB,
          C: question.optionC,
          D: question.optionD,
        },
        correct_answer: question.correct_answer,
        points: question.points,
      };
      this.dbQuestions.push(formattedQuestion);
    });

    this.supabaseService.addQuestions(this.dbQuestions).subscribe({
      next: (resp) => {
        console.log('✅ Questions Added:', resp);
      },
      error: (err) => {
        console.error('🚨 Error Adding Questions:', err.message);
      },
      complete: () => {
        console.log('🎉 Completed Adding Questions');
      },
    });
  };

  deleteQuestion(question: Question) {
    this.questions = this.questions.filter((q) => q.id !== question.id);
    this.filteredQuestions = [...this.questions];
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Question deleted',
    });
  }

  filterQuestions(event: any, field: keyof Question) {
    const value = event.value;

    if (!value || value.length === 0) {
      this.filteredQuestions = [...this.questions];
    } else {
      this.filteredQuestions = this.questions.filter((q) => {
        if (Array.isArray(value)) {
          return value.includes(q[field]);
        } else {
          return q[field] === value;
        }
      });
    }
  }
}
