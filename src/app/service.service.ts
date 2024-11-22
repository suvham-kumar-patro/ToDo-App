import { Injectable, IterableDiffers } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import ITodo from './model/list';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl= 'http://localhost:3000/api/todos';

  constructor(private http: HttpClient) { }

  getData(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${this.apiUrl}`);
  }
   
  getDatabyId(id:string): Observable<ITodo> {
    return this.http.get<ITodo>(`${this.apiUrl}/${id}`);
  }

  // postData(data: object): Observable<any> {
  //   return this.http.post(`${this.apiUrl}`, data);
  // }
  
  postData(ITodo: Omit<ITodo, '_id'|'completed'|'__v'>) {
    return this.http.post<ITodo>(`${this.apiUrl}`, ITodo, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

  
  updateData(ITodo: Omit<ITodo, '_id'|'__v'|'name'>, id: string) {
    return this.http.patch<ITodo>(
        `${this.apiUrl}/${id}`,
        ITodo,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
  }

  deleteDatabyId(id:string){
    return this.http.delete<{}>(`${this.apiUrl}/${id}`);
  }
}
