# Ailson Taveira — site pessoal

Site estático (HTML, CSS e JavaScript puros). Não tem etapa de build: o que está nesta pasta é exatamente o que vai para o ar.

## Estrutura

```
index.html                  página única do site
favicon.svg                 ícone da aba
vercel.json                 configuração da Vercel (cache das imagens)
assets/
  css/tailwind.css          Tailwind 3.4.17 já compilado
  css/site.css              estilos próprios do site (cores, animações, menu)
  js/main.js                scroll, menu, palavras rotativas e mosaico de marcas
  img/retrato.webp          GIF do rosto (fundo fixo)
  img/nome.webp             GIF do nome (rodapé)
  img/og.jpg                imagem que aparece ao compartilhar o link
  img/menu/                 imagens que aparecem ao passar o mouse no menu
  img/logos/                logos em branco (prêmios, educação e marcas)
```

## Subir no GitHub

**Pelo navegador (sem instalar nada)**

1. Entre em github.com, clique em **New repository**, dê um nome (ex.: `ailson-taveira-site`) e crie.
2. Na página do repositório vazio, clique em **uploading an existing file**.
3. Arraste **o conteúdo** desta pasta (o `index.html` precisa ficar na raiz do repositório, não dentro de outra pasta).
4. Clique em **Commit changes**.

> O arquivo `.gitignore` começa com ponto e pode ficar oculto no seu computador. Ele não é obrigatório.

**Pelo terminal**

```bash
cd ailson-taveira-site
git init
git add .
git commit -m "Primeira versão do site"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ailson-taveira-site.git
git push -u origin main
```

## Publicar na Vercel

1. Entre em vercel.com com a conta do GitHub.
2. **Add New → Project** e escolha o repositório.
3. Em **Framework Preset**, escolha **Other**. Deixe **Build Command** e **Output Directory** vazios.
4. Clique em **Deploy**. Em cerca de um minuto o site fica no ar num endereço `.vercel.app`.
5. Para usar um domínio próprio: **Settings → Domains** no projeto da Vercel.

A partir daí, todo novo commit no GitHub atualiza o site automaticamente.

## Edições rápidas

- **Links das páginas Pesquisa e Desvio:** em `index.html`, procure `TROCAR LINK` (hoje apontam para endereços provisórios).
- **Marcas do mosaico:** em `assets/js/main.js`, edite a lista `BRANDS` no topo. Para usar logo, salve o PNG branco em `assets/img/logos/` e escreva `logo: 'assets/img/logos/arquivo.png'`.
- **Imagens do menu:** substitua os arquivos em `assets/img/menu/` mantendo os mesmos nomes.
- **Prêmios:** em `index.html`, cada ano é um bloco `<div data-year="...">`; copie uma `<li>` para incluir um prêmio.

> Se usar classes do Tailwind que ainda não existem no site, elas não vão funcionar, porque o CSS foi compilado só com as classes atuais. Para mudanças de layout maiores, peça uma nova compilação do `tailwind.css`.
