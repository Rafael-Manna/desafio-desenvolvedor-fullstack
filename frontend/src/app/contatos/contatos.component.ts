import { Component, OnInit } from '@angular/core';
import { ContatoService } from './contato.service';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit {
  contatos: any[] = [];
  contatosFiltrados: any[] = [];
  termoPesquisa: string = '';
  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  editando: boolean = false;
  novoContato: any = this.resetObjeto();

  constructor(private contatoService: ContatoService) { }

  ngOnInit() { this.listar(); }

  listar() {
    this.contatoService.getContatos().subscribe(res => {
      this.contatos = res;
      this.filtrar();
    });
  }

  filtrar() {
    this.contatosFiltrados = this.contatos.filter(c => 
      c.nome.toLowerCase().includes(this.termoPesquisa.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(this.termoPesquisa.toLowerCase()))
    );
    this.paginaAtual = 1;
  }

  get contatosExibidos() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.contatosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas() { return Math.ceil(this.contatosFiltrados.length / this.itensPorPagina); }

  salvar() {
    // CORREÇÃO DO ERRO SQLDATETIME: Se a data estiver vazia, enviamos uma data mínima válida para o SQL
    if (!this.novoContato.dataNascimento || this.novoContato.dataNascimento === "") {
      this.novoContato.dataNascimento = "1753-01-01"; 
    }

    if (this.editando) {
      this.contatoService.updateContato(this.novoContato.idPessoa, this.novoContato).subscribe(() => this.finalizar());
    } else {
      this.contatoService.createContato(this.novoContato).subscribe(() => this.finalizar());
    }
  }

  editar(contato: any) {
    this.editando = true;
    // Copia o objeto para o formulário, incluindo o idPessoa e observacoes
    this.novoContato = { ...contato }; 
    if (this.novoContato.dataNascimento) {
      this.novoContato.dataNascimento = this.novoContato.dataNascimento.split('T')[0];
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  excluir(id: number) {
    if (confirm('Deseja excluir?')) {
      this.contatoService.deleteContato(id).subscribe(() => this.listar());
    }
  }

  cancelarEdicao() {
    this.editando = false;
    this.novoContato = this.resetObjeto();
  }

  private finalizar() {
    this.cancelarEdicao();
    this.listar();
  }

  private resetObjeto() {
    return { nome: '', telefone: '', email: '', observacoes: '', dataNascimento: '' };
  }
}