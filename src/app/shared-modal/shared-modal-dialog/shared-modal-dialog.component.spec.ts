import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModalDialogComponent } from './shared-modal-dialog.component';

describe('SharedModalDialogComponent', () => {
  let component: SharedModalDialogComponent;
  let fixture: ComponentFixture<SharedModalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedModalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
