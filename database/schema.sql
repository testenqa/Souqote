-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type AS ENUM ('customer', 'technician');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    user_type user_type NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    years_experience INTEGER,
    hourly_rate DECIMAL(10,2),
    languages TEXT[],
    specialties TEXT[],
    emirates_id VARCHAR(20),
    trade_license TEXT,
    insurance_document TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    urgency urgency_level NOT NULL DEFAULT 'medium',
    preferred_date DATE NOT NULL,
    status job_status NOT NULL DEFAULT 'open',
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids table
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    estimated_time VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status bid_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, technician_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, reviewer_id, reviewee_id)
);

-- Create indexes for better performance
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_bids_job_id ON bids(job_id);
CREATE INDEX idx_bids_technician_id ON bids(technician_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_messages_job_id ON messages(job_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view open jobs" ON jobs
    FOR SELECT USING (status = 'open');

CREATE POLICY "Users can view their own jobs" ON jobs
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create jobs" ON jobs
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update their own jobs" ON jobs
    FOR UPDATE USING (auth.uid() = customer_id);

-- Bids policies
CREATE POLICY "Users can view bids for their jobs" ON bids
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = bids.job_id 
            AND jobs.customer_id = auth.uid()
        )
    );

CREATE POLICY "Technicians can view their own bids" ON bids
    FOR SELECT USING (auth.uid() = technician_id);

CREATE POLICY "Technicians can create bids" ON bids
    FOR INSERT WITH CHECK (auth.uid() = technician_id);

CREATE POLICY "Users can update bids for their jobs" ON bids
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = bids.job_id 
            AND jobs.customer_id = auth.uid()
        )
    );

-- Messages policies
CREATE POLICY "Users can view messages for their jobs" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = receiver_id
    );

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews policies
CREATE POLICY "Users can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for completed jobs" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = reviews.job_id 
            AND jobs.status = 'completed'
        )
    );

-- Insert sample data
INSERT INTO users (id, email, first_name, last_name, phone, user_type, bio, years_experience, hourly_rate, is_verified, rating, total_jobs) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'customer@example.com', 'Sarah', 'Ahmed', '+971501234567', 'customer', 'Homeowner in Dubai', null, null, true, 0, 0),
    ('550e8400-e29b-41d4-a716-446655440001', 'technician1@example.com', 'Ahmed', 'Hassan', '+971501234568', 'technician', 'Professional plumber with 5 years experience', 5, 150, true, 4.9, 156),
    ('550e8400-e29b-41d4-a716-446655440002', 'technician2@example.com', 'Sarah', 'Johnson', '+971501234569', 'technician', 'Licensed electrician specializing in home installations', 3, 120, true, 4.8, 89);

INSERT INTO jobs (id, customer_id, title, description, category, location, budget, urgency, preferred_date, status, images) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Fix leaking kitchen faucet', 'The kitchen faucet has been leaking for the past week. Water drips constantly from the spout and there''s also a leak under the sink.', 'Plumbing', 'Downtown Dubai, UAE', 500, 'medium', '2024-09-15', 'open', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']),
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Install ceiling fan', 'Need to install a new ceiling fan in the living room. Electrical outlet is already available.', 'Electrical', 'Marina, Dubai', 300, 'low', '2024-09-20', 'open', ARRAY['https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400']);

INSERT INTO bids (job_id, technician_id, price, estimated_time, message, status) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 450, '2-3 hours', 'I have extensive experience with kitchen faucet repairs. I can fix both the spout leak and the under-sink leak. Available tomorrow morning.', 'pending'),
    ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 380, '1-2 hours', 'Specialized in plumbing repairs. I can diagnose the issue quickly and provide a permanent solution. Same-day service available.', 'pending');