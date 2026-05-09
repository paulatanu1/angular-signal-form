import { Component, signal, resource } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  form,
  FormField,
  required,
  email,
  minLength,
  validateAsync,
  submit,
  debounce,
  ValidationError,
} from '@angular/forms/signals';
import { RegisterData } from './interface';

const TAKEN_USERNAMES = ['admin', 'user', 'test', 'angular', 'signal'];

function checkUsernameAvailable(username: string): Promise<boolean> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(!TAKEN_USERNAMES.includes(username.toLowerCase())), 800),
  );
}

@Component({
  selector: 'app-async-validator',
  imports: [FormField, JsonPipe],
  templateUrl: './async-validator.html',
  styleUrl: './async-validator.css',
})
export class AsyncValidator {
  registerModel = signal<RegisterData>({ username: '', email: '', password: '' });

  registerForm = form(this.registerModel, (path) => {
    required(path.username, { message: 'Username is required' });
    minLength(path.username, 3, { message: 'Username must be at least 3 characters' });
    debounce(path.username, 400);

    validateAsync(path.username, {
      params: (ctx) => ctx.value(),
      factory: (params) =>
        resource({
          params: () => params(),
          loader: async ({ params: username }) => {
            if (!username) return true;
            return checkUsernameAvailable(username);
          },
        }),
      onSuccess: (isAvailable, _ctx) => {
        if (!isAvailable) {
          return { kind: 'usernameTaken', message: 'This username is already taken' } as ValidationError;
        }
        return null;
      },
      onError: (_err, _ctx) => ({
        kind: 'usernameCheckFailed',
        message: 'Could not verify username availability',
      } as ValidationError),
    });

    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Please enter a valid email address' });

    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password must be at least 8 characters' });
  });

  submitted = signal(false);
  submittedData = signal<RegisterData | null>(null);

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.registerForm, async () => {
      this.submitted.set(true);
      this.submittedData.set(this.registerModel());
      return null;
    });
  }
}
