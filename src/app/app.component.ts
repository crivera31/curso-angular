import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'curso-angular';
  public titulo: string;

  constructor(private router: Router) {
    this.getArgumentoRuta().subscribe(data => {
      // console.log(data);
      this.titulo = data.titulo;
      document.title = `Admin Pro - ${data.titulo}`;
    });
  }
  getArgumentoRuta() {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd) => event.snapshot.data )
    )
  }
}
