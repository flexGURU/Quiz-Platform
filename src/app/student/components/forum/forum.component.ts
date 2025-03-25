import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
interface ThreadSummary {
  id: number;
  title: string;
  preview: string;
  votes: number;
  answerCount: number;
  author: string;
  authorAvatar: string;
  postedTime: string;
  tags: string[];
  hasBounty: boolean;
  bountyAmount?: number;
}

@Component({
  selector: 'app-forum',
  imports: [
    ButtonModule,
    TabViewModule,
    CommonModule,
    CardModule,
    RouterLink,
    TagModule,
    AvatarModule,
    PaginatorModule,
    FormsModule,
  ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent {
  threads: ThreadSummary[] = [];
  filteredThreads: ThreadSummary[] = [];
  totalThreads: number = 0;
  searchText: string = '';
  currentPage: number = 0;

  constructor() {}

  ngOnInit() {
    this.loadThreads();
  }

  loadThreads() {
    // Static data instead of calling the service
    this.threads = [
      {
        id: 1,
        title: 'How to use Angular?',
        preview: "A beginner's guide to Angular...",
        votes: 10,
        answerCount: 3,
        author: 'JohnDoe',
        authorAvatar: 'https://example.com/avatar1.jpg',
        postedTime: '2023-10-01',
        tags: ['Angular', 'Beginner'],
        hasBounty: true,
        bountyAmount: 50,
      },
      {
        id: 2,
        title: 'Advanced TypeScript Tips',
        preview: 'Learn advanced TypeScript techniques...',
        votes: 25,
        answerCount: 7,
        author: 'JaneSmith',
        authorAvatar: 'https://example.com/avatar2.jpg',
        postedTime: '2023-09-25',
        tags: ['TypeScript', 'Advanced'],
        hasBounty: false,
      },
      {
        id: 3,
        title: 'Getting Started with RxJS',
        preview: 'Introduction to Reactive Programming...',
        votes: 15,
        answerCount: 5,
        author: 'AliceJohnson',
        authorAvatar: 'https://example.com/avatar3.jpg',
        postedTime: '2023-09-20',
        tags: ['RxJS', 'Reactive Programming'],
        hasBounty: true,
        bountyAmount: 30,
      },
    ];

    this.filteredThreads = [...this.threads];
    this.totalThreads = this.threads.length;
    this.applyFilters();
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.loadThreads();
  }

  applyFilters() {
    if (!this.searchText.trim()) {
      this.filteredThreads = [...this.threads];
      return;
    }

    const searchLower = this.searchText.toLowerCase();
    this.filteredThreads = this.threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(searchLower) ||
        thread.preview.toLowerCase().includes(searchLower) ||
        thread.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }
}
