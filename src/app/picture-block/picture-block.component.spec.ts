import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureBlockComponent } from './picture-block.component';

describe('PictureBlockComponent', () => {
  let component: PictureBlockComponent;
  let fixture: ComponentFixture<PictureBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
