import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImiHistoryComponent } from './imi-history.component';

describe('ImiHistoryComponent', () => {
  let component: ImiHistoryComponent;
  let fixture: ComponentFixture<ImiHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImiHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImiHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
