import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LojistasComponent } from './lojistas.component';

describe('LojistasComponent', () => {
  let component: LojistasComponent;
  let fixture: ComponentFixture<LojistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LojistasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LojistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
