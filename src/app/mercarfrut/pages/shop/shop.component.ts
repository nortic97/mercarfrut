import { Component } from '@angular/core';
import { LoaderServiceService, PopUpsService, ProductModel, ProductsRepositoryService } from '../../../common';
import { map } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

  public productsList: ProductModel[] = [];

  constructor(
    private productsRepository: ProductsRepositoryService,
    private alert: PopUpsService,
    private loaderService: LoaderServiceService
  ) { }

  ngOnInit() {

    this.loaderService.display(true);

    this.productsRepository.getAll().snapshotChanges().pipe(map(changes =>
      changes.map(c => ({ 
        id: c.payload.doc.id, ...c.payload.doc.data()
      })
      ))).subscribe(data => {
      this.productsList = data;
      this.loaderService.display(false);
    });

  }

}
