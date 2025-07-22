# Fin-Reporter: Professional Portfolio & Resume Site

A modern, modular, and beautiful portfolio/resume web app built with Next.js 13+, Supabase, and Tailwind CSS. Easily showcase your projects, achievements, and technical deep-dives with rich markdown, math, and code support.

---

## 🚀 Features
- Modular project detail pages (objective, achievements, technologies, theory, technical deep dive, challenges, review, future improvements)
- Markdown editing with math (KaTeX), code, and image support
- Admin-only project creation and editing
- Responsive, resume-like layout
- Supabase backend for project data
- Syntax highlighting for code snippets
- Table of contents, smooth scrolling, and more

---

## 🛠️ Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/fin-reporter.git
cd fin-reporter/fin-reporter
```

### 2. **Create Your Own GitHub Repository & Push**
1. Go to [GitHub](https://github.com/) and create a **new repository** (e.g., `my-portfolio`)
2. Remove the existing git remote:
   ```bash
   git remote remove origin
   ```
3. Add your new repository as the remote:
   ```bash
   git remote add origin https://github.com/YOUR_BROTHER_USERNAME/my-portfolio.git
   ```
4. Push all code to your new repository:
   ```bash
   git push -u origin main
   ```

### 3. **Install Dependencies**
```bash
npm install
```

### 4. **Configure Environment Variables**
Create a `.env.local` file in `fin-reporter/` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. **Run the Development Server**
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view your site.

---

## 🗂️ Project Structure
```
fin-reporter/
  src/
    app/           # Next.js app directory
    components/    # UI and markdown components
    hooks/         # Custom React hooks
    lib/           # Utility and data functions
  public/          # Static assets
  package.json     # Project dependencies
  ...
```

---

## 📝 Usage & Customization
- **Add/Edit Projects:** Log in as admin (see `src/lib/auth.ts` for admin logic) to create or edit projects.
- **Markdown Support:** Use markdown with math (`$...$`, `\[...\]`), code blocks, and images.
- **Styling:** Uses Tailwind CSS for easy customization.
- **Deployment:** Deploy to Vercel, Netlify, or your own server.

---

## 🧑‍💻 For Your Brother
- Fork or clone this repo
- **Create your own GitHub repository and push the code (see above)**
- Update the Supabase credentials to your own project
- Edit or add your own projects via the admin interface
- Customize the theme, sections, and content as you like

---

## 📄 License
MIT License. Free for personal and commercial use.

---

## 🙏 Credits
- Built by Hyeonjae Park
- Inspired by modern resume and portfolio best practices
- Uses [Next.js](https://nextjs.org/), [Supabase](https://supabase.com/), [Tailwind CSS](https://tailwindcss.com/), [react-katex](https://github.com/talyssonoc/react-katex), and more.

---

## 💡 Tips
- For math rendering, use `$...$` for inline and `\[...\]` for block math.
- For code, use triple backticks (```) and specify the language.
- For images, use markdown image syntax: `![alt](url)`.

---

Happy hacking! 🎉
