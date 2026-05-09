import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { NestedFormService } from './nested-form.service';

interface PhoneData {
  phone: string;
}

@Component({
  selector: 'app-phone-details',
  imports: [FormField],
  templateUrl: './phone-details.html',
})
export class PhoneDetailsComponent {
  private nestedFormService = inject(NestedFormService);

  // Reads the checkbox state published by UserProfileFormComponent via the scoped service.
  requireContact = this.nestedFormService.requireContact;

  phoneModel = signal<PhoneData>({ phone: '' });

  // Validator is always registered; whether it blocks overall submission
  // is controlled by requireContact (same pattern as dynamic-fields).
  phoneForm = form(this.phoneModel, (path) => {
    required(path.phone, { message: 'Phone number is required' });
  });

  isValid = computed(() => {
    if (!this.requireContact()) return true;
    return !this.phoneForm().invalid();
  });
}
