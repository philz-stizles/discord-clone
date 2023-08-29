# Discord Clone

## Table of contents

1. [Next Features](#1-next-features)
2. [Technologies](#2-technologies)
3. [Create Next App](#3-create-next-app)
4. [Stop In-use PORT](#4-stop-in-use-port)
5. [Run Project](#run-project)
6. [TypeScript](#typescript)
7. [Icons using lucide-react](#icons-using-lucide-react-read-docs)
8. [Build components using shadcn/ui](#build-components-using-shadcn-ui-read-docs)
9. [Authentication using Clerk.js & Prisma](https://clerk.com/docs/nextjs/get-started-with-nextjs)
10. [Modal State Management using zustand](#modal-state-management-using-zustand)
11. [Forms using shadcn/ui Form](#forms-using-react-hook-form)
12. [Notifications using React Hot Toast](#notifications-using-react-hot-toast)
13. [MySQL Database on the cloud using PlanetScale](#mysql-database-on-the-cloud-using-planetscale-read-docs)
14. [ORM using Prisma with MySQL Database](#orm-using-prisma-with-mysql-database-read-docs)
15. [File Upload using React Dropzone | ](#password-hash-using-bcrypt)
16. [Social Authentication with Github](#social-authentication-with-github)
18. [Testing Using Jest](#testing-using-jest)
19. [Server-side Rendering(SSR)](#server-side-rendering)

### 1 Next Features

### 2 Technologies

    Next.js 13
    Styling & Design => Tailwindcss shadcn/ui
    Database  => MySQL PlanetScale Prism
    Authentication => Clerk
    Zustand

### MySQL Database on the cloud using PlanetScale ([Read Docs](https://planetscale.com/docs))

### ORM using Prisma with MySQL Database ([Read Docs](https://planetscale.com/docs))

Installation:

    npm install prisma

VSCode Extension: Prisma

Initialize:

    npx prisma init

Update ".env"

    DATABASE_URL="mongodb://127.0.0.1:27017/airbnb"

Generate prisma models

    npx prisma generate

Create Models & Run Migration

    npx prisma db push

Delete Database

    npx prisma migrate reset

### Build components using shadcn/ui ([Read Docs](https://ui.shadcn.com/docs/installation/next))

- Installation:

`npx shadcn-ui@latest init`

- Add Components:

`npx shadcn-ui@latest add avatar badge button command dialog dropdown-menu popover separator alert dropdown-menu checkbox select toast`

### Forms using Shadcn UI | React Hook Form | Zod | Hook Form Resolvers

`npx shadcn-ui@latest add form input label`
`npm i react-hook-form zod @hookform/resolvers`

### ThemeProvider using Shadcn UI | Next Themes[](https://ui.shadcn.com/docs/dark-mode/next):

### Icons using lucide-react([Read Docs]())

    npm i lucide-react

Authentication using Clerk ([Read Docs](https://clerk.com/docs/nextjs/get-started-with-nextjs))

    npm install @clerk/nextjs

### File Upload using React Dropzone & Uploadthing

`npm i uploadthing @uploadthing/react react-dropzone`

npm install --save-dev cypress start-server-and-test

{
  "scripts": {
    
    "cypress": "cypress open"
  }
}
