import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductModel} from "../model/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {

  constructor(private http: HttpClient) {}

  public findAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`http://localhost:9096/tropical/products/all`);
  }

  public createProduct(name: string, price: number): Observable<void> {
    const request = {
      name,
      price
    };
    return this.http.post<void>(`http://localhost:9096/tropical/products`, request);
  }

  public editProduct(nameEdit: string | undefined, name: string, price: string): Observable<void>{
    const request = {
      name,
      price
    };
    return this.http.put<void>(`http://localhost:9096/tropical/products/${nameEdit}`, request);
  }

  public deleteProduct(name: string | undefined): Observable<void> {
    return this.http.delete<void>(`http://localhost:9096/tropical/products/${name}`);
  }
}
