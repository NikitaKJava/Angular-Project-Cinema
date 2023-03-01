import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewElementComponent } from './overview-element.component';

describe('OverviewElementComponent', () => {
  let component: OverviewElementComponent;
  let fixture: ComponentFixture<OverviewElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverviewElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
