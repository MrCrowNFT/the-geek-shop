# The Geek Shop

<p align="center">
  <img src="frontend/public/cat-favicon.svg" alt="The Geek Shop Logo" width="100" />
</p>

**A full-stack e-commerce platform with a role-based admin dashboard.**  
Features include JWT authentication, Zustand for cart state management, Axios for API calls, dark mode, protected routes, wishlist functionality, and custom admin views.

---

## Features

- JWT Authentication
- Zustand Store for Cart Management
- Dark Mode Toggle
- Wishlist Functionality
- Protected Routes
- Role-Based Admin Dashboard
- Custom Admin Views
- RESTful API with Axios

---

## Seed the Super Admin

Use the following command to create an initial super admin:

\`\`\`bash
npm run seed
\`\`\`

---

## Testing Setup

Jest and Babel are configured to support modern JavaScript:

- \`jest.config.js\` – Jest configuration
- \`babel.config.json\` – Required since Jest doesn't support ES Modules natively
- \`babel-jest\` – Transpiles modern JavaScript for Jest compatibility

---

## Frontend

The frontend uses [shadcn/ui](https://ui.shadcn.com/) components extensively for a clean and accessible design.

---

## Tech Stack

- **Frontend:** React, TailwindCSS, Zustand, Axios, ShadCN/UI
- **Backend:** Node.js, Express, MongoDB
- **Testing:** Jest, Babel
- **Authentication:** JWT
- **Image Storage:** (Planned) AWS S3
- **Payments:** (Planned) Stripe

---

## Roadmap / TODO

- [ ] Remove unused/dead code
- [ ] Migrate backend from JavaScript to TypeScript with shared type definitions
- [ ] Deploy backend and frontend
- [ ] Expand and refine Jest tests
- [ ] Create and implement a new design style guide
- [ ] Add more product entries
- [ ] Integrate AWS S3 for product image storage
- [ ] Implement Stripe checkout on the frontend

---

## License

[MIT](LICENSE)

## Build

Run the following command to build the app:

\`\`\`bash
npm run build
\`\`\`
