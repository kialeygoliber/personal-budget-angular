import { Component } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HeroComponent } from './hero/hero.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ArticleComponent } from './article/article.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'pb-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MenuComponent,
    HeroComponent,
    FooterComponent,
    HomepageComponent,
    ArticleComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'personal-budget';
}
