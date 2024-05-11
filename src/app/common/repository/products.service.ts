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
  async addProduct(product: ProductModel): Promise<void> {
    return this.productsCollection.doc(product.uuid).set({...product});
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
      return;
    }
  }

  // Update Product Data
  async updateProductData(uuid: string, newData: Partial<ProductModel>): Promise<void> {
    try {
      // Realizar la consulta para obtener el documento del producto con el uuid especificado
      const querySnapshot = await this.productsCollection.ref.where('uuid', '==', uuid).get();

      // Iterar sobre los resultados de la consulta (debería haber solo un documento)
      querySnapshot.forEach(async (doc) => {
        // Actualizar los campos del documento con los nuevos valores
        await this.productsCollection.doc(doc.id).update(newData);
      });
    } catch (error) {
      throw error;
    }
  }

  async updateInventoryInBatch(products: ProductModel[]): Promise<void> {
    try {
      const batch = this.firestore.firestore.batch();

      products.forEach(product => {
        const productRef = this.productsCollection.doc(product.uuid).ref;
        batch.update(productRef, product);
      });

      await batch.commit();
    } catch (error) {
      throw error;
    }
  }

  // Get product data by uuid
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

  // Delete Product by UUID
  async deleteProductByUUID(uuid: string): Promise<void> {
    try {
      // Realizar la consulta para obtener el documento del producto con el UUID especificado
      const querySnapshot = await this.productsCollection.ref.where('uuid', '==', uuid).get();

      // Iterar sobre los resultados de la consulta (debería haber solo un documento)
      querySnapshot.forEach(async (doc) => {
        // Eliminar el documento
        await this.productsCollection.doc(doc.id).delete();
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }


}
