# ClearLetter - Bureaucracy Simplification Service

## Overview

ClearLetter is a web application that transforms complex bureaucratic documents (from municipalities, government bodies, medical institutions) into simple, friendly explanations. The service uses AI to simplify legalistic language and generate visual explanations, specifically designed for elderly users and anyone who finds official documents overwhelming.

The core workflow:
1. User pastes an official letter
2. AI simplifies the text and extracts key points
3. System generates visual illustrations for key concepts
4. Results display as an animated, step-by-step explanation

## User Preferences

Preferred communication style: Simple, everyday language.
Default language: Hebrew (with RTL support)
Default theme: Light mode
Languages supported: Hebrew, English (toggle in header)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui components (New York style)
- **Animations**: Framer Motion for smooth transitions
- **Design Philosophy**: Accessibility-first, WCAG AAA compliance target
  - Minimum font size 16px
  - High contrast colors
  - Generous spacing
  - Single-column layouts preferred

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for production, Vite for development
- **API Structure**: RESTful endpoints under `/api/`

### Key Endpoints
- `POST /api/simplify` - Main endpoint that accepts bureaucratic text and returns simplified explanation with images
- `POST /api/simplify-image` - Accepts image uploads and analyzes documents directly using Gemini multimodal AI

### AI Services
- **Text Simplification**: OpenAI GPT models via Replit AI Integrations
  - Converts complex legal/bureaucratic text to simple language
  - Extracts action items, key points, and determines tone
  - Returns structured JSON response
- **Image Generation**: Google Gemini (gemini-2.5-flash-image) via Replit AI Integrations
  - Creates calming, professional illustrations for key points
  - Soft colors, minimalist iconographic style
- **Multimodal Document Analysis**: Google Gemini (gemini-2.5-flash) via Replit AI Integrations
  - Analyzes uploaded document images directly using multimodal AI
  - Extracts and simplifies content in Hebrew or English

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts`
- **Current Storage**: In-memory storage (MemStorage class) with database schema ready for migration
- **Tables**: users, explanations, conversations, messages

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (shadcn/ui based)
    hooks/        # Custom React hooks
    pages/        # Page components
    lib/          # Utilities and query client
server/           # Express backend
  services/       # AI integration services
  replit_integrations/  # Audio, chat, image utilities
shared/           # Shared types and schemas
```

## External Dependencies

### AI Services (via Replit AI Integrations)
- **OpenAI API**: Text simplification (gpt-5 model referenced)
  - Environment: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
- **Google Gemini API**: Image generation
  - Environment: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`

### Database
- **PostgreSQL**: Required for production
  - Environment: `DATABASE_URL`
  - Migrations in `/migrations` directory
  - Push schema with `npm run db:push`

### Key NPM Dependencies
- `@google/genai` - Gemini AI client
- `openai` - OpenAI client
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `@tanstack/react-query` - Data fetching
- `framer-motion` - Animations
- `@radix-ui/*` - Accessible UI primitives
- `tailwindcss` - Styling
- `multer` - File upload handling for OCR

### Fonts
- Inter / Open Sans (Google Fonts) - Primary readable fonts