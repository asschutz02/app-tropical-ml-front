import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {LojistaModel} from "../model/lojista.model";

@Injectable({
  providedIn: "root",
})
export class LojistaService {

  constructor(private http: HttpClient) {}

  public findAllLojista(): Observable<LojistaModel[]> {
    return this.http.get<LojistaModel[]>(`http://localhost:9096/tropical/lojista/all`);
  }

  public createLojista(lojista: string): Observable<void> {
    const request = {
      lojista: lojista.toLowerCase()
    };
    return this.http.post<void>(`http://localhost:9096/tropical/lojista`, request);
  }

  public editLojista(lojistaEdit: string | undefined, lojista: string): Observable<void>{
    const request = {
      lojista: lojista.toLowerCase()
    };
    return this.http.put<void>(`http://localhost:9096/tropical/lojista/${lojistaEdit}`, request);
  }

  public deleteLojista(lojista: string | undefined): Observable<void> {
    return this.http.delete<void>(`http://localhost:9096/tropical/lojista/${lojista}`);
  }
}
