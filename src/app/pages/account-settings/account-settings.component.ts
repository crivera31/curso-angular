import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public linkTheme = document.querySelector('#theme');
  constructor() { }

  ngOnInit(): void {
  }

  changeTheme(theme: string) {
    
    const url_nueva = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href',url_nueva);
    localStorage.setItem('theme',url_nueva);
  }

}
