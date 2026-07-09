import { Page } from '@playwright/test';
import { FooterComponent } from '../components/footer.component';
import { NavBarComponent } from '../components/navBar.component';

export abstract class BasePage {
  readonly navBar: NavBarComponent;
  readonly footer: FooterComponent;

  constructor(public readonly page: Page) {
    this.navBar = new NavBarComponent(this.page);
    this.footer = new FooterComponent(this.page);
  }
}
