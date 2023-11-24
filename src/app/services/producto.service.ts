import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private endpoint = "http://localhost:5020/api/TProductoes"
  constructor(private http:HttpClient) { }

  List():Observable<Producto[]>{
    return this.http.get<Producto[]>(this.endpoint)
  }

  Update( est_Id:number, model:Producto):Observable<Producto>{
    return this.http.put<Producto>(`${this.endpoint}/${est_Id}`, model)
  }

  Create( model:Producto):Observable<Producto>{
    return this.http.post<Producto>(this.endpoint, model)
  }
  
  Delete( est_Id:number):Observable<void>{
    return this.http.delete<void>(`${this.endpoint}/${est_Id}`)
  }


}
