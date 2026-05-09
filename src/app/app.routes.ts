import { Routes } from '@angular/router';
import { SignalForms } from './signal-forms/signal-forms';
import { AsyncValidator } from './async-validator/async-validator';
import { FormArray } from './form-array/form-array';
import { SignalHome } from './signal-home/signal-home';
import { DynamicFields } from './dynamic-fields/dynamic-fields';
import { UserProfileFormComponent } from './nested-forms/user-profile-form';
import { SchemaForms } from './schema-forms/schema-forms';

export const routes: Routes = [
  { path: '', component: SignalHome, pathMatch: 'full' },
  { path: 'signal-form-basic', component: SignalForms, pathMatch: 'full' },
  { path: 'signal-form-async', component: AsyncValidator, pathMatch: 'full' },
  { path: 'signal-form-array', component: FormArray, pathMatch: 'full' },
  { path: 'signal-form-dynamic', component: DynamicFields, pathMatch: 'full' },
  { path: 'signal-form-nested', component: UserProfileFormComponent, pathMatch: 'full' },
  { path: 'signal-form-schemas', component: SchemaForms, pathMatch: 'full' },
];
