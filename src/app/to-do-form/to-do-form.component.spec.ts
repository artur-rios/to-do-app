import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToDoFormComponent } from './to-do-form.component';
import { ActivatedRoute } from '@angular/router';
import { BrowserStorageService } from '../services/browser-storage.service';
import { DialogService } from '../services/dialog.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToDoListComponent } from '../to-do-list/to-do-list.component';

describe('ToDoFormComponent', () => {
  let component: ToDoFormComponent;
  let fixture: ComponentFixture<ToDoFormComponent>;

  let browserStorageServiceSpy: any;
  let dialogServiceSpy: any;

  beforeEach(() => {
    browserStorageServiceSpy = jasmine.createSpyObj('BrowserStorageService', [
      'getLocalObject',
      'setLocalObject',
    ]);
    browserStorageServiceSpy.getLocalObject.and.returnValue([]);

    dialogServiceSpy = jasmine.createSpyObj('DialogService', [
      'openSimpleDialog',
    ]);
    dialogServiceSpy.openSimpleDialog.and.returnValue(of('OK'));

    TestBed.configureTestingModule({
      declarations: [ToDoFormComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'form',
            component: ToDoFormComponent,
          },
          {
            path: 'list',
            component: ToDoListComponent,
          },
          {
            path: '**',
            redirectTo: 'list',
            pathMatch: 'full',
          },
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              update: false,
            }),
          },
        },
        { provide: BrowserStorageService, useValue: browserStorageServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ToDoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a new task', () => {
    const expectedId = component.tasks.length + 1;
    const title = 'Test';
    const description = 'Testing task addition';
    component.f['title'].setValue(title);
    component.f['description'].setValue(description);
    component.onSubmit();
    const newTask = component.tasks.find((task) => task.id === expectedId);

    expect(newTask).toBeTruthy();
    expect(newTask?.title).toEqual(title);
    expect(newTask?.description).toEqual(description);
    expect(dialogServiceSpy.openSimpleDialog).toHaveBeenCalledWith(
      'Success',
      `${title} is added to list!`,
      ['OK', 'Add another']
    );
  });
});
