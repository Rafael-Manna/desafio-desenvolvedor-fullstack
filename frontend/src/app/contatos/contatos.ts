import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contatos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contatos.html',
  styleUrls: ['./contatos.css']
})
export class ContatosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  readonly apiUrl = 'http://localhost:5100/api/contatos';

  contatosOriginal: any[] = [];
  contatosFiltrados: any[] = [];
  contatosPaginados: any[] = [];

  contato: any = { nome: '', email: '', telefone: '', dataNascimento: '', observacoes: '' };
  termoBusca: string = '';
  editando = false;

  paginaAtual = 1;
  itensPorPagina = 5;
  totalPaginas = 1;

  ngOnInit() { this.listar(); }

  listar() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.contatosOriginal = res || [];
        this.filtrar();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro API:', err)
    });
  }

  filtrar() {
    const termo = (this.termoBusca || '').toLowerCase().trim();
    if (!termo) {
      this.contatosFiltrados = [...this.contatosOriginal];
    } else {
      this.contatosFiltrados = this.contatosOriginal.filter(c => 
        (c.nome || c.Nome || '').toLowerCase().includes(termo) ||
        (c.email || c.Email || '').toLowerCase().includes(termo)
      );
    }
    this.paginaAtual = 1;
    this.atualizarPagina();
  }

  atualizarPagina() {
    this.totalPaginas = Math.ceil(this.contatosFiltrados.length / this.itensPorPagina) || 1;
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.contatosPaginados = this.contatosFiltrados.slice(inicio, fim);
  }

  mudarPagina(direcao: number) {
    this.paginaAtual += direcao;
    this.atualizarPagina();
  }

  salvar() {
    const payload = { ...this.contato, dataNascimento: this.contato.dataNascimento || null };
    if (this.editando) {
      const id = this.contato.idPessoa || this.contato.IdPessoa;
      this.http.put(`${this.apiUrl}/${id}`, payload).subscribe(() => this.limpar());
    } else {
      this.http.post(this.apiUrl, payload).subscribe(() => this.limpar());
    }
  }

  prepararEdicao(c: any) {
    this.editando = true;
    const dataStr = c.dataNascimento || c.DataNascimento;
    this.contato = { ...c, dataNascimento: dataStr ? dataStr.split('T')[0] : '' };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir este contato?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.listar());
    }
  }

  limpar() {
    this.editando = false;
    this.contato = { nome: '', email: '', telefone: '', dataNascimento: '', observacoes: '' };
    this.termoBusca = '';
    this.listar();
  }
}