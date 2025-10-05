# Handyman UAE - RFQ Platform

A comprehensive Request for Quote (RFQ) platform connecting buyers and vendors in the UAE market.

## 🚀 Features

### For Buyers
- Post RFQs with detailed requirements
- Browse and select vendors
- Manage RFQ lifecycle
- Communicate with vendors
- Review and rate vendors

### For Vendors
- Browse available RFQs
- Submit competitive bids
- Manage bid status
- Communicate with buyers
- Build reputation through reviews

### For Admins
- Platform management dashboard
- User management
- RFQ and quote oversight
- Category management
- Analytics and reporting

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Query, Context API
- **UI Components**: Radix UI, Lucide Icons
- **Routing**: React Router v6
- **Internationalization**: i18next (English/Arabic)

## 📁 Project Structure

```
handyman-uae/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── server/                 # Node.js backend (optional)
├── mobile/                 # React Native mobile app
├── database/               # Database schema and migrations
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd handyman-uae
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend (optional)
   cd ../server
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database schema from `database/rfq-schema.sql`
   - Configure environment variables

4. **Configure environment variables**
   ```bash
   # In client/.env
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Start the development server**
   ```bash
   cd client
   npm start
   ```

## 🗄️ Database Setup

The application uses Supabase with PostgreSQL. Key tables include:

- `users` - User profiles and authentication
- `rfqs` - Request for Quotes
- `quotes` - Vendor bids and proposals
- `categories` - RFQ categories
- `messages` - Communication between users
- `reviews` - User ratings and feedback
- `notifications` - System notifications
- `payments` - Payment tracking

## 🔐 User Types & Permissions

### Buyer
- Post RFQs
- View own RFQs
- Browse vendors
- Manage communications

### Vendor
- Browse RFQs
- Submit bids
- View own bids
- Manage profile

### Admin
- Full platform access
- User management
- System oversight

## 🌐 Internationalization

The platform supports English and Arabic with RTL layout support.

## 📱 Mobile App

A React Native mobile application is included in the `mobile/` directory.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Railway/Heroku)
```bash
cd server
npm run build
# Deploy to your preferred platform
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.