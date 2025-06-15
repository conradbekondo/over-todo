import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  linkedSignal,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { differenceInHours, formatDistanceToNow } from 'date-fns';
import {
  ChevronDown,
  ClockAlert,
  LucideAngularModule,
  Trash2Icon,
  TriangleAlert,
} from 'lucide-angular';
import { Task } from '../../../models/types';

export interface Toggle {
  isToggled(): boolean;
  getId(): string;
  toggle(v: boolean): void;
}

export class ToggleGroup {
  private readonly toggles = new Map<string, Toggle>();

  addToggle(t: Toggle) {
    this.toggles.set(t.getId(), t);
  }

  remove(t: Toggle) {
    this.toggles.delete(t.getId());
  }

  toggle(t: Toggle) {
    t.toggle(!t.isToggled());
    for (const toggle of this.toggles.values()) {
      if (t.getId() === toggle.getId()) continue;
      toggle.toggle(false);
    }
  }
}

@Component({
  selector: 'ot-task',
  imports: [DatePipe, NgClass, LucideAngularModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements Toggle, OnDestroy {
  readonly ChevronDown = ChevronDown;
  readonly DeleteIcon = Trash2Icon;
  readonly onDeleted = output();
  readonly completionStatusChanged = output<boolean>();
  readonly task = input.required<Task>();
  readonly completed = linkedSignal(() => this.task().completed);
  readonly criticalIcon = computed(() => {
    const task = this.task();
    if (!task.dueDate) return null;
    const diff = differenceInHours(new Date(), task.dueDate);
    if (task.priority === 'high' && diff < 24 && !this.completed())
      return TriangleAlert;
    else if (diff < 24 && diff > 0 && !this.completed()) return ClockAlert;
    return null;
  });
  iconColor = computed(() => {
    const task = this.task();
    if (!task.dueDate) return null;
    const diff = differenceInHours(new Date(), task.dueDate);
    if (task.priority === 'high' && diff < 24 && !this.completed())
      return 'red';
    else if (diff < 24 && diff > 0 && !this.completed()) return 'yellow';
    return null;
  });
  dueDateFormat = computed(() => {
    const task = this.task();
    if (!task.dueDate) return '';
    return formatDistanceToNow(task.dueDate, { addSuffix: true });
  });
  readonly group = input<ToggleGroup>();
  readonly details = viewChild<ElementRef<HTMLDetailsElement>>('details');

  constructor() {
    effect(() => {
      const g = this.group();
      if (!g) return;
      g.addToggle(this);
    });
  }

  ngOnDestroy() {
    this.group()?.remove(this);
  }

  getId(): string {
    return this.task().id!;
  }

  isToggled() {
    return this.details()?.nativeElement?.open ?? false;
  }

  onToggleButtonClicked() {
    this.group()?.toggle(this);
  }

  toggle(v: boolean): void {
    const details = this.details();
    if (!details) return;
    details.nativeElement.open = v;
  }

  onCompletionInputChecked(arg: boolean) {
    this.completionStatusChanged.emit(arg);
  }

  onDeleteButtonClicked(ev: Event) {
    ev.preventDefault();
    this.onDeleted.emit();
  }
}
