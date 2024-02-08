Projeto de uma rede social de vídeos fullstack utilizando [Next.js](https://nextjs.org/) estilizado com o  [Tailwind](https://tailwindcss.com) e [Prisma ORM](https://www.prisma.io) de backend.

## Primeiros passos
### Requisitos
- Ter instalado [Node js](https://nextjs.org/):
- No terminal, digite:

```bash
git clone https://github.com/Icarobernard/difinitylab-video-upload.git
```
Após isso, digite uma única vez para configurar:
```bash
cd difinitylab-video-upload
npm install
npx prisma migrate dev --name <nome_da_migracao>
npx prisma generate
```
Para rodar a aplicação digite
```bash
npm run dev
```
abra  [http://localhost:3000](http://localhost:3000) com o seu navegador para ver o resultado


## Aprenda mais


- [Documentação Next.js](https://nextjs.org/docs) - Aprenda mais sobre Next.js.
- [Tutorial de Next](https://nextjs.org/learn) - Um tutorial interativo Next.js.

## Deploy na Vercel

Para o deploy do sistema foi utilizado [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.