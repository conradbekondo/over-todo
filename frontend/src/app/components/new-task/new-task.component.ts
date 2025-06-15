import { DatePipe, formatDate, NgTemplateOutlet } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ChevronDown,
  ChevronUp,
  Loader,
  LucideAngularModule,
} from 'lucide-angular';
import { NewTaskSchema } from '../../../models/schemas';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'ot-new-task',
  imports: [LucideAngularModule, DatePipe, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  Loader = Loader;
  ChevronDown = ChevronDown;
  ChevronUp = ChevronUp;
  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    dueDate: new FormControl<string | null>(
      formatDate(
        new Date(Date.now() + 3_600_000 * 2),
        'yyyy-MM-ddTHH:mm',
        navigator.language
      )
    ),
    priority: new FormControl<string | null>(null),
    reminder: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    category: new FormControl<string | null>(null),
  });
  expanded = signal(false);
  minDate = new Date();
  submitting = signal(false);
  private todoService = inject(TaskService);
  readonly created = output();

  onFormSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.submitting.set(true);
    this.todoService
      .createTask(NewTaskSchema.parse(this.form.value))
      .subscribe({
        error: (e: Error) => {
          alert(e.message);
          this.submitting.set(false);
        },
        complete: () => {
          this.submitting.set(false);
          this.created.emit();
          this.form.reset();
          this.expanded.set(false);
        },
      });
  }
}
