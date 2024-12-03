import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverDropdown]',
})
export class HoverDropdownDirective {
  private static currentTopDropdown: HTMLElement | null = null;
  private static currentNestedDropdown: HTMLElement | null = null;

  private hideTimeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (this.isDirectChildOfUl()) {
      this.clearTimeout();
      this.showTopDropdown();
    } else {
      this.clearTimeout();
      this.showNestedDropdown();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.isDirectChildOfUl()) {
      this.hideTopDropdownWithDelay();
    } else {
      this.hideNestedDropdownWithDelay();
    }
  }

  private showTopDropdown() {
    const dropdownContent = this.getDropdownContent();
    if (!dropdownContent) return;

    if (
      HoverDropdownDirective.currentTopDropdown &&
      HoverDropdownDirective.currentTopDropdown !== dropdownContent
    ) {
      this.renderer.removeClass(
        HoverDropdownDirective.currentTopDropdown,
        'visible'
      );
    }

    HoverDropdownDirective.currentTopDropdown = dropdownContent;

    this.renderer.addClass(dropdownContent, 'visible');
  }

  private hideTopDropdownWithDelay() {
    const dropdownContent = this.getDropdownContent();
    if (!dropdownContent) return;

    this.hideTimeout = setTimeout(() => {
      this.renderer.removeClass(dropdownContent, 'visible');
      if (HoverDropdownDirective.currentTopDropdown === dropdownContent) {
        HoverDropdownDirective.currentTopDropdown = null;
      }
    }, 450);
  }

  private showNestedDropdown() {
    const dropdownContent = this.getDropdownContent();
    if (!dropdownContent) return;

    if (
      HoverDropdownDirective.currentNestedDropdown &&
      HoverDropdownDirective.currentNestedDropdown !== dropdownContent
    ) {
      this.renderer.removeClass(
        HoverDropdownDirective.currentNestedDropdown,
        'visible'
      );
    }

    HoverDropdownDirective.currentNestedDropdown = dropdownContent;

    this.renderer.addClass(dropdownContent, 'visible');
  }

  private hideNestedDropdownWithDelay() {
    const dropdownContent = this.getDropdownContent();
    if (!dropdownContent) return;

    this.hideTimeout = setTimeout(() => {
      this.renderer.removeClass(dropdownContent, 'visible');
      if (HoverDropdownDirective.currentNestedDropdown === dropdownContent) {
        HoverDropdownDirective.currentNestedDropdown = null;
      }
    }, 450);
  }

  private clearTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private isDirectChildOfUl(): boolean {
    const parent = this.el.nativeElement.parentElement;
    return parent && parent.tagName === 'UL';
  }

  private getDropdownContent(): HTMLElement | null {
    return this.el.nativeElement.querySelector('.dropdown-content');
  }
}
