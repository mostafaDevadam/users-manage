import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detials } from './detials';

describe('Detials', () => {
  let component: Detials;
  let fixture: ComponentFixture<Detials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
