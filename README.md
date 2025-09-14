# Handyman UAE - Marketplace Platform

A comprehensive handyman marketplace platform for Dubai/UAE, similar to Werkspot.nl, built with React, Node.js, and React Native.

## 🚀 Features

### Core Features
- **User Authentication** - Email/SMS verification, secure login
- **Job Posting** - Customers can post detailed job requests
- **Job Browsing** - Professionals can browse and apply for jobs
- **Real-time Messaging** - Chat between customers and professionals
- **Review System** - Rate and review completed jobs
- **Payment Integration** - PayTabs integration for UAE payments
- **Scheduling** - Book appointments and manage availability
- **Multi-language Support** - English and Arabic
- **Mobile Apps** - Native iOS and Android apps

### Service Categories
- Plumbing, Electrical, Painting, Carpentry
- Cleaning, AC & Refrigeration, Gardening
- Flooring, Tiling, Renovation, Appliance Repair
- Locksmith, Glass & Mirror, Security Systems
- Water Tank Cleaning, Pest Control, Moving & Packing
- And many more...

## 🛠 Tech Stack

### Backend
- **Node.js** with Express and TypeScript
- **Supabase** (PostgreSQL) for database
- **JWT** for authentication
- **Socket.io** for real-time messaging
- **Twilio** for SMS verification
- **PayTabs** for payment processing

### Frontend (Web)
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** for forms
- **i18next** for internationalization

### Mobile
- **React Native** with TypeScript
- **React Navigation** for navigation
- **React Native Vector Icons**
- **React Native Maps** for location services
- **React Native Image Picker** for photos

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Twilio account (for SMS)
- PayTabs account (for payments)
- React Native development environment (for mobile)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd handyman-uae
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. Environment Setup

#### Backend (.env)
```bash
cd server
cp env.example .env
```

Edit `.env` with your credentials:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Twilio Configuration (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# PayTabs Configuration
PAYTABS_MERCHANT_EMAIL=your_merchant_email
PAYTABS_SECRET_KEY=your_paytabs_secret_key
PAYTABS_PROFILE_ID=your_paytabs_profile_id
```

#### Frontend (.env)
```bash
cd client
```

Create `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Mobile (.env)
```bash
cd mobile
```

Create `.env`:
```env
API_URL=http://localhost:5000/api
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Update your environment variables with Supabase credentials

### 5. Start Development Servers

#### Start All Services
```bash
npm run dev
```

#### Or Start Individually
```bash
# Backend
npm run server

# Frontend
npm run client

# Mobile (in separate terminal)
npm run mobile
```

## 📱 Mobile App Setup

### Android
```bash
cd mobile
npx react-native run-android
```

### iOS
```bash
cd mobile
npx react-native run-ios
```

## 🗄 Database Schema

The database includes the following main tables:
- `users` - User accounts (customers and professionals)
- `user_profiles` - Extended user profile information
- `categories` - Service categories
- `jobs` - Job postings
- `job_applications` - Professional applications
- `reviews` - Job reviews and ratings
- `messages` - Real-time messaging
- `payments` - Payment transactions
- `notifications` - User notifications

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/verify-phone` - Phone verification

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/:id/applications` - Get job applications

### Messages
- `GET /api/messages/:jobId` - Get messages for job
- `POST /api/messages` - Send message

## 🌐 Deployment

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `cd client && npm run build`
3. Set environment variables
4. Deploy

### Mobile (App Store/Play Store)
1. Build production versions
2. Submit to respective app stores

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- SQL injection prevention
- XSS protection

## 📊 Monitoring & Analytics

- Error tracking with built-in logging
- Performance monitoring
- User analytics
- Payment tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email info@handyman-uae.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Advanced search and filtering
- [ ] Video calling integration
- [ ] AI-powered job matching
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Subscription plans for professionals
- [ ] Advanced scheduling system
- [ ] Integration with more payment gateways

---

Built with ❤️ for the UAE market
