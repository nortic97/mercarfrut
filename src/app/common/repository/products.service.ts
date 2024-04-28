import { Injectable } from '@angular/core';
import { ProductModel } from '../models';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductsRepositoryService {

  private productsCollection: AngularFirestoreCollection<ProductModel>;

  constructor(private firestore: AngularFirestore) {
    this.productsCollection = this.firestore.collection('products');
  }

  // Create a new product
  async addProduct(product: ProductModel): Promise<DocumentReference<ProductModel>> {
    return this.productsCollection.add({ ... product });
  }

  // Get all products list
  getAll(): AngularFirestoreCollection<ProductModel> {
    return this.productsCollection;
  }
}
