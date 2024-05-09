import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-thanks-page',
  templateUrl: './thanks-page.component.html',
  styleUrl: './thanks-page.component.css'
})
export class ThanksPageComponent {

  constructor(
    private router: Router,
  ) {
    sessionStorage.removeItem('totalPrice');
    sessionStorage.removeItem('invoice');
    sessionStorage.removeItem('shopCart');
    sessionStorage.removeItem('itemsShopingCart');
  }

  home(){
    this.router.navigate(['/home/store']);
  }

}
