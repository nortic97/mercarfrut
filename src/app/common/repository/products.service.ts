import {Injectable} from '@angular/core';
import {ProductModel} from '../models';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductsRepositoryService {

  private readonly productsCollection: AngularFirestoreCollection<ProductModel>;

  constructor(private firestore: AngularFirestore) {
    this.productsCollection = this.firestore.collection('products');
  }

  // Create a new product
  async addProduct(product: ProductModel): Promise<DocumentReference<ProductModel>> {
    return this.productsCollection.add({...product});
  }

  // Get all products list
  getAll(): AngularFirestoreCollection<ProductModel> {
    return this.productsCollection;
  }

  // Update Product Data
  async updateProductQuantity(uuid: string, newQuantity: number): Promise<void> {
    try {
      // Realizar la consulta para obtener el documento del producto con el uuid especificado
      const querySnapshot = await this.productsCollection.ref.where('uuid', '==', uuid).get();

      // Iterar sobre los resultados de la consulta (debería haber solo un documento)
      querySnapshot.forEach(async (doc) => {
        // Actualizar el campo cantidad del documento con el nuevo valor
        await this.productsCollection.doc(doc.id).update({cantidad: newQuantity});
      });
    } catch (error) {
      return ;
    }
  }

  // Get user data by email
  async getProduct(uuid: string): Promise<ProductModel | null> {
    try {
      const querySnapshot = await this.productsCollection.ref.where('uuid', '==', uuid).get();
      if (querySnapshot.empty) {
        return null;
      } else {
        //productData.uuid = querySnapshot.docs[0].id;
        return querySnapshot.docs[0].data() as ProductModel;
      }
    } catch (error) {
      return null;
    }
  }


}
