import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestD3jsComponent } from './test-d3js.component';

describe('TestD3jsComponent', () => {
  let component: TestD3jsComponent;
  let fixture: ComponentFixture<TestD3jsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestD3jsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestD3jsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
