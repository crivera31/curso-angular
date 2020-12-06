import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private linkTheme = document.querySelector('#theme');

  constructor() {
    // console.log('settings service init')
    const get_url = localStorage.getItem('theme') || './assets/css/colors/green.css';
    this.linkTheme.setAttribute('href',get_url);
  }

  changeTheme(theme: string) {
    const url_nueva = `./assets/css/colors/${theme}.css`;
    this.linkTheme.setAttribute('href',url_nueva);
    localStorage.setItem('theme',url_nueva);
    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    const links = document.querySelectorAll('.selector');
    links.forEach( elem => {
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const bntThemeUrl = `./assets/css/colors/${btnTheme}.css`
      const currentTheme = this.linkTheme.getAttribute('href');

      if (bntThemeUrl === currentTheme) {
        elem.classList.add('working');
      }
    })
  }
}
