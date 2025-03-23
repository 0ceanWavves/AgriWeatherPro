-- Add subscription-related tables to support premium features

-- Subscription plans table
CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_yearly DECIMAL(10, 2) NOT NULL,
    features JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a trigger to automatically update the updated_at column
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- User subscriptions table
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_id INTEGER REFERENCES subscription_plans(id),
    status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    billing_cycle TEXT NOT NULL, -- 'monthly', 'yearly'
    payment_method JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a trigger to automatically update the updated_at column
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Subscription transactions table
CREATE TABLE subscription_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL, -- 'completed', 'failed', 'refunded'
    payment_method TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a subscription_tier column to profiles table
ALTER TABLE profiles 
ADD COLUMN subscription_tier TEXT DEFAULT 'free';

-- Enable Row Level Security for the new tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscription_plans
CREATE POLICY "Anyone can view active subscription plans" 
ON subscription_plans FOR SELECT 
USING (is_active = true);

-- Only allow administrators to modify subscription plans
-- (This assumes you have a function to check if a user is an admin)
-- CREATE POLICY "Only admins can insert subscription plans" 
-- ON subscription_plans FOR INSERT 
-- WITH CHECK (auth.is_admin());

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON user_subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Create RLS policies for subscription_transactions
CREATE POLICY "Users can view their own transactions" 
ON subscription_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features)
VALUES 
    ('Free', 'Basic access to weather forecasts and limited features', 0, 0, 
     '{"weather_forecast_days": 3, "locations": 1, "alerts": ["basic"], "support": "community"}'),
    
    ('Basic', 'Enhanced weather forecasts and basic agricultural tools', 49, 490, 
     '{"weather_forecast_days": 7, "locations": 3, "alerts": ["basic", "crop"], 
       "support": "email", "features": ["standard_irrigation", "basic_crop_analysis"]}'),
    
    ('Professional', 'Advanced weather analytics and agricultural planning tools', 99, 990, 
     '{"weather_forecast_days": 14, "locations": 5, "alerts": ["basic", "crop", "severe", "custom"], 
       "support": "priority", "features": ["advanced_irrigation", "detailed_crop_analysis", 
       "pest_management", "yield_prediction"]}'),
    
    ('Enterprise', 'Complete agricultural intelligence platform with custom solutions', 249, 2490, 
     '{"weather_forecast_days": 30, "locations": "unlimited", "alerts": ["all"], 
       "support": "dedicated", "features": ["all"]}');

-- Create function to check if a user has access to a premium feature
CREATE OR REPLACE FUNCTION has_premium_feature(feature_name TEXT) 
RETURNS BOOLEAN AS $$
DECLARE
    user_plan_features JSONB;
BEGIN
    -- Get the user's current subscription features
    SELECT sp.features INTO user_plan_features
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = auth.uid()
    AND us.status = 'active'
    AND current_timestamp BETWEEN us.current_period_start AND us.current_period_end
    LIMIT 1;
    
    -- If no active subscription is found, check if they have a free plan
    IF user_plan_features IS NULL THEN
        SELECT features INTO user_plan_features
        FROM subscription_plans
        WHERE name = 'Free'
        LIMIT 1;
    END IF;
    
    -- Check if the feature exists in the user's plan
    -- This handles different types of feature structures in the JSONB
    IF user_plan_features->>'features' IS NOT NULL THEN
        -- Check if feature is in the features array or is "all"
        RETURN jsonb_path_exists(user_plan_features, '$.features[*] ? (@ == $feature || @ == "all")', jsonb_build_object('feature', feature_name))
               OR (user_plan_features->>'features' = 'all');
    ELSE
        -- For free plan, just check if they have basic features
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get a user's current subscription status
CREATE OR REPLACE FUNCTION get_subscription_status() 
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'plan_name', sp.name,
        'plan_id', sp.id,
        'status', us.status,
        'current_period_end', us.current_period_end,
        'billing_cycle', us.billing_cycle,
        'cancel_at_period_end', us.cancel_at_period_end,
        'features', sp.features
    ) INTO result
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = auth.uid()
    AND us.status = 'active'
    AND current_timestamp BETWEEN us.current_period_start AND us.current_period_end
    ORDER BY us.created_at DESC
    LIMIT 1;
    
    -- If no active subscription is found, return the free plan
    IF result IS NULL THEN
        SELECT jsonb_build_object(
            'plan_name', name,
            'plan_id', id,
            'status', 'active',
            'features', features
        ) INTO result
        FROM subscription_plans
        WHERE name = 'Free'
        LIMIT 1;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 