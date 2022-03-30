import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SellerModel} from "../model/seller.model";

@Injectable({
  providedIn: "root",
})
export class SellerService {

  constructor(private http: HttpClient) {}

  public findAllSellers(): Observable<SellerModel[]> {
    return this.http.get<SellerModel[]>(`http://localhost:9096/tropical/sellers/all`);
  }

  public createSeller(name: string): Observable<void> {
    const request = {
      name: name.toLowerCase()
    };
    return this.http.post<void>(`http://localhost:9096/tropical/sellers`, request);
  }

  public editSeller(nameEdit: string | undefined, name: string): Observable<void>{
    const request = {
      name: name.toLowerCase()
    };
    return this.http.put<void>(`http://localhost:9096/tropical/sellers/${nameEdit}`, request);
  }

  public deleteProduct(name: string | undefined): Observable<void> {
    return this.http.delete<void>(`http://localhost:9096/tropical/sellers/${name}`);
  }
}
