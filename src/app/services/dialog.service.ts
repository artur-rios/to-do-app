import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { SimpleDialogComponent } from '../simple-dialog/simple-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  public openSimpleDialog(
    title: string,
    message: string,
    buttons: string[]
  ): Observable<string> {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      width: '250px',
      data: { title: title, message: message, buttons: buttons },
    });

    const subject = new Subject<string>();

    dialogRef.afterClosed().subscribe((response) => {
      subject.next(response);
      subject.complete();
    });

    return subject;
  }
}
