import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalHome } from './signal-home';

describe('SignalHome', () => {
  let component: SignalHome;
  let fixture: ComponentFixture<SignalHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
