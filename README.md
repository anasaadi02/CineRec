# CineRec - Movie & Series Rating Website

A modern movie and TV series rating and recommendation website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎬 **Real Movie Data**: Integrated with TMDB API for latest movies and series
- 📱 **Responsive Design**: Mobile-first approach with beautiful UI
- ⚡ **Fast Performance**: Built with Next.js 14 and optimized images
- 🎨 **Modern UI**: Dark theme with smooth animations and hover effects
- 🔍 **Search Functionality**: Search through movies and series
- 📊 **Rating System**: View and rate movies with star ratings

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd front
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Get your TMDB API key from [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Add your API key to `.env.local`:
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## TMDB API Setup

1. Go to [The Movie Database](https://www.themoviedb.org/)
2. Create an account or sign in
3. Go to Settings → API
4. Request an API key (choose "Developer" option)
5. Copy your API key and add it to `.env.local`

## Project Structure

```
front/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── Navbar.tsx      # Navigation component
│   │   ├── HeroSlider.tsx  # Hero section with slider
│   │   ├── MovieGrid.tsx   # Movie grid with TMDB data
│   │   └── Footer.tsx      # Footer component
│   ├── hooks/              # Custom React hooks
│   │   └── useMovies.ts    # Hook for movie data management
│   └── lib/                # Utility libraries
│       └── tmdb.ts         # TMDB API integration
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **TMDB API** - Movie and TV show data

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
