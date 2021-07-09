import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImiVarsComponent } from './imi-vars.component';

describe('ImiVarsComponent', () => {
  let component: ImiVarsComponent;
  let fixture: ComponentFixture<ImiVarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImiVarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImiVarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
