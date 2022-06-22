import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductModel} from "../../products/model/product.model";

@Injectable({
  providedIn: "root",
})
export class HeaderService {

  constructor(private http: HttpClient) {}

  public gerarRelatorio(request: ProductModel[]): Observable<void> {
    // return this.http.patch<void>(`http://localhost:9096/tropical/relatorio`, request);
    return this.http.patch<void>(`https://tropical-ml-backend.herokuapp.com/tropical/relatorio`, request);
    // return this.http.patch<void>(`/api/tropical/relatorio`, request);
    // https://tropical-ml-backend.herokuapp.com/
  }
}
