This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

lms-app/
├── app/ # Next.js app directory
│ ├── (auth)/ # Route group cho Auth
│ │ ├── login/
│ │ ├── register/
│ │ └── layout.tsx
│ ├── (dashboard)/ # Route group cho Dashboard
│ │ ├── courses/
│ │ ├── students/
│ │ └── layout.tsx
│ ├── page.tsx # Landing page
│ └── layout.tsx # Root layout
│
├── modules/ # Tổ chức theo domain (feature-based)
│ ├── todo/
│ │ ├── api/ # React Query hooks + Axios calls
│ │ │ ├── queries.ts
| | | |── mutations.ts
│ │ │ └── todoRespository.ts
│ │ ├── components/ # UI components riêng cho Course
│ │ ├── store/ # Zustand store cho Course
│ │ ├── hooks/ # Custom hooks useCourse
│ │ └── types/ # Kiểu dữ liệu cho Course
│ ├── auth/
│ ├── student/
│ └── ...
│── lib/
│ ├── axiosClient.ts # Config Axios (interceptors, baseURL)
│ ├── supabaseClient.ts # Supabase init
│ └── queryClient.ts # React Query client config
├── constants/ # App-wide constants (centralized)
│ ├── roles.ts # USER_ROLES (STUDENT, INSTRUCTOR, ADMIN)
│ ├── routes.ts # App route paths
│ ├── permissions.ts
│ └── index.ts # Barrel exports
├── shared/ # Chia sẻ giữa nhiều modules
│ ├── store/ # Global Zustand stores (auth, theme)
│ ├── constants/ # Routes, roles, enums
│ ├── utils/ # Hàm helper
│ ├── hooks/ # Hooks dùng chung (useDebounce, useTheme...)
│ ├── hoc/ # Higher Order Components (withAuth, withLayout)
│ └── ui/ # Shared UI components (Form, Layout, Loader)
│
├── theme/ # Global styles + theme config
│ ├── globals.css
│ ├── createTheme.ts # MUI theme setup
│
├── config/ # Config app (env, constants, feature flags)
│ ├── env.ts
│ └── index.ts
│
├── types/ # Global typescript types
│ └── global.d.ts
│
├── public/ # Static assets
│
├── next.config.js
├── tsconfig.json
└── package.json
