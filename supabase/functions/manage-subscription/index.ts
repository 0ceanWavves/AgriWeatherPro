import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Define type for subscription operations
type SubscriptionOperation = 
  | "get-subscription" 
  | "get-plans" 
  | "subscribe" 
  | "cancel-subscription" 
  | "change-plan";

interface SubscriptionRequest {
  operation: SubscriptionOperation;
  planId?: number;
  billingCycle?: "monthly" | "yearly";
  paymentMethod?: any;
}

serve(async (req: Request) => {
  try {
    // Create Supabase client with Admin privileges using service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the JSON request body
    const { operation, planId, billingCycle, paymentMethod } = await req.json() as SubscriptionRequest;

    // Get the user ID from the authorization header
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        error: "Missing authorization header" 
      }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // Extract token from the Authorization header (Bearer token)
    const token = authHeader.replace("Bearer ", "");
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: "Unauthorized" 
      }), { 
        status: 401, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const userId = user.id;

    // Handle different subscription operations
    switch (operation) {
      case "get-subscription":
        return await getSubscription(supabase, userId);
      
      case "get-plans":
        return await getSubscriptionPlans(supabase);
      
      case "subscribe":
        if (!planId || !billingCycle) {
          return new Response(JSON.stringify({ 
            error: "Missing required parameters" 
          }), { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
          });
        }
        return await subscribe(supabase, userId, planId, billingCycle, paymentMethod);
      
      case "cancel-subscription":
        return await cancelSubscription(supabase, userId);
      
      case "change-plan":
        if (!planId) {
          return new Response(JSON.stringify({ 
            error: "Missing required parameters" 
          }), { 
            status: 400, 
            headers: { "Content-Type": "application/json" } 
          });
        }
        return await changePlan(supabase, userId, planId);
      
      default:
        return new Response(JSON.stringify({ 
          error: "Invalid operation" 
        }), { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        });
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ 
      error: "An error occurred while processing your request" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
});

// Get the user's current subscription
async function getSubscription(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc('get_subscription_status');
  
  if (error) {
    return new Response(JSON.stringify({ 
      error: "Error fetching subscription" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  return new Response(JSON.stringify({ 
    subscription: data 
  }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
}

// Get all active subscription plans
async function getSubscriptionPlans(supabase: any) {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly', { ascending: true });
  
  if (error) {
    return new Response(JSON.stringify({ 
      error: "Error fetching subscription plans" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  return new Response(JSON.stringify({ 
    plans: data 
  }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
}

// Subscribe a user to a plan
async function subscribe(
  supabase: any, 
  userId: string, 
  planId: number, 
  billingCycle: "monthly" | "yearly",
  paymentMethod: any
) {
  // In a real implementation, you would process the payment here
  // For now, we'll just create the subscription record
  
  // First, get the subscription plan details
  const { data: planData, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();
  
  if (planError || !planData) {
    return new Response(JSON.stringify({ 
      error: "Invalid subscription plan" 
    }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  // Calculate subscription period
  const startDate = new Date();
  const endDate = new Date();
  
  if (billingCycle === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  
  // Check if the user already has an active subscription
  const { data: existingSubscription, error: subError } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  // If there's an existing subscription, cancel it
  if (existingSubscription) {
    await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSubscription.id);
  }
  
  // Create the new subscription
  const { data: subscription, error: createError } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      current_period_start: startDate.toISOString(),
      current_period_end: endDate.toISOString(),
      cancel_at_period_end: false,
      billing_cycle: billingCycle,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (createError) {
    return new Response(JSON.stringify({ 
      error: "Error creating subscription" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  // Update the user's profile with the subscription tier
  await supabase
    .from('profiles')
    .update({ 
      subscription_tier: planData.name.toLowerCase(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  // Create a transaction record
  const amount = billingCycle === "monthly" ? planData.price_monthly : planData.price_yearly;
  
  await supabase
    .from('subscription_transactions')
    .insert({
      user_id: userId,
      subscription_id: subscription.id,
      amount: amount,
      currency: 'USD',
      status: 'completed',
      payment_method: paymentMethod ? paymentMethod.type : 'unknown',
      transaction_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
  
  return new Response(JSON.stringify({ 
    success: true,
    subscription: subscription
  }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
}

// Cancel a user's subscription
async function cancelSubscription(supabase: any, userId: string) {
  // Find the user's active subscription
  const { data: subscription, error: findError } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (findError || !subscription) {
    return new Response(JSON.stringify({ 
      error: "No active subscription found" 
    }), { 
      status: 404, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  // Update subscription to cancel at period end
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update({ 
      cancel_at_period_end: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscription.id)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ 
      error: "Error canceling subscription" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  return new Response(JSON.stringify({ 
    success: true,
    subscription: data
  }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
}

// Change a user's subscription plan
async function changePlan(supabase: any, userId: string, newPlanId: number) {
  // Find the user's active subscription
  const { data: subscription, error: findError } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (findError || !subscription) {
    return new Response(JSON.stringify({ 
      error: "No active subscription found" 
    }), { 
      status: 404, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  // Get the new plan details
  const { data: planData, error: planError } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', newPlanId)
    .single();
  
  if (planError || !planData) {
    return new Response(JSON.stringify({ 
      error: "Invalid subscription plan" 
    }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  // Update the subscription with the new plan
  const { data, error } = await supabase
    .from('user_subscriptions')
    .update({ 
      plan_id: newPlanId,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscription.id)
    .select()
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ 
      error: "Error changing subscription plan" 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
  
  // Update the user's profile with the new subscription tier
  await supabase
    .from('profiles')
    .update({ 
      subscription_tier: planData.name.toLowerCase(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
  
  return new Response(JSON.stringify({ 
    success: true,
    subscription: data
  }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
} 