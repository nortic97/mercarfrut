import { Component } from '@angular/core';

declare var MainJS: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  ngOnInit(): void {
    this.initScripts()
  }

  initScripts(): void {
    MainJS.init();
  }

}
