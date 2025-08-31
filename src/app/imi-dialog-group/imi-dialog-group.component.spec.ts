import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImiDialogGroupComponent } from './imi-dialog-group.component';

describe('ImiDialogGroupComponent', () => {
  let component: ImiDialogGroupComponent;
  let fixture: ComponentFixture<ImiDialogGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImiDialogGroupComponent]
    });
    fixture = TestBed.createComponent(ImiDialogGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
