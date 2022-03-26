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
    return this.http.get<NicknameModel[]>(`http://localhost:9096/tropical/nicknames/all`);
  }

  public createNickname(nickname: string, customerBy: string): Observable<void> {
    const request = {
      nickname,
      customerBy
    };
    return this.http.post<void>(`http://localhost:9096/tropical/nicknames`, request);
  }

  public editNickname(nicknameEdit: string | undefined, nickname: string, customerBy: string): Observable<void>{
    const request = {
      nickname,
      customerBy
    };
    return this.http.put<void>(`http://localhost:9096/tropical/nicknames/${nicknameEdit}`, request);
  }

  public deleteNickname(nickname: string | undefined): Observable<void> {
    return this.http.delete<void>(`http://localhost:9096/tropical/nicknames/${nickname}`);
  }

}
