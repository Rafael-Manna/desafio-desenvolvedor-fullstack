import { Component } from '@angular/core';
import { ContatosComponent } from './contatos/contatos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContatosComponent],
  template: '<app-contatos></app-contatos>'
})
export class AppComponent { }