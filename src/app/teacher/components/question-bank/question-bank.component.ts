import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
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
import { Questions, QuestionsDB, QuizDB, Topic } from '../../../shared/models';
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
  dbQuestions = signal<QuestionsDB[]>([]);
  quizList: QuizDB[] = [];
  selectedQuiz = signal<string>('');
  questions: Questions[] = [];

  quizForm!: FormGroup;

  displayAddModal: boolean = false;
  displayEditModal: boolean = false;
  selectedQuestion: Question | null = null;
  isEditing: boolean = false;

  quizChangeEffect = effect(() => {
    console.log('selected quiz', this.selectedQuiz());
  });

  private messageService = inject(MessageService);
  constructor(private fb: FormBuilder) {
    this.initquizForm();
  }
  ngOnInit(): void {
    this.supabaseService.getQuizzes().subscribe((response) => {

      this.quizList = response; 
    });
  }

  initquizForm = () => {
    this.quizForm = this.fb.group({
      title: ['essase', Validators.required],
    });
    console.log(this.quizForm.getRawValue());
  };

  openNewQuizModal() {
    this.isEditing = false;
    // this.quizForm.reset({ pointValue: 1 });
    this.displayAddModal = true;
  }

  openEditQuestionModal(question: Question) {
    this.isEditing = true;
    this.selectedQuestion = question;
    this.quizForm.patchValue(question);
    this.displayEditModal = true;
  }

  saveQuiz = () => {
    if (this.quizForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
      return;
    }

    this.supabaseService.addQuiz(this.quizForm.value).subscribe({
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
          this.addQuestions(this.excelData);
          this.getQuestions();
        } else {
          console.error('❌ No questions to add. Excel file might be empty.');
        }
      };
      reader.readAsBinaryString(file); // Trigger file read
    } else {
      console.error('🚨 No file uploaded');
    }
  }

  getQuestions = () => {
    this.supabaseService.getQuestions().subscribe((resp) => {
      console.log('questions:', resp);
      this.questions = resp;
    });
  };

  addQuestions = (bulkQuestions: Questions[]): void => {
    if (!bulkQuestions || bulkQuestions.length === 0) return;

    const formattedQuestions: QuestionsDB[] = bulkQuestions.map(
      (question: Questions) => ({
        quiz_id: this.selectedQuiz(),
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
      })
    );

    this.dbQuestions.update((prev) => [...prev, ...formattedQuestions]);
  };

  createQuizz = () => {
    this.supabaseService.addQuestions(this.dbQuestions()).subscribe({
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

  deleteQuestion(question: Question) {}

  filterQuestions(event: any, field: keyof Question) {}

  onQuizChange = (event: any) => {
    const title = event.value;
    this.selectedQuiz.set(title);
  };
}
