import {Component} from '@angular/core';

declare var MainJS: any;

@Component({
  selector: 'app-mercarfrut',
  templateUrl: './mercarfrut.component.html',
  styleUrl: './mercarfrut.component.css'
})
export class MercarfrutComponent {

  ngOnInit(): void {
    this.initScripts()
  }

  initScripts(): void {
    MainJS.init();
  }

}
