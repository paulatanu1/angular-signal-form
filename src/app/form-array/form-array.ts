import { Component, signal } from '@angular/core';
import { form, FormField, required, minLength, maxLength, applyEach, submit } from '@angular/forms/signals';

@Component({
  selector: 'app-form-array',
  imports: [FormField],
  templateUrl: './form-array.html',
  styleUrl: './form-array.css',
})
export class FormArray {
  skillsModel = signal<string[]>(['']);

  skillsForm = form(this.skillsModel, (path) => {
    minLength(path, 1, { message: 'Add at least one skill' });
    maxLength(path, 5, { message: 'Maximum 5 skills allowed' });

    applyEach(path, (item) => {
      required(item, { message: 'Skill name cannot be empty' });
      minLength(item, 2, { message: 'Skill name must be at least 2 characters' });
      maxLength(item, 30, { message: 'Skill name must be 30 characters or fewer' });
    });
  });

  submitted = signal(false);
  submittedSkills = signal<string[]>([]);

  addSkill() {
    if (this.skillsModel().length >= 5) return;
    this.skillsModel.update((skills) => [...skills, '']);
  }

  removeSkill(index: number) {
    this.skillsModel.update((skills) => skills.filter((_, i) => i !== index));
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.skillsForm, async () => {
      this.submitted.set(true);
      this.submittedSkills.set([...this.skillsModel()]);
      return null;
    });
  }
}
