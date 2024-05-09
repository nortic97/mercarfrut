import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/compat/firestore";
import {InvoiceModel} from "../models";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private readonly invoiceCollection: AngularFirestoreCollection<InvoiceModel>;

  constructor(private firestore: AngularFirestore) {
    this.invoiceCollection = this.firestore.collection('invoices');
  }

  // Create a new invoice
  async addInvoice(invoice: InvoiceModel): Promise<DocumentReference<InvoiceModel>> {
    return this.invoiceCollection.add({...invoice});
  }

  // Get all invoices list
  getAll(): AngularFirestoreCollection<InvoiceModel> {
    return this.invoiceCollection;
  }

  // Get invoice data by uuid
  async getInvoice(uuid: string): Promise<InvoiceModel | null> {
    try {
      const querySnapshot = await this.invoiceCollection.ref.where('uuid', '==', uuid).get();
      if (querySnapshot.empty) {
        return null;
      } else {
        //productData.uuid = querySnapshot.docs[0].id;
        return querySnapshot.docs[0].data() as InvoiceModel;
      }
    } catch (error) {
      return null;
    }
  }

  // Update Invoice Data
  async updateInvoice(uuid: string, aprove: boolean): Promise<void> {
    try {
      // Realizar la consulta para obtener el documento del producto con el uuid especificado
      const querySnapshot = await this.invoiceCollection.ref.where('uuid', '==', uuid).get();

      // Iterar sobre los resultados de la consulta (debería haber solo un documento)
      querySnapshot.forEach(async (doc) => {
        // Actualizar el campo cantidad del documento con el nuevo valor
        await this.invoiceCollection.doc(doc.id).update({aprove: aprove});
      });
    } catch (error) {
      return ;
    }
  }

}
