# ClearLetter | מכתב ברור

הפוך מכתבים ביורוקרטיים מורכבים להסברים פשוטים וידידותיים.

ClearLetter הוא שירות אינטרנט המיועד לעזור למבוגרים ולכל מי שמרגיש מוצף ממסמכים רשמיים להבין מכתבים ביורוקרטיים מורכבים מעיריות, גופים ממשלתיים ומוסדות רפואיים.

## תכונות עיקריות

- **פישוט מבוסס בינה מלאכותית**: הופך שפה משפטית וסבוכה לשפה חמה, ברורה ופשוטה.
- **ניתוח מסמכים רב-מודאלי**: ניתן להעלות צילומים של מכתבים או להדביק טקסט ישירות.
- **איורים חזותיים**: יצירת תמונות בעזרת AI המסייעות להמחיש מושגים מרכזיים.
- **מצגת אינטראקטיבית**: הסבר שלב אחר שלב עם כפתורי שליטה.
- **תמיכה דו-לשונית**: תמיכה מלאה בעברית (RTL) ובאנגלית.
- **נגישות בעדיפות עליונה**: ניגודיות גבוהה, טקסט גדול ורווחים נדיבים לקריאה קלה.

## איך זה עובד?

1. **הדבקה או העלאה**: מזינים את טקסט המכתב או מעלים צילום של המסמך.
2. **ניתוח AI**: המערכת קוראת ומבינה את תוכן המסמך.
3. **הסבר מפושט**: מקבלים גרסה ידידותית וקלה להבנה הכוללת:
   - סיכום ברור
   - נקודות מפתח מודגשות
   - רשימת פעולות לביצוע
   - איורים חזותיים למושגים מרכזיים

## טכנולוגיות

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **AI Services**: Google Gemini 2.5 Flash (טקסט וניתוח רב-מודאלי), Gemini 2.0 Flash (יצירת תמונות)
- **עיצוב**: רכיבי shadcn/ui עם דגש על נגישות.

---

# ClearLetter (English)

Transform complex bureaucratic documents into simple, friendly explanations.

ClearLetter is a web application designed to help elderly users and anyone overwhelmed by official documents understand complex bureaucratic letters from municipalities, government bodies, and medical institutions.

## Features

- **AI-Powered Simplification**: Transforms legalistic language into warm, clear explanations
- **Multimodal Document Analysis**: Upload photos of letters or paste text directly
- **Visual Illustrations**: AI-generated images to help explain key concepts
- **Animated Presentation**: Step-by-step explanation with playback controls
- **Bilingual Support**: Full Hebrew (RTL) and English language support
- **Accessibility-First**: High contrast, large text, and generous spacing for easy reading

## How It Works

1. **Paste or Upload**: Enter your official letter text or upload a photo of the document
2. **AI Analysis**: The system reads and understands the document content
3. **Simplified Explanation**: Receive a friendly, easy-to-understand version with:
   - Clear summary
   - Key points highlighted
   - Action items listed
   - Visual illustrations for key concepts

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **AI Services**: Google Gemini 2.5 Flash (text & multimodal), Gemini 2.0 Flash (image generation)
- **Styling**: shadcn/ui components with accessibility focus

## Getting Started

### Prerequisites

- Node.js 20+
- Replit AI Integrations (for Gemini API access)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

### Environment Variables

The following environment variables are configured via Replit AI Integrations:

- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini API key
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini API base URL

## API Endpoints

- `POST /api/simplify` - Simplify text content
- `POST /api/simplify-image` - Analyze and simplify document images

## Project Structure

```
client/           # React frontend
  src/
    components/   # UI components
    hooks/        # Custom React hooks
    pages/        # Page components
    lib/          # Utilities
server/           # Express backend
  services/       # AI integration services
shared/           # Shared types and schemas
```

## License

MIT
