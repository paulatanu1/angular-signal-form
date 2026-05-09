import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { NestedFormService } from './nested-form.service';
import { ContactInfoComponent } from './contact-info';

interface ProfileData {
  fullName: string;
  requireContact: boolean;
}

interface SubmittedData {
  fullName: string;
  requireContact: boolean;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-user-profile-form',
  imports: [FormField, ContactInfoComponent],
  providers: [NestedFormService],
  templateUrl: './user-profile-form.html',
})
export class UserProfileFormComponent {
  // NestedFormService is provided here (component-scoped) so ContactInfoComponent
  // and PhoneDetailsComponent share the same instance via DI.
  private nestedFormService = inject(NestedFormService);

  contactInfoChild = viewChild(ContactInfoComponent);

  profileModel = signal<ProfileData>({ fullName: '', requireContact: false });

  profileForm = form(this.profileModel, (path) => {
    required(path.fullName, { message: 'Full name is required' });
  });

  // Reactive validity check spanning all three components.
  isAllValid = computed(() => {
    const profileOk = !this.profileForm().invalid();
    const contactInfo = this.contactInfoChild();
    if (!contactInfo) return false;
    const emailOk = !contactInfo.emailForm().invalid();
    const phoneOk = contactInfo.cChild()?.isValid() ?? true;
    return profileOk && emailOk && phoneOk;
  });

  submitted = signal(false);
  submittedData = signal<SubmittedData | null>(null);

  constructor() {
    // Keep the shared service in sync whenever the checkbox in profileModel changes.
    // The formField directive updates profileModel reactively, which triggers this effect.
    effect(() => {
      this.nestedFormService.requireContact.set(this.profileModel().requireContact);
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const contactInfo = this.contactInfoChild();
    if (!contactInfo) return;

    const phoneDetails = contactInfo.cChild();
    const requireContact = this.nestedFormService.requireContact();

    // Call submit() on every form so ALL fields are marked touched at once —
    // errors appear simultaneously across all three components.
    let profileValid = false;
    let emailValid = false;
    let phoneValid = false;

    submit(this.profileForm, async () => {
      profileValid = true;
      return null;
    });

    submit(contactInfo.emailForm, async () => {
      emailValid = true;
      return null;
    });

    if (requireContact && phoneDetails) {
      submit(phoneDetails.phoneForm, async () => {
        phoneValid = true;
        return null;
      });
    } else {
      phoneValid = true;
    }

    if (profileValid && emailValid && phoneValid) {
      this.submitted.set(true);
      this.submittedData.set({
        fullName: this.profileModel().fullName,
        requireContact,
        email: contactInfo.emailModel().email,
        phone: requireContact && phoneDetails ? phoneDetails.phoneModel().phone : '—',
      });
    }
  }
}
