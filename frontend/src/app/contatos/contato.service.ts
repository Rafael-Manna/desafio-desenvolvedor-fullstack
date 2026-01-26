import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private apiUrl = 'http://localhost:5100/api/contatos';

  constructor(private http: HttpClient) { }

  getContatos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createContato(contato: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, contato);
  }

  // DESAFIO 7: Atualização enviando ID na URL
  updateContato(id: number, contato: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, contato);
  }

  deleteContato(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}