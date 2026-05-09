import { Component, signal, viewChild } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { PhoneDetailsComponent } from './phone-details';

interface EmailData {
  email: string;
}

@Component({
  selector: 'app-contact-info',
  imports: [FormField, PhoneDetailsComponent],
  templateUrl: './contact-info.html',
})
export class ContactInfoComponent {
  // Exposed so UserProfileFormComponent's submit handler can trigger validation on PhoneDetailsComponent.
  cChild = viewChild(PhoneDetailsComponent);

  emailModel = signal<EmailData>({ email: '' });

  emailForm = form(this.emailModel, (path) => {
    required(path.email, { message: 'Email address is required' });
    email(path.email, { message: 'Please enter a valid email address' });
  });
}
