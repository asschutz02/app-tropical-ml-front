import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductModel} from "../model/product.model";

let headersReq = new HttpHeaders({
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Origin': '*'
});

@Injectable({
  providedIn: "root",
})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  public findAllProducts(): Observable<ProductModel[]> {
    // return this.http.get<ProductModel[]>(`http://localhost:9096/tropical/products/all`);
    return this.http.get<ProductModel[]>(`https://tropical-ml-backend.herokuapp.com/tropical/products/all`);
  }

  public createProduct(name: string, price: number): Observable<void> {
    const request = {
      name,
      price
    };
    return this.http.post<void>(`http://localhost:9096/tropical/products`, request);
    // return this.http.post<void>(`https://tropical-ml-backend.herokuapp.com/tropical/products`, request);
  }

  public editProduct(nameEdit: string | undefined, name: string, price: string): Observable<void> {
    const request = {
      name,
      price
    };
    return this.http.put<void>(`http://localhost:9096/tropical/products/${nameEdit}`, request);
    // return this.http.put<void>(`https://tropical-ml-backend.herokuapp.com/tropical/products/${nameEdit}`, request);
  }

  public deleteProduct(name: string | undefined): Observable<void> {
    // return this.http.delete<void>(`http://localhost:9096/tropical/products/${name}`);
    return this.http.delete<void>(`https://tropical-ml-backend.herokuapp.com/tropical/products/${name}`);
  }

  public gerarRelatorio(): Observable<void> {
    // return this.http.get<void>(`http://localhost:9096/tropical/products/email`);
    return this.http.get<void>(`https://tropical-ml-backend.herokuapp.com/tropical/products/email`);
  }
}
