/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import '@material/mwc-ripple/mwc-ripple';

import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {eventOptions, html, internalProperty, LitElement, property, query, queryAsync} from 'lit-element';

/** @soyCompatible */
export class IconButtonBase extends LitElement {
  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) icon = '';

  @property({type: String}) label = '';

  @query('button') buttonElement!: HTMLElement;

  @queryAsync('mwc-ripple') ripple!: Promise<Ripple|null>;

  @internalProperty() protected shouldRenderRipple = false;

  protected rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  protected renderRipple() {
    if (this.shouldRenderRipple) {
      return html`<mwc-ripple .disabled="${
          this.disabled}" unbounded></mwc-ripple>`;
    }
    return html``;
  }

  focus() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.startFocus();
      buttonElement.focus();
    }
  }

  blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.endFocus();
      buttonElement.blur();
    }
  }

  /** @soyCompatible */
  protected render() {
    return html`<button
        class="mdc-icon-button"
        aria-label="${this.label || this.icon}"
        ?disabled="${this.disabled}"
        @focus="${this.handleRippleFocus}"
        @blur="${this.handleRippleBlur}"
        @mousedown="${this.handleRippleActivate}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleActivate}"
        @touchend="${this.handleRippleDeactivate}"
        @touchcancel="${this.handleRippleDeactivate}">
      ${this.renderRipple()}
    <i class="material-icons">${this.icon}</i>
    <slot></slot>
  </button>`;
  }

  @eventOptions({passive: true})
  private handleRippleActivate(evt?: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(evt);
  }

  private handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  private handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  private handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  private handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  private handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
}
