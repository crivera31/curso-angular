import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  // styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  public linkTheme = document.querySelector('#theme');
  constructor() { }

  ngOnInit(): void {
    const get_url = localStorage.getItem('theme') || './assets/css/colors/green.css';
    this.linkTheme.setAttribute('href',get_url);
  }

}
