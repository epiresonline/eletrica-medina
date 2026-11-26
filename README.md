# Elétrica Medina — Website Institucional de Alta Conversão

Portal institucional de alta conversão para a **Elétrica Medina** (Marcos Medina | Eletricista Profissional), atuante em serviços elétricos residenciais, comerciais e prediais em Porto Alegre e Região Metropolitana do Rio Grande do Sul.

---

## ⚡ Principais Funcionalidades

1. **Triador Inteligente e Simulador de Deslocamento em POA**:
   - Mapeamento dinâmico por bairros de Porto Alegre (Moinhos de Vento, Bela Vista, Petrópolis, Menino Deus, Centro Histórico, Bom Fim, Zona Norte, Zona Sul, etc.) e cidades da Região Metropolitana (Canoas, Gravataí, Cachoeirinha, Viamão, Alvorada).
   - Cálculo visual em tempo real de estimativa de tempo de deslocamento (ex.: *25 a 35 minutos*).
   - Seleção clara entre **Plantão de Emergência 24 Horas** e **Agendamento Regular Comercial**.
   - Coleta de aceite da taxa de urgência/deslocamento para o plantão 24h.
   - Despacho de chamado formatado diretamente para o WhatsApp oficial: `(51) 99210-8340`.

2. **Engenharia Front-end & UX de Alta Performance**:
   - **Tema Claro (`light`) como padrão soberano** com alternador nativo para **Tema Escuro (`dark`)** persistido em `localStorage`.
   - **Cabeçalho Executivo Limpo (Anti-Poluição Visual)** com Menu Hambúrguer ("3 risquinhos") acionando uma gaveta lateral (*slide-over drawer*) com navegação completa, canais sociais e contato.
   - Tipografia premium: `Outfit` (headings) e `Plus Jakarta Sans` (interface e textos).
   - Botão flutuante de WhatsApp com aviso pulsante de atendimento 24h.

3. **Conformidade com a LGPD (Lei Federal nº 13.709/2018)**:
   - Banner de cookies com três opções: *Aceitar Todos*, *Rejeitar Opcionais* e *Preferências*.
   - Modal de gestão granular de consentimento com switches não pré-marcados.
   - Botão permanente no rodapé para alteração/revogação do consentimento a qualquer instante (Art. 8º, § 5º da LGPD).
   - Páginas jurídicas dedicadas: `politica-privacidade.html` e `termos-de-uso.html`.
   - Compatibilidade com Google Tag Manager (Consent Mode v2).

4. **SEO Técnico Avançado e Dados Estruturados**:
   - Metatags geográficas para Porto Alegre (`geo.region`, `geo.position`, `ICBM`).
   - Schema.org JSON-LD estruturado para `Electrician` e `EmergencyService`.
   - Prova social em destaque: Avaliação 5.0 estrelas com 60 reviews registradas nos perfis Google e Liscom.
   - `robots.txt` e `sitemap.xml` prontos para indexação no Google Search Console.
   - Compatibilidade total com Cloudflare Pages (`wrangler.jsonc`).

---

## 📂 Estrutura de Arquivos

```text
ELETRICA-MEDINA/
├── index.html                       # Página inicial com simulador, serviços, obras e SEO
├── politica-privacidade.html        # Política de Privacidade completa (LGPD)
├── termos-de-uso.html               # Termos de Uso e Condições de Atendimento
├── robots.txt                       # Diretrizes para robôs de busca
├── sitemap.xml                      # Mapa do site indexável
├── wrangler.jsonc                   # Configuração nativa para Cloudflare Pages
├── README.md                        # Documentação do projeto
├── .gitignore                       # Ignorados pelo Git
├── css/
│   ├── style.css                    # Estilos mobile-first, variáveis claro/escuro
│   └── cookies.css                  # Estilos do banner e modal LGPD
├── js/
│   ├── main.js                      # Triagem, cálculo de deslocamento, tema e drawer
│   └── cookies.js                   # Gestão de consentimento LGPD
└── assets/
    ├── logo-eletrica-medina.png     # Logotipo oficial
    ├── obra-quadro-antes.png        # Foto real: Quadro elétrico antes de reorganização
    ├── obra-quadro-reforma.png      # Foto real: Quadro elétrico padrão DIN montado
    └── obra-perfil-led.png          # Foto real: Iluminação embutida de perfil LED
```

---

## 🚀 Como Executar Localmente

Como o projeto é 100% estático (HTML, CSS e JavaScript puros), não requer compilação ou instalação de dependências pesadas:

```powershell
# Abra o index.html diretamente no navegador ou utilize um servidor HTTP local:
npx serve ELETRICA-MEDINA
```

---

## ☁️ Deploy no Cloudflare Pages

O projeto já contém o arquivo `wrangler.jsonc`. Para publicar:

```bash
npx wrangler pages deploy ELETRICA-MEDINA --project-name=eletrica-medina
```
