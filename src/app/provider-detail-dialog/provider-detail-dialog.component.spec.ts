import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDetailDialogComponent } from './provider-detail-dialog.component';

describe('ProviderDetailDialogComponent', () => {
  let component: ProviderDetailDialogComponent;
  let fixture: ComponentFixture<ProviderDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderDetailDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
