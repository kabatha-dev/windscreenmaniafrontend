import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementOfAccountComponent } from './statement-of-account.component';

describe('StatementOfAccountComponent', () => {
  let component: StatementOfAccountComponent;
  let fixture: ComponentFixture<StatementOfAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementOfAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementOfAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
