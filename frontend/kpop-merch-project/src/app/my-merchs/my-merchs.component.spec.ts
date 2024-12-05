import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMerchsComponent } from './my-merchs.component';

describe('MyMerchsComponent', () => {
  let component: MyMerchsComponent;
  let fixture: ComponentFixture<MyMerchsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyMerchsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyMerchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
