import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchlistComponent } from './merchlist.component';

describe('MerchlistComponent', () => {
  let component: MerchlistComponent;
  let fixture: ComponentFixture<MerchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MerchlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
