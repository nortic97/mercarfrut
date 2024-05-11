import {Component} from '@angular/core';
import {LoaderServiceService, OrdersService, PaymentGatewayModel} from "../../../common";
import {map} from "rxjs";

declare var MainJS: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  public ordersList: PaymentGatewayModel[] = [];

  constructor(
    private OrderRepository: OrdersService,
    private loaderService: LoaderServiceService,
  ) {
  }

  ngOnInit(): void {
    this.getorders();
    this.initScripts();
  }

  getorders(){
    this.loaderService.display(true);
    this.OrderRepository.getAll().snapshotChanges().pipe(map(changes =>
      changes.map(c => ({
          id: c.payload.doc.id, ...c.payload.doc.data()
        })
      ))).subscribe(data => {
      this.ordersList = data;
      this.loaderService.display(false);
    });
  }

  initScripts() {
    MainJS.init();
  }

}
