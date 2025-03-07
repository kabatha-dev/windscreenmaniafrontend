import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleServiceComponent } from './vehicle-service.component';

describe('VehicleServiceComponent', () => {
  let component: VehicleServiceComponent;
  let fixture: ComponentFixture<VehicleServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
