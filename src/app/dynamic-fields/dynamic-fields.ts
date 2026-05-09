import { Component, computed, signal } from '@angular/core';
import { form, FormField, required, email, minLength, submit } from '@angular/forms/signals';

// Root cause of the previous bug: form() schema runs once at initialisation,
// not reactively — so reading a signal inside an `if` had no effect after toggle.
//
// Fix: two separate form objects.
// - personalForm: name + email, always validated.
// - businessForm: phone + companyName, validators always defined but only
//   contribute to overall validity when isBusiness is true.

interface PersonalData {
  name: string;
  email: string;
  isBusiness: boolean;
}

interface BusinessData {
  phone: string;
  companyName: string;
}

interface SubmittedData {
  name: string;
  email: string;
  isBusiness: boolean;
  phone: string;
  companyName: string;
}

@Component({
  selector: 'app-dynamic-fields',
  imports: [FormField],
  templateUrl: './dynamic-fields.html',
  styleUrl: './dynamic-fields.css',
})
export class DynamicFields {
  personalModel = signal<PersonalData>({ name: '', email: '', isBusiness: false });

  personalForm = form(this.personalModel, (path) => {
    required(path.name, { message: 'Full name is required' });
    minLength(path.name, 2, { message: 'Name must be at least 2 characters' });
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Please enter a valid email address' });
  });

  // Validators are always defined here — no conditional logic in schema.
  // Whether businessForm.invalid() blocks submission is controlled by isFormValid().
  businessModel = signal<BusinessData>({ phone: '', companyName: '' });

  businessForm = form(this.businessModel, (path) => {
    required(path.phone, { message: 'Phone is required for business accounts' });
    minLength(path.phone, 10, { message: 'Phone must be at least 10 digits' });
    required(path.companyName, { message: 'Company name is required' });
    minLength(path.companyName, 2, { message: 'Company name must be at least 2 characters' });
  });

  // Reactive: re-evaluates whenever personalModel or either form validity changes.
  isFormValid = computed(() => {
    const personalOk = !this.personalForm().invalid();
    if (!this.personalModel().isBusiness) return personalOk;
    return personalOk && !this.businessForm().invalid();
  });

  submitted = signal(false);
  submittedData = signal<SubmittedData | null>(null);

  onSubmit(event: Event) {
    event.preventDefault();
    // submit() marks all fields as touched (shows errors) and calls the
    // callback only when the form is valid.
    submit(this.personalForm, async () => {
      if (this.personalModel().isBusiness) {
        submit(this.businessForm, async () => {
          this.doSubmit();
          return null;
        });
      } else {
        this.doSubmit();
      }
      return null;
    });
  }

  private doSubmit() {
    const p = this.personalModel();
    const b = this.businessModel();
    this.submitted.set(true);
    this.submittedData.set({
      name: p.name,
      email: p.email,
      isBusiness: p.isBusiness,
      phone: p.isBusiness ? b.phone : '',
      companyName: p.isBusiness ? b.companyName : '',
    });
  }
}
