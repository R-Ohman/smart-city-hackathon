import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  searchQuery = signal('');

  constructor() { }
}
