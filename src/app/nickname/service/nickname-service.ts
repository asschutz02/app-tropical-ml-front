import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NicknameModel} from "../model/nickname.model";

@Injectable({
  providedIn: "root",
})
export class NicknameService {

  constructor(private http: HttpClient) {}

  public findAllNicknames(): Observable<NicknameModel[]> {
    // return this.http.get<NicknameModel[]>(`http://localhost:9096/tropical/nicknames/all`);
    return this.http.get<NicknameModel[]>(`https://tropical-ml-backend.herokuapp.com/tropical/nicknames/all`);
  }

  public createNickname(nickname: string, customerBy: string | undefined, lojista: string | undefined): Observable<void> {
    const request = {
      nickname,
      customerBy,
      lojista
    };
    // return this.http.post<void>(`http://localhost:9096/tropical/nicknames`, request);
    return this.http.post<void>(`https://tropical-ml-backend.herokuapp.com/tropical/nicknames`, request);
  }

  public editNickname(nicknameEdit: string | undefined, nickname: string | undefined,
                      customerBy: string | undefined, lojista: string | undefined): Observable<void>{
    const request = {
      nickname,
      customerBy,
      lojista
    };
    // return this.http.put<void>(`http://localhost:9096/tropical/nicknames/${nicknameEdit}`, request);
    return this.http.put<void>(`https://tropical-ml-backend.herokuapp.com/tropical/nicknames/${nicknameEdit}`, request);
  }

  public deleteNickname(nickname: string | undefined): Observable<void> {
    // return this.http.delete<void>(`http://localhost:9096/tropical/nicknames/${nickname}`);
    return this.http.delete<void>(`https://tropical-ml-backend.herokuapp.com/tropical/nicknames/${nickname}`);
  }

  public gerarRelatorio(): Observable<void> {
    // return this.http.get<void>(`http://localhost:9096/tropical/nicknames/email`);
    return this.http.get<void>(`https://tropical-ml-backend.herokuapp.com/tropical/nicknames/email`);
  }
}
