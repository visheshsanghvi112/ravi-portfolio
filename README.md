# 📸 Ravi Maurya - Visual Artist Portfolio

<div align="center">
  <img src="public/icon-512x512.png" alt="Ravi Maurya Logo" width="120" />
  
  [![Live Site](https://img.shields.io/badge/Live-Portfolio-gold?style=for-the-badge)](https://ravi-maurya-portfolio.vercel.app)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
</div>

## 🎯 Overview

A premium, AI-powered photography portfolio website showcasing the work of visual artist Ravi Maurya. Built with modern web technologies and featuring stunning visual effects, smooth animations, and intelligent AI chat integration.

## ✨ Features

- 🎨 **Premium Design** - Luxury aesthetic with gold accents and dark theme
- 🤖 **AI Chat Assistant** - Powered by Google Gemini for interactive client engagement
- 🖼️ **Dynamic Portfolio** - Masonry layout with lazy loading and smooth transitions
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- 🎬 **Cinematic Hero** - Rotating background slideshow with smooth transitions
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🔍 **SEO Optimized** - Meta tags, structured data, and sitemap included
- 🎭 **Glass Morphism** - Modern UI with backdrop blur effects
- 📧 **Contact Forms** - Easy client communication

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS
- **AI Integration:** Google Gemini API
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key ([Get one here](https://ai.google.dev/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/visheshsanghvi112/ravi-portfolio.git
cd ravi-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` directory.

## 📦 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI chat functionality | Yes |

## 🎨 Customization

### Update Personal Information

Edit the following sections in `App.tsx`:

- Hero section text and tagline
- About section bio
- Services offered
- Contact information

### Change Color Scheme

Modify the Tailwind config in `index.html`:

```javascript
colors: {
  obsidian: '#050505',    // Dark background
  charcoal: '#0F0F11',    // Card backgrounds
  surface: '#18181B',     // Surface elements
  gold: {
    400: '#D4AF37',       // Primary accent color
    // ... other shades
  }
}
```

### Update Portfolio Images

Replace images in the `HERO_IMAGES` and `PLACEHOLDER_IMAGES` arrays in `constants.ts`.

## 📁 Project Structure

```
ravi-portfolio/
├── public/              # Static assets
│   ├── icon-512x512.png # App icon
│   ├── site.webmanifest # PWA manifest
│   └── robots.txt       # SEO robots file
├── components/          # React components
│   ├── ui/             # UI components
│   └── ...
├── services/           # API services
│   └── gemini.ts       # Gemini AI integration
├── App.tsx             # Main application
├── constants.ts        # App constants
├── types.ts            # TypeScript types
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel deployment with zero configuration needed.

#### Method 1: Connect GitHub Repository (Easiest)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Add environment variable: `VITE_GEMINI_API_KEY`
6. Click "Deploy"

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Add the following in your Vercel project settings:

1. Go to your project → Settings → Environment Variables
2. Add `VITE_GEMINI_API_KEY` with your API key
3. Select all environments (Production, Preview, Development)
4. Save and redeploy

### Other Platforms

#### Netlify

```bash
npm run build
# Upload the 'dist' folder to Netlify
```

#### GitHub Pages

Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/ravi-portfolio/',
  // ... rest of config
})
```

Then deploy:

```bash
npm run build
# Deploy dist folder to gh-pages branch
```

## 🔧 Vercel Configuration

The project includes a `vercel.json` configuration file that handles:

- Build settings
- Environment variables
- Routing rules
- Headers and redirects

No manual configuration needed on Vercel!

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Adding New Features

1. Create components in `components/` directory
2. Add types in `types.ts`
3. Update constants in `constants.ts`
4. Import and use in `App.tsx`

## 📈 Performance

- ⚡ Lighthouse Score: 95+
- 📦 Bundle Size: < 500KB
- ⏱️ First Contentful Paint: < 1.5s
- 🎯 Time to Interactive: < 3s

## 🐛 Troubleshooting

### AI Chat Not Working

- Verify your `VITE_GEMINI_API_KEY` is set correctly
- Check the browser console for API errors
- Ensure your API key has proper permissions

### Images Not Loading

- Check image URLs in `constants.ts`
- Verify network connectivity
- Check browser console for CORS errors

### Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ravi Maurya**
- Website: [ravi-maurya-portfolio.vercel.app](https://ravi-maurya-portfolio.vercel.app)
- Email: contact@ravimaurya.com

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- AI powered by [Google Gemini](https://ai.google.dev)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)

## 📞 Support

For support, email contact@ravimaurya.com or open an issue on GitHub.

---

<div align="center">
  Made with ❤️ and ☕ by Ravi Maurya
  
  ⭐ Star this repo if you like it!
</div>
