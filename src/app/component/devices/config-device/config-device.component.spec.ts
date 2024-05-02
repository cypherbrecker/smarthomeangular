import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigDeviceComponent } from './config-device.component';

describe('ConfigDeviceComponent', () => {
  let component: ConfigDeviceComponent;
  let fixture: ComponentFixture<ConfigDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
