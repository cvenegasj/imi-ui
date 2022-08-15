import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImiMapPlotComponent } from './imi-map-plot.component';

describe('ImiMapPlotComponent', () => {
  let component: ImiMapPlotComponent;
  let fixture: ComponentFixture<ImiMapPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImiMapPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImiMapPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
