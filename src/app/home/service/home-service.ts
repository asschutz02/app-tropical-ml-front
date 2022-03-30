import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HomeService {

  constructor(private http: HttpClient) {}

  public buscarProduto(name: string, price: number): Observable<void>{
    return this.http.get<void>(`http://localhost:9096/tropical/search/${name}/price/${price}`)
  }
}
