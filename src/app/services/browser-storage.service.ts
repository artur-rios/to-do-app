import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  constructor() {}

  public getLocalObject(key: string): any {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  public setLocalObject(key: string, object: any): void {
    localStorage.setItem(key, JSON.stringify(object));
  }

  public getSessionObject(key: string): any {
    return JSON.parse(sessionStorage.getItem(key) || '{}');
  }

  public setSessionObject(key: string, object: any): void {
    sessionStorage.setItem(key, JSON.stringify(object));
  }
}
