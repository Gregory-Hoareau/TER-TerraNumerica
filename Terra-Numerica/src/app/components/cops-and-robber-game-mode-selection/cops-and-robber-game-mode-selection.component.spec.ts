import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopsAndRobberGameModeSelectionComponent } from './cops-and-robber-game-mode-selection.component';

describe('CopsAndRobberGameModeSelectionComponent', () => {
  let component: CopsAndRobberGameModeSelectionComponent;
  let fixture: ComponentFixture<CopsAndRobberGameModeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopsAndRobberGameModeSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopsAndRobberGameModeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
