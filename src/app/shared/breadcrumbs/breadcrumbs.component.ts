import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
// import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {
  public titulo: string;
  // public tituloSubs$:  Subscription;

  constructor(private router: Router) {
    /**video 85 */
    this.getArgumentoRuta().subscribe(data => {
      // console.log(data);
      this.titulo = data.titulo;
      document.title = `Admin Pro - ${data.titulo}`;
    });
  }

  ngOnInit(): void {
  }

  getArgumentoRuta() {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd) => event.snapshot.data )
    )
  }
}
