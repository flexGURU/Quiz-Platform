import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { QuestionsDB, Quiz, QuizDB } from '../../../shared/models';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { QuizService } from '../../services/quiz.service';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-manage-quiz',
  imports: [
    ToastModule,
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    CommonModule,
    TagModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './manage-quiz.component.html',
  styleUrl: './manage-quiz.component.css',
})
export class ManageQuizComponent {
  quizzes: QuizDB[] = [];
  selectedQuiz: QuizDB | null = null;
  questions: QuestionsDB[] = [];

  loadSpinner: boolean = false;

  displayQuizDialog: boolean = false;
  displayQuestionDialog: boolean = false;

  quizForm: FormGroup;
  questionForm: FormGroup;

  questionTypes = [
    { label: 'Multiple Choice', value: 'mcq' },
    { label: 'True/False', value: 'true_false' },
    { label: 'Fill in the Blank', value: 'fill_blank' },
  ];

  difficultyLevels = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  isNewQuiz: boolean = true;
  isNewQuestion: boolean = true;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.quizForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      subject: ['ddd', [Validators.required, Validators.maxLength(100)]],
      difficulty: ['', Validators.required],
    });

    this.questionForm = this.fb.group({
      id: [''],
      quiz_id: ['', Validators.required],
      question_text: ['', Validators.required],
      question_type: ['mcq', Validators.required],
      options: this.fb.array([]),
      correct_answer: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load quizzes',
        });
        console.error(error);
      },
    });
  }

  loadQuestions(quizId: string): void {
    this.loadSpinner = true;
    this.quizService.getQuestionsByQuizId(quizId).subscribe({
      next: (data) => {
        this.questions = data;
        this.loadSpinner = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load questions',
        });
        console.error(error);
      },
    });
  }

  openQuizDialog(quiz?: QuizDB): void {
    this.isNewQuiz = !quiz;

    if (quiz) {
      this.quizForm.patchValue({
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        // numberOfQuestions: quiz.numberOfQuestions,
      });
    } else {
      this.quizForm.reset({
        difficulty: 'medium',
        numberOfQuestions: 1,
      });
    }

    this.displayQuizDialog = true;
  }

  openQuestionDialog(question?: any): void {
    this.isNewQuestion = !question;

    // Reset the form array
    while (this.optionsArray.length) {
      this.optionsArray.removeAt(0);
    }

    if (question) {
      this.questionForm.patchValue({
        id: question.id,
        quiz_id: question.quiz_id,
        question_text: question.question_text,
        question_type: question.question_type,
        correct_answer: question.correct_answer,
        points: question.points,
      });

      // Add options for existing question
      if (question.question_type === 'mcq') {
        const options = question.options.options || [];
        options.forEach((option: string) => {
          this.addOption(option);
        });
      } else if (question.question_type === 'true_false') {
        this.addOption('True');
        this.addOption('False');
      }
    } else if (this.selectedQuiz) {
      this.questionForm.patchValue({
        quiz_id: this.selectedQuiz.id,
        question_type: 'mcq',
        points: 1,
      });

      // Add empty options for new MCQ
      this.addOption('');
      this.addOption('');
      this.addOption('');
      this.addOption('');
    }

    this.displayQuestionDialog = true;
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption(value: string = ''): void {
    this.optionsArray.push(this.fb.control(value, Validators.required));
  }

  removeOption(index: number): void {
    this.optionsArray.removeAt(index);
  }

  onQuestionTypeChange(): void {
    const questionType = this.questionForm.get('question_type')?.value;

    // Clear options array
    while (this.optionsArray.length) {
      this.optionsArray.removeAt(0);
    }

    // Add appropriate options based on question type
    if (questionType === 'mcq') {
      this.addOption('');
      this.addOption('');
      this.addOption('');
      this.addOption('');
    } else if (questionType === 'true_false') {
      this.addOption('True');
      this.addOption('False');
    }
  }

  saveQuiz(): void {
    if (this.quizForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please complete all required fields',
      });
      return;
    }

    const quizData = this.quizForm.value;

    if (this.isNewQuiz) {
      this.quizService.createQuiz(quizData).subscribe({
        next: (quiz) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Quiz created successfully',
          });
          this.loadQuizzes();
          this.displayQuizDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create quiz',
          });
          console.error(error);
        },
      });
    } else {
      this.quizService.updateQuiz(quizData.id, quizData).subscribe({
        next: (quiz) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Quiz updated successfully',
          });
          this.loadQuizzes();
          this.displayQuizDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update quiz',
          });
          console.error(error);
        },
      });
    }
  }

  saveQuestion(): void {
    if (this.questionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please complete all required fields',
      });
      return;
    }

    const questionData = { ...this.questionForm.value };

    // Format options based on question type
    if (questionData.question_type === 'mcq') {
      questionData.options = { options: questionData.options };
    } else if (questionData.question_type === 'true_false') {
      questionData.options = { options: ['True', 'False'] };
    } else {
      questionData.options = { answer: questionData.correct_answer };
    }

    if (this.isNewQuestion) {
      this.quizService.createQuestion(questionData).subscribe({
        next: (question) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Question created successfully',
          });
          if (this.selectedQuiz?.id) {
            this.loadQuestions(this.selectedQuiz!.id);
          }
          this.displayQuestionDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create question',
          });
          console.error(error);
        },
      });
    } else {
      this.quizService.updateQuestion(questionData.id, questionData).subscribe({
        next: (question) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Question updated successfully',
          });
          if (this.selectedQuiz?.id) {
            this.loadQuestions(this.selectedQuiz!.id);
          }
          this.displayQuestionDialog = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update question',
          });
          console.error(error);
        },
      });
    }
  }

  deleteQuiz(quizId: string): void {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete this quiz? This will also delete all related questions.',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.quizService.deleteQuiz(quizId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Quiz deleted successfully',
            });
            this.loadQuizzes();
            if (this.selectedQuiz?.id === quizId) {
              this.selectedQuiz = null;
              this.questions = [];
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete quiz',
            });
            console.error(error);
          },
        });
      },
    });
  }

  deleteQuestion(questionId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this question?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.quizService.deleteQuestion(questionId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Question deleted successfully',
            });
            if (this.selectedQuiz?.id) {
              this.loadQuestions(this.selectedQuiz!.id);
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete question',
            });
            console.error(error);
          },
        });
      },
    });
  }

  onQuizSelect(quiz: QuizDB): void {
    this.selectedQuiz = quiz;
    if (this.selectedQuiz?.id) {
      this.loadQuestions(this.selectedQuiz!.id);
    }
  }

  getQuestionTypeLabel(type: string): string {
    switch (type) {
      case 'mcq':
        return 'Multiple Choice';
      case 'true_false':
        return 'True/False';
      case 'fill_blank':
        return 'Fill in Blank';
      default:
        return type;
    }
  }

  getQuestionTypeSeverity(type: string): any {
    switch (type) {
      case 'mcq':
        return 'info';
      case 'true_false':
        return 'success';
      case 'fill_blank':
        return 'warning';
      default:
        return 'info';
    }
  }
}
