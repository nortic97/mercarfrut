import { Component } from '@angular/core';
import {UserModel} from "../../models";
import {Router} from "@angular/router";

declare var MainJS: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  public userModel: UserModel | null = null;
  public itemsShopingCart: number = 0;
  public totalPrice: Number = 0;
  public favorites: Number = 0;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.userModel = JSON.parse(sessionStorage.getItem('user')!) as UserModel;
    this.itemsShopingCart = Number(sessionStorage.getItem('itemsShopingCart') || 0);
    this.totalPrice = Number(sessionStorage.getItem('totalPrice') || 0);
    this.favorites = Number(sessionStorage.getItem('favorites') || 0);
    this.initScript();
  }

  logOut(): void {
    sessionStorage.clear();
    localStorage.clear();
    location.reload();
  }

  initScript(){
    MainJS.init();
  }

}
