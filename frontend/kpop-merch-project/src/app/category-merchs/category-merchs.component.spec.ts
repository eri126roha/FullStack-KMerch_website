import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryMerchsComponent } from './category-merchs.component';

describe('CategoryMerchsComponent', () => {
  let component: CategoryMerchsComponent;
  let fixture: ComponentFixture<CategoryMerchsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryMerchsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryMerchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
