-- Create recommendation_feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL,
  is_positive BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for recommendation feedback
CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_user_id ON recommendation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_book_id ON recommendation_feedback(book_id);
