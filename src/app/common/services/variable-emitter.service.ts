import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VariableEmitterService {

  private itemsShopingCartShare = new BehaviorSubject<number>(0);
  private totalPriceShare = new BehaviorSubject<number>(0);

  itemsShopingCart = this.itemsShopingCartShare.asObservable();
  totalPrice = this.totalPriceShare.asObservable();

  updateItemsShopingCart(value: number) {
    this.itemsShopingCartShare.next(value);
  }

  updatetotalPrice(value: number) {
    this.totalPriceShare.next(value);
  }
}
