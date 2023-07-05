import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogService } from '../services/dialog.service';
import { Task } from '../to-do-list/to-do-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserStorageService } from '../services/browser-storage.service';

@Component({
  selector: 'app-to-do-form',
  templateUrl: './to-do-form.component.html',
  styleUrls: ['./to-do-form.component.scss'],
})
export class ToDoFormComponent implements OnInit {
  public form: FormGroup;
  public tasks: Task[] = [];
  public submitted = false;
  public texts: FormText = {
    title: 'Add a task',
    subtitle: 'Add your new task info below',
    buttonText: 'Add task',
  };

  private idToUpdate: number | undefined;
  private isUpdate = false;

  constructor(
    private activatedroute: ActivatedRoute,
    private browserStorageService: BrowserStorageService,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group(this.buildForm());
  }

  ngOnInit(): void {
    this.getTasks();
    this.isTaskUpdate();
  }

  get f() {
    return this.form.controls;
  }

  public cancel() {
    this.router.navigateByUrl('list');
  }

  public getFormControl(controlName: string) {
    return this.form.controls[controlName] as FormControl;
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.form.valid) {
      if (this.isUpdate) {
        const index = this.tasks.findIndex(
          (task) => task.id === this.idToUpdate
        );

        if (index > 0) {
          this.tasks[index].title = this.form.value.title;
          this.tasks[index].description = this.form.value.description;
          this.browserStorageService.setLocalObject('tasks', this.tasks);

          this.dialogService
            .openSimpleDialog(
              'Success',
              `Task ${this.form.value.title} updated!`,
              ['OK']
            )
            .subscribe(() => {
              this.router.navigateByUrl('list');
            });
        } else {
          this.dialogService
            .openSimpleDialog('Error', 'Task not found!', ['OK'])
            .subscribe(() => {
              this.router.navigateByUrl('list');
            });
        }
      } else {
        this.tasks.push({
          id: this.tasks.length + 1,
          title: this.form.value.title,
          description: this.form.value.description,
          completed: false,
        });
        this.dialogService
          .openSimpleDialog(
            'Success',
            `${this.form.value.title} is added to list!`,
            ['OK', 'Add another']
          )
          .subscribe((response) => {
            if (response.toLowerCase() === 'add another') {
              this.browserStorageService.setLocalObject('tasks', this.tasks);
              this.form.reset();
              this.submitted = false;
            } else {
              this.browserStorageService.setLocalObject('tasks', this.tasks);
              this.router.navigateByUrl('list');
            }
          });
      }
    }
  }

  private buildForm(): any {
    let formGroups: any = {};
    formGroups['title'] = new FormControl('', [Validators.required]);
    formGroups['description'] = new FormControl('', [Validators.required]);

    return formGroups;
  }

  private stringToBool(text: string) {
    return text === 'true';
  }

  private getTasks(): void {
    const localStorageTasks =
      this.browserStorageService.getLocalObject('tasks');

    if (Object.keys(localStorageTasks).length > 0) {
      this.tasks = localStorageTasks;
    }
  }

  private isTaskUpdate(): void {
    this.activatedroute.queryParams.subscribe((params) => {
      if (this.stringToBool(params['update']) && params['id']) {
        const id = parseInt(params['id'], 10);

        if (!Number.isNaN(id)) {
          const taskToUpdate = this.tasks.find((task) => task.id === id);

          if (taskToUpdate) {
            this.f['title'].setValue(taskToUpdate.title);
            this.f['description'].setValue(taskToUpdate.description);
            this.isUpdate = true;
            this.idToUpdate = taskToUpdate.id;
            this.texts = {
              title: 'Update task',
              subtitle: 'Update your task info below',
              buttonText: 'Update task',
            };
          } else {
            this.dialogService
              .openSimpleDialog('Error', 'Task not found!', ['OK'])
              .subscribe(() => {
                this.router.navigateByUrl('list');
              });
          }
        } else {
          this.dialogService
            .openSimpleDialog('Error', 'Invalid id!', ['OK'])
            .subscribe(() => {
              this.router.navigateByUrl('list');
            });
        }
      }
    });
  }
}

export interface FormText {
  title: string;
  subtitle: string;
  buttonText: string;
}
