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
  // Injeta as ferramentas necessárias: HttpClient para chamadas API e ChangeDetectorRef para atualizar a tela
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  
  // URL base que aponta para o seu Controller C#
  readonly apiUrl = 'http://localhost:5100/api/contatos';

  // Gerenciamento de Listas: Original (do banco), Filtrada (pela busca) e Paginada (exibição atual)
  contatosOriginal: any[] = [];
  contatosFiltrados: any[] = [];
  contatosPaginados: any[] = [];

  // Objeto que armazena os dados do formulário (vinculado via ngModel no HTML)
  contato: any = { nome: '', email: '', telefone: '', dataNascimento: '', observacoes: '' };
  termoBusca: string = ''; // Texto digitado no campo de pesquisa
  editando = false;        // Controle para saber se o botão Salvar deve Criar ou Atualizar

  // Variáveis para o controle da paginação no rodapé da tabela
  paginaAtual = 1;
  itensPorPagina = 5;
  totalPaginas = 1;

  // Ciclo de vida: Assim que o componente nasce, ele chama a lista de contatos
  ngOnInit() { this.listar(); }

  // 1. BUSCAR DADOS: Chama o [HttpGet] do seu C# via Dapper
  listar() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.contatosOriginal = res || []; // Guarda a lista bruta que veio do banco
        this.filtrar();                   // Aplica filtros e paginação logo após carregar
        this.cdr.detectChanges();         // Força a interface a se atualizar com os novos dados
      },
      error: (err) => console.error('Erro API:', err)
    });
  }

  // 2. FILTRAR: Realiza a busca local por Nome ou Email (sem precisar ir no banco novamente)
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
    this.paginaAtual = 1;      // Reseta para a primeira página após filtrar
    this.atualizarPagina();    // Recalcula quais itens aparecem na tela
  }

  // 3. PAGINAÇÃO: Calcula quais contatos aparecem baseados na página atual
  atualizarPagina() {
    this.totalPaginas = Math.ceil(this.contatosFiltrados.length / this.itensPorPagina) || 1;
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.contatosPaginados = this.contatosFiltrados.slice(inicio, fim); // Pega apenas a "fatia" da página
  }

  // Navegação entre páginas (Próximo/Anterior)
  mudarPagina(direcao: number) {
    this.paginaAtual += direcao;
    this.atualizarPagina();
  }

  // 4. SALVAR: Decide se chama o [HttpPost] ou [HttpPut("{id}")] do seu C#
  salvar() {
    // Garante que se a data estiver vazia, envie NULL (evita erro de data zerada no SQL)
    const payload = { ...this.contato, dataNascimento: this.contato.dataNascimento || null };
    
    if (this.editando) {
      // Pega o ID (suporta minúsculo do JS ou Maiúsculo do C# via Dapper)
      const id = this.contato.idPessoa || this.contato.IdPessoa;
      this.http.put(`${this.apiUrl}/${id}`, payload).subscribe(() => this.limpar());
    } else {
      this.http.post(this.apiUrl, payload).subscribe(() => this.limpar());
    }
  }

  // 5. EDITAR: Joga o contato da tabela de volta para o formulário no topo
  prepararEdicao(c: any) {
    this.editando = true;
    const dataStr = c.dataNascimento || c.DataNascimento;
    // Formata a data para YYYY-MM-DD para o campo <input type="date"> entender
    this.contato = { ...c, dataNascimento: dataStr ? dataStr.split('T')[0] : '' };
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela suavemente para o formulário
  }

  // 6. EXCLUIR: Chama o [HttpDelete("{id}")] do seu C#
  excluir(id: number) {
    if (confirm('Deseja realmente excluir este contato?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.listar());
    }
  }

  // Limpa o formulário e recarrega a lista original
  limpar() {
    this.editando = false;
    this.contato = { nome: '', email: '', telefone: '', dataNascimento: '', observacoes: '' };
    this.termoBusca = '';
    this.listar();
  }
}