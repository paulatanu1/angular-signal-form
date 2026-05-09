import { Component, OnInit, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { loginData } from './interface';

@Component({
  selector: 'app-signal-forms',
  imports: [FormField],
  templateUrl: './signal-forms.html',
  styleUrl: './signal-forms.css',
})
export class SignalForms implements OnInit {
  loginModel = signal<loginData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  ngOnInit(): void {
    console.log(this.loginForm);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async (data) => {
      const u = this.loginModel();
      console.log('Form submitted with data:', u);
    });
  }
}
