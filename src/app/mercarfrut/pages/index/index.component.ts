import {Component} from '@angular/core';

declare var MainJS: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  constructor() {
  }

  ngOnInit(): void {
    this.initScripts()
  }

  initScripts() {
    MainJS.init();
  }

}
