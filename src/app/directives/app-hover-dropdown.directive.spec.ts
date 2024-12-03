import { ElementRef, Renderer2 } from '@angular/core';
import { HoverDropdownDirective } from './app-hover-dropdown.directive';

describe('HoverDropdownDirective', () => {
  let directive: HoverDropdownDirective;
  let mockElementRef: ElementRef;
  let mockRenderer2: Renderer2;

  beforeEach(() => {
    // Crear un mock para ElementRef
    mockElementRef = new ElementRef(document.createElement('div'));

    // Crear un mock para Renderer2
    mockRenderer2 = jasmine.createSpyObj('Renderer2', [
      'addClass',
      'removeClass',
    ]);

    // Crear la instancia del directive con los mocks
    directive = new HoverDropdownDirective(mockElementRef, mockRenderer2);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add "visible" class on mouseenter for top dropdown', () => {
    spyOn(directive as any, 'isDirectChildOfUl').and.returnValue(true);
    spyOn(directive as any, 'getDropdownContent').and.returnValue(
      document.createElement('div')
    );

    directive.onMouseEnter();

    expect(mockRenderer2.addClass).toHaveBeenCalledWith(
      jasmine.any(HTMLElement),
      'visible'
    );
  });

  it('should remove "visible" class with delay on mouseleave for top dropdown', (done) => {
    const dropdownContent = document.createElement('div');
    spyOn(directive as any, 'isDirectChildOfUl').and.returnValue(true);
    spyOn(directive as any, 'getDropdownContent').and.returnValue(
      dropdownContent
    );

    directive.onMouseEnter();
    directive.onMouseLeave();

    setTimeout(() => {
      expect(mockRenderer2.removeClass).toHaveBeenCalledWith(
        dropdownContent,
        'visible'
      );
      done();
    }, 500);
  });
});
