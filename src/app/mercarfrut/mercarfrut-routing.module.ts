import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MercarfrutComponent} from './mercarfrut.component';
import {IndexComponent} from './pages/index/index.component';
import {AddProductComponent} from './pages/add-product/add-product.component';
import {ShopComponent} from './pages/shop/shop.component';
import {CheckoutComponent} from "./pages/checkout/checkout.component";
import {PaymentGatewayComponent} from "./pages/payment-gateway/payment-gateway.component";
import {ThanksPageComponent} from "./pages/thanks-page/thanks-page.component";
import {InventoryComponent} from "./pages/inventory/inventory.component";
import {OrdersComponent} from "./pages/orders/orders.component";
import {InvoicesComponent} from "./pages/invoices/invoices.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home/store',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: MercarfrutComponent,
    children: [
      {
        path: 'store',
        component: IndexComponent
      },
      {
        path: 'addProduct',
        component: AddProductComponent
      },
      {
        path: 'shop',
        component: ShopComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'payment',
        component: PaymentGatewayComponent
      },
      {
        path: 'thanks',
        component: ThanksPageComponent
      },
      {
        path: 'inventory',
        component: InventoryComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'invoices',
        component: InvoicesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MercarfrutRoutingModule {
}
