-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'book', 'social', 'payment')),
  is_read BOOLEAN DEFAULT FALSE,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Add some sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT 
  id, 
  'Welcome to Writha!', 
  'Thank you for joining our platform. Start exploring books now!', 
  'system',
  FALSE,
  NOW() - INTERVAL '1 day'
FROM profiles
LIMIT 5;

INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT 
  id, 
  'New Book Released', 
  'A new book in your favorite genre has been released. Check it out!', 
  'book',
  FALSE,
  NOW() - INTERVAL '12 hours'
FROM profiles
LIMIT 5;

INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
SELECT 
  id, 
  'Payment Successful', 
  'Your wallet has been funded with ₦5,000.', 
  'payment',
  FALSE,
  NOW() - INTERVAL '6 hours'
FROM profiles
LIMIT 5;
