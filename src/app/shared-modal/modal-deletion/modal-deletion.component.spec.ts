import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeletionComponent } from './modal-deletion.component';

describe('ModalDeletionComponent', () => {
  let component: ModalDeletionComponent;
  let fixture: ComponentFixture<ModalDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDeletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
