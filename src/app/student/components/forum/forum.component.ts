import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { PaginatorModule } from 'primeng/paginator';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ForumPost, ForumReply } from '../../../shared/models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ForumService } from '../../services/forum.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-forum',
  imports: [
    ButtonModule,
    TabViewModule,
    CommonModule,
    CardModule,
    ToastModule,
    TagModule,
    AvatarModule,
    PaginatorModule,
    FormsModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent {
  posts: ForumPost[] = [];
  replies: ForumReply[] = [];
  loading = true;
  postForm: FormGroup;
  replyForm: FormGroup;
  showNewPostForm = false;
  replyingToPostId: string | null = null;
  showReplies = false;
  selectedPost: ForumPost | null = null;

  constructor(
    private forumService: ForumService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required]],
    });

    this.replyForm = this.fb.group({
      content: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadPosts();

    this.forumService.forumPosts$.subscribe((posts) => {
      this.posts = posts;
      this.loading = false;

      // If we're viewing a post's replies, update the selected post
      if (this.replyingToPostId && this.showReplies) {
        this.selectedPost =
          this.posts.find((p) => p.id === this.replyingToPostId) || null;
      }
    });

    this.forumService.replies$.subscribe((replies) => {
      this.replies = replies;
    });
  }

  loadPosts(): void {
    this.loading = true;
    this.forumService.getForumPosts().subscribe();
  }

  toggleNewPostForm(): void {
    this.showNewPostForm = !this.showNewPostForm;
    this.replyingToPostId = null;
    this.resetForm();
  }

  startReply(postId: string): void {
    this.replyingToPostId = postId;
    this.resetReplyForm();
  }

  cancelReply(): void {
    this.replyingToPostId = null;
  }

  resetForm(): void {
    this.postForm.reset();
  }

  resetReplyForm(): void {
    this.replyForm.reset();
  }

  submitPost(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const { title, content } = this.postForm.value;

    this.forumService.createForumPost(title, content).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Post Created',
          detail: 'Your forum post has been created successfully.',
        });
        this.toggleNewPostForm();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create post. Please try again.',
        });
      }
    );
  }

  submitReply(): void {
    if (this.replyForm.invalid || !this.replyingToPostId) {
      this.replyForm.markAllAsTouched();
      return;
    }

    const { content } = this.replyForm.value;

    this.forumService.createReply(this.replyingToPostId, content).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reply Posted',
          detail: 'Your reply has been posted successfully.',
        });
        this.replyForm.reset();

        // If we're in the replies view, refresh replies
        if (this.showReplies && this.replyingToPostId) {
          this.forumService.getReplies(this.replyingToPostId).subscribe();
        } else {
          // If we're in the main view, refresh posts to update reply count
          this.loadPosts();
          this.cancelReply();
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to post reply. Please try again.',
        });
      },
    });
  }

  reactToPost(postId: string, reaction: 'like' | 'dislike'): void {
    this.forumService.updatePostReactions(postId, reaction).subscribe(
      () => {
        // Success handling if needed
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${reaction} the post. Please try again.`,
        });
      }
    );
  }

  reactToReply(replyId: string, reaction: 'like' | 'dislike'): void {
    if (!this.replyingToPostId) return;

    this.forumService
      .updateReplyReactions(replyId, reaction, this.replyingToPostId)
      .subscribe();
  }

  viewReplies(postId: string): void {
    this.replyingToPostId = postId;
    this.showReplies = true;
    this.selectedPost = this.posts.find((p) => p.id === postId) || null;
    this.forumService.getReplies(postId).subscribe();
  }

  backToMainForum(): void {
    this.showReplies = false;
    this.replyingToPostId = null;
    this.selectedPost = null;
    this.replies = [];
    this.loadPosts();
  }
}
