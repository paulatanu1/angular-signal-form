import { Injectable, signal } from '@angular/core';

@Injectable()
export class NestedFormService {
  requireContact = signal(false);
}
