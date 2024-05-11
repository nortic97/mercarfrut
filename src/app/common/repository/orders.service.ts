import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {PaymentGatewayModel} from "../models";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly ordersCollection: AngularFirestoreCollection<PaymentGatewayModel>;

  constructor(private firestore: AngularFirestore) {
    this.ordersCollection = this.firestore.collection('orders');
  }

  // Create a new product
  async addorder(order: PaymentGatewayModel): Promise<DocumentReference<PaymentGatewayModel>> {
    return this.ordersCollection.add({...order});
  }

  // Get all products list
  getAll(): AngularFirestoreCollection<PaymentGatewayModel> {
    return this.ordersCollection;
  }
}
