import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HeaderService {

  constructor(private http: HttpClient) {}

  public gerarRelatorio(): Observable<void> {
    return this.http.get<void>(`http://localhost:9096/tropical/relatorio`);
  }

}
