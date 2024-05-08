import { Component } from '@angular/core';
import { LoaderServiceService } from './common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mercarfrut';

  showLoader:Boolean = true;

  constructor(private loaderService:LoaderServiceService){

  }

  ngOnInit(): void {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }

}
