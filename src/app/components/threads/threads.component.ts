import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface Answer {
  id: number;
  content: string;
  votes: number;
  author: User;
  answeredTime: string;
  isAccepted: boolean;
}

interface Thread {
  id: number;
  title: string;
  content: string;
  votes: number;
  views: number;
  author: User;
  postedTime: string;
  tags: string[];
  answers: Answer[];
  hasBounty: boolean;
  bountyAmount?: number;
  isBookmarked: boolean;
}

@Component({
  selector: 'app-threads',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    CommonModule,
    SelectButtonModule,
    FormsModule,
    TagModule,
    CardModule,
    AvatarModule,
    ReactiveFormsModule,
    EditorModule,
  ],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.css',
})
export class ThreadsComponent {
  thread: Thread | null = null;
  threadId: number = 1; // Static thread ID
  currentUser: User | null = {
    id: 2,
    name: 'Jane Doe',
    avatar: 'https://via.placeholder.com/40',
  };
  sortOptions = [
    { label: 'Votes', value: 'votes' },
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' },
  ];
  newAnswer: string = '';
  selectedSortOption: string = 'votes';
  showMessage: string = ''; // For displaying alerts/messages

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.loadThread();
  }

  loadThread() {
    // Static thread data
    this.thread = {
      id: 1,
      title: 'How to optimize Angular performance?',
      content:
        "I'm facing performance issues with large-scale Angular apps. Any tips?",
      votes: 12,
      views: 340,
      author: {
        id: 1,
        name: 'John Smith',
        avatar: 'https://via.placeholder.com/40',
      },
      postedTime: '2024-03-18T10:00:00',
      tags: ['Angular', 'Performance', 'Optimization'],
      answers: [
        {
          id: 101,
          content: 'Use OnPush change detection and lazy loading.',
          votes: 25,
          author: {
            id: 3,
            name: 'Alice Brown',
            avatar: 'https://via.placeholder.com/40',
          },
          answeredTime: '2024-03-18T12:30:00',
          isAccepted: true,
        },
        {
          id: 102,
          content: 'Consider using trackBy in *ngFor to optimize rendering.',
          votes: 18,
          author: {
            id: 4,
            name: 'Bob Williams',
            avatar: 'https://via.placeholder.com/40',
          },
          answeredTime: '2024-03-18T13:15:00',
          isAccepted: false,
        },
      ],
      hasBounty: true,
      bountyAmount: 50,
      isBookmarked: false,
    };
    this.sortAnswers();
  }

  voteQuestion(voteValue: number) {
    if (this.thread) {
      this.thread.votes += voteValue;
    }
  }

  voteAnswer(answerId: number, voteValue: number) {
    if (this.thread) {
      const answer = this.thread.answers.find((a) => a.id === answerId);
      if (answer) {
        answer.votes += voteValue;
      }
    }
  }

  acceptAnswer(answerId: number) {
    if (this.thread) {
      this.thread.answers.forEach((answer) => {
        answer.isAccepted = answer.id === answerId;
      });
      this.showMessage = 'Answer marked as accepted!';
    }
  }

  submitAnswer() {
    if (!this.newAnswer.trim()) {
      this.showMessage = 'Answer cannot be empty!';
      return;
    }

    if (this.thread) {
      const newAnswer: Answer = {
        id: Date.now(),
        content: this.newAnswer,
        votes: 0,
        author: this.currentUser!,
        answeredTime: new Date().toISOString(),
        isAccepted: false,
      };
      this.thread.answers.push(newAnswer);
      this.sortAnswers();
      this.newAnswer = '';
      this.showMessage = 'Answer submitted successfully!';
    }
  }

  toggleBookmark() {
    if (this.thread) {
      this.thread.isBookmarked = !this.thread.isBookmarked;
      this.showMessage = this.thread.isBookmarked
        ? 'Thread bookmarked!'
        : 'Bookmark removed!';
    }
  }

  reportThread() {
    this.router.navigate(['/forum/report'], {
      queryParams: { threadId: this.threadId, contentType: 'thread' },
    });
  }

  reportAnswer(answerId: number) {
    this.router.navigate(['/forum/report'], {
      queryParams: {
        threadId: this.threadId,
        answerId: answerId,
        contentType: 'answer',
      },
    });
  }

  sortAnswers() {
    if (!this.thread) return;

    switch (this.selectedSortOption) {
      case 'votes':
        this.thread.answers.sort((a, b) => b.votes - a.votes);
        break;
      case 'newest':
        this.thread.answers.sort(
          (a, b) =>
            new Date(b.answeredTime).getTime() -
            new Date(a.answeredTime).getTime()
        );
        break;
      case 'oldest':
        this.thread.answers.sort(
          (a, b) =>
            new Date(a.answeredTime).getTime() -
            new Date(b.answeredTime).getTime()
        );
        break;
    }
  }
}
