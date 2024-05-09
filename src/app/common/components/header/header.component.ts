import { Component } from '@angular/core';
import {UserModel} from "../../models";
import {Router} from "@angular/router";
import {VariableEmitterService} from "../../services";

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

  constructor(
    private router: Router,
    private variableEmitterService: VariableEmitterService,
  ) {
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.userModel = JSON.parse(sessionStorage.getItem('user')!) as UserModel;
      this.itemsShopingCart = Number(sessionStorage.getItem('itemsShopingCart') || 0);
      this.totalPrice = Number(sessionStorage.getItem('totalPrice') || 0);
      this.favorites = Number(sessionStorage.getItem('favorites') || 0);
    },200)

    this.initUpdateItemsShopingCart();
    this.initUpdateTotalPrice();
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

  initUpdateItemsShopingCart(){
    this.variableEmitterService.itemsShopingCart.subscribe((valor) => {
      this.itemsShopingCart = valor;
    });
  }

  initUpdateTotalPrice() {
    this.variableEmitterService.totalPrice.subscribe((valor) => {
      this.totalPrice = valor;
    });
  }

}
