import { Component, signal } from '@angular/core';
import {
  form,
  FormField,
  required,
  minLength,
  min,
  max,
  pattern,
  email,
  schema,
  apply,
  applyWhen,
  applyEach,
  submit,
} from '@angular/forms/signals';

// ── Shared schemas (structural layer — runs once at form creation)

type PersonName = { first: string; last: string };

const nameSchema = schema<PersonName>((name) => {
  required(name.first, { message: 'First name is required' });
  required(name.last, { message: 'Last name is required' });
  minLength(name.first, 2, { message: 'Min 2 characters' });
  minLength(name.last, 2, { message: 'Min 2 characters' });
});

type LineItem = { name: string; quantity: number };

const lineItemSchema = schema<LineItem>((item) => {
  required(item.name, { message: 'Item name is required' });
  minLength(item.name, 2, { message: 'Must be at least 2 characters' });
  min(item.quantity, 1, { message: 'Quantity must be at least 1' });
  max(item.quantity, 99, { message: 'Quantity cannot exceed 99' });
});

@Component({
  selector: 'app-schema-forms',
  imports: [FormField],
  templateUrl: './schema-forms.html',
  styleUrl: './schema-forms.css',
})
export class SchemaForms {
  activeTab = signal<'apply' | 'applyWhen' | 'applyEach'>('apply');

  // ── Demo 1: schema() + apply()

  profileModel = signal({
    billing: { first: '', last: '' } as PersonName,
    shipping: { first: '', last: '' } as PersonName,
    email: '',
  });

  profileForm = form(this.profileModel, (path) => {
    apply(path.billing, nameSchema);
    apply(path.shipping, nameSchema);
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
  });

  profileSubmitted = signal(false);
  profileResult = signal<{ billing: PersonName; shipping: PersonName; email: string } | null>(null);

  onProfileSubmit(event: Event) {
    event.preventDefault();
    submit(this.profileForm, async () => {
      const m = this.profileModel();
      this.profileResult.set({
        billing: { ...m.billing },
        shipping: { ...m.shipping },
        email: m.email,
      });
      this.profileSubmitted.set(true);
      return null;
    });
  }

  // ── Demo 2: applyWhen()

  addressModel = signal({ country: '', street: '', city: '', zipCode: '' });

  addressForm = form(this.addressModel, (path) => {
    required(path.country, { message: 'Country is required' });
    required(path.street, { message: 'Street address is required' });
    required(path.city, { message: 'City is required' });
    applyWhen(
      path,
      ({ valueOf }) => valueOf(path.country) === 'US',
      (p) => {
        required(p.zipCode, { message: 'Zip code is required for US addresses' });
        pattern(p.zipCode, /^\d{5}(-\d{4})?$/, {
          message: 'Enter a valid US zip code (e.g. 90210 or 90210-1234)',
        });
      },
    );
  });

  addressSubmitted = signal(false);
  addressResult = signal<{ country: string; street: string; city: string; zipCode: string } | null>(
    null,
  );

  onAddressSubmit(event: Event) {
    event.preventDefault();
    submit(this.addressForm, async () => {
      this.addressResult.set({ ...this.addressModel() });
      this.addressSubmitted.set(true);
      return null;
    });
  }

  // ── Demo 3: applyEach()

  orderModel = signal({
    title: '',
    items: [{ name: '', quantity: 1 }] as LineItem[],
  });

  orderForm = form(this.orderModel, (path) => {
    required(path.title, { message: 'Order title is required' });
    minLength(path.title, 3, { message: 'Title must be at least 3 characters' });
    applyEach(path.items, lineItemSchema);
  });

  orderSubmitted = signal(false);
  orderResult = signal<{ title: string; items: LineItem[] } | null>(null);

  addItem() {
    if (this.orderModel().items.length >= 6) return;
    this.orderModel.update((m) => ({
      ...m,
      items: [...m.items, { name: '', quantity: 1 }],
    }));
  }

  removeItem(index: number) {
    this.orderModel.update((m) => ({
      ...m,
      items: m.items.filter((_, i) => i !== index),
    }));
  }

  onOrderSubmit(event: Event) {
    event.preventDefault();
    submit(this.orderForm, async () => {
      const m = this.orderModel();
      this.orderResult.set({ title: m.title, items: m.items.map((i) => ({ ...i })) });
      this.orderSubmitted.set(true);
      return null;
    });
  }
}
