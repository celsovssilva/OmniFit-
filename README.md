# OmniFit 🏋️‍♂️🥗

O **OmniFit** é uma plataforma completa de gestão de saúde, fitness e acompanhamento nutricional. O sistema conecta três perfis principais de utilizadores — Alunos, Nutricionistas e Personal Trainers — permitindo a criação de treinos personalizados, planos alimentares detalhados e o registo de avaliações físicas e medidas corporais. O projeto está dividido numa arquitetura moderna com um backend em Java e um frontend SPA (Single Page Application) em TypeScript.

---

## 🛠️ Tecnologias e Créditos Open Source

Este projeto foi construído apoiando-se no ecossistema de ferramentas e bibliotecas de código aberto, às quais deixo os meus créditos:

**Backend (Java 17+)**:

* **Spring Boot**: Framework principal responsável por toda a infraestrutura da API REST e injeção de dependências.


* **Spring Security & JWT**: Para o controlo de acesso rigoroso baseado em tokens (`TokenService`, `SecurityFilter`, `SecurityConfig`).


* **Spring Data JPA / Hibernate**: Para o mapeamento objeto-relacional (ORM) e comunicação fluida com a base de dados PostgreSQL.


* **OpenPDF**: Utilizado para a geração dinâmica e exportação de relatórios em PDF (como os planos alimentares).
* **Maven**: Gestor de dependências e automação de builds (`pom.xml`).



**Frontend (Angular)**:

* **Angular & Angular CLI**: Framework robusto para a construção de toda a interface de utilizador estruturada em componentes (`dashboard/aluno`, `dashboard/nutri`, `dashboard/personal`).


* **RxJS**: Para a manipulação de fluxos assíncronos e chamadas HTTP reativas.


* **TypeScript**: Adicionando tipagem estática e segurança ao JavaScript moderno.



---

## 🚀 Meus Pontos de Evolução

Durante a construção do OmniFit, enfrentei e superei diversos desafios arquiteturais e lógicos que consolidaram o meu perfil como Engenheiro de Software. Os meus principais pontos de evolução incluem:

### 1. Domínio de Mapeamento Relacional e JPA (O Desafio das Coleções)

Evoluí significativamente na compreensão de como bases de dados relacionais lidam com listas de objetos. Ultrapassei o erro de tentar mapear coleções básicas (DTOs) diretamente para a base de dados, aprendendo a desenhar entidades separadas (como `Refeicoes`) e aplicando relacionamentos complexos com `@OneToMany(cascade = CascadeType.ALL)` para garantir a persistência em cascata de forma correta e limpa.

### 2. Arquitetura de Comunicação REST (Frontend vs. Backend)

Aperfeiçoei a sincronização entre o Angular e o Spring Boot. Aprendi a estruturar o tráfego de dados utilizando o padrão DTO (através de `Records` no Java, como `DietaRequest` e `DietaResponse`), garantindo que o JSON enviado pelo frontend faz *match* perfeito com os atributos esperados pela API. Também entendi como delegar a identificação de utilizadores ao `SecurityContextHolder` no backend, limpando as rotas HTTP no frontend e tornando o sistema mais seguro.

### 3. Spring Security Avançado e Interceptors

Saí da configuração básica de segurança para um modelo real. Consegui diagnosticar e resolver falhas de CORS e erros `403 Forbidden`, alinhando os `requestMatchers` no backend com o envio do token JWT via HTTP Interceptors (`auth.guard.ts`, `interceptor.ts`) no Angular. Construí um sistema onde o perfil do utilizador (Nutri, Personal, Aluno) dita perfeitamente as suas permissões.

### 4. Visão Sistémica e Engenharia de Software

Consolidei a capacidade de pensar no software como um todo. Desde a modelagem inicial da arquitetura em diagramas C4 (usando draw.io) até à implementação prática de lógicas complexas, como a geração e o download de documentos PDF injetando dados extraídos dinamicamente da base de dados. O meu código passou a ser muito mais focado na escalabilidade, segurança e experiência do utilizador.
