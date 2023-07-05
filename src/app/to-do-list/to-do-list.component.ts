import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DialogService } from '../services/dialog.service';
import { BrowserStorageService } from '../services/browser-storage.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
})
export class ToDoListComponent {
  public tasks: Task[] = [];
  public taskList: Task[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private browserStorageService: BrowserStorageService,
    private changeDetector: ChangeDetectorRef,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getTasks();
    this.linkListToPaginator();
  }

  public addTask(): void {
    this.router.navigateByUrl('form?update=false');
  }

  public editTask(id: number): void {
    this.router.navigateByUrl(`form?update=true&id=${id}`);
  }

  public getIncompleteTask(): number {
    let taskCompleted: number = 0;

    for (let task of this.tasks) {
      if (task.completed) {
        taskCompleted++;
      }
    }

    return taskCompleted;
  }

  public onSelection(event: any): void {
    const selectedTask = event.options[0]._value;

    const index = this.tasks.findIndex((task) => task.id === selectedTask.id);
    this.tasks[index].completed = !selectedTask.completed;
  }

  public removeTask(id: number): void {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index >= 0) {
      const task = this.tasks.find((task) => task.id === id);
      this.tasks.splice(index, 1);
      this.browserStorageService.setLocalObject('tasks', this.tasks);
      this.dialogService.openSimpleDialog(
        'Success',
        `${task?.title} is removed from list!`,
        ['OK']
      );
    } else {
      this.dialogService.openSimpleDialog('Error', 'Task not found!', ['OK']);
    }
  }

  private getTasks(): void {
    const localStorageTasks =
      this.browserStorageService.getLocalObject('tasks');

    if (Object.keys(localStorageTasks).length > 0) {
      this.tasks = localStorageTasks;
    }
  }

  private linkListToPaginator() {
    this.changeDetector.detectChanges();
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return of(this.tasks);
        })
      )
      .subscribe((response) => {
        const from = this.paginator.pageIndex * this.paginator.pageSize;
        const to = from + this.paginator.pageSize;
        this.taskList = response.slice(from, to);
      });
  }
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
