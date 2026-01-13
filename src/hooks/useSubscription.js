/**
 * useSubscription Hook - Razorpay Integration
 * 
 * Manages subscription state with Razorpay payment gateway.
 * Supports both demo mode and production Razorpay checkout.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

// Demo mode flag - set to false for production Razorpay payments
const DEMO_MODE = false;

// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXX';

export const PLANS = {
    free: {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'INR',
        interval: null,
        trialDays: 7,
        features: [
            'Basic tracking for 5 modules',
            '7-day data history',
            'Daily score calculation',
            'Basic insights',
        ],
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 59,
        currency: 'INR',
        interval: 'month',
        trialDays: 7,
        features: [
            'All Free features',
            'Advanced AI Coach insights',
            'Unlimited data history',
            'Priority support',
            'Export to CSV/PDF',
            'Custom goals & targets',
            'Correlation analysis',
            'Weekly email reports',
        ],
    },
};

/**
 * Load Razorpay script dynamically
 */
const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(script);
    });
};

export const useSubscription = () => {
    const { user } = useAuth();
    const [currentPlan, setCurrentPlan] = useState('free');
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch current subscription status
     */
    const checkSubscription = useCallback(async () => {
        if (!user?.id) {
            setCurrentPlan('free');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (DEMO_MODE) {
                // Demo mode: Check localStorage
                const stored = localStorage.getItem(`pl_subscription_${user.id}`);
                if (stored) {
                    const data = JSON.parse(stored);
                    // Check if subscription is still valid
                    if (data.expiresAt && new Date(data.expiresAt) > new Date()) {
                        setCurrentPlan(data.tier);
                        setSubscription(data);
                    } else {
                        setCurrentPlan('free');
                        setSubscription(null);
                        localStorage.removeItem(`pl_subscription_${user.id}`);
                    }
                }
            } else if (supabase) {
                // Production: Fetch from Supabase
                const { data, error: fetchError } = await supabase
                    .from('profiles')
                    .select('is_pro_member, subscription_id, subscription_expires_at')
                    .eq('id', user.id)
                    .single();

                if (fetchError) throw fetchError;

                if (data?.is_pro_member) {
                    const expiresAt = new Date(data.subscription_expires_at);
                    if (expiresAt > new Date()) {
                        setCurrentPlan('pro');
                        setSubscription({
                            tier: 'pro',
                            subscriptionId: data.subscription_id,
                            expiresAt: data.subscription_expires_at,
                        });
                    } else {
                        // Subscription expired, update database
                        await supabase
                            .from('profiles')
                            .update({ is_pro_member: false })
                            .eq('id', user.id);
                        setCurrentPlan('free');
                    }
                }
            }
        } catch (err) {
            console.error('[Subscription] Error checking status:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    /**
     * Initiate Razorpay payment
     */
    const subscribe = async (planId = 'pro') => {
        if (!user?.id) {
            setError('Please sign in to subscribe');
            return { success: false, error: 'Not authenticated' };
        }

        setIsLoading(true);
        setError(null);

        try {
            if (DEMO_MODE) {
                // Demo mode: Simulate subscription
                await new Promise(resolve => setTimeout(resolve, 1500));

                const subscriptionData = {
                    tier: 'pro',
                    subscriptionId: `demo_sub_${Date.now()}`,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    startedAt: new Date().toISOString(),
                    paymentId: `demo_pay_${Date.now()}`,
                };

                localStorage.setItem(`pl_subscription_${user.id}`, JSON.stringify(subscriptionData));
                setCurrentPlan('pro');
                setSubscription(subscriptionData);

                return { success: true, demo: true };
            }

            // Production: Load Razorpay and initiate payment
            await loadRazorpayScript();

            return new Promise((resolve) => {
                const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: PLANS.pro.price * 100, // Amount in paise
                    currency: PLANS.pro.currency,
                    name: 'Vylos Labs',
                    description: 'Pro Tier Subscription - Monthly',
                    image: '/logo.png', // Add your logo
                    prefill: {
                        email: user.email,
                        name: user.user_metadata?.name || '',
                    },
                    notes: {
                        userId: user.id,
                        planId: planId,
                    },
                    theme: {
                        color: '#6366f1',
                        backdrop_color: 'rgba(0,0,0,0.8)',
                    },
                    handler: async (response) => {
                        // Payment successful
                        console.log('[Razorpay] Payment successful:', response);

                        try {
                            // Update Supabase
                            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

                            if (!supabase) {
                                throw new Error('Supabase not configured');
                            }

                            const { error: updateError } = await supabase
                                .from('profiles')
                                .update({
                                    is_pro_member: true,
                                    subscription_id: response.razorpay_payment_id,
                                    subscription_expires_at: expiresAt,
                                })
                                .eq('id', user.id);

                            if (updateError) throw updateError;

                            const subscriptionData = {
                                tier: 'pro',
                                subscriptionId: response.razorpay_payment_id,
                                expiresAt: expiresAt,
                                startedAt: new Date().toISOString(),
                                paymentId: response.razorpay_payment_id,
                            };

                            setCurrentPlan('pro');
                            setSubscription(subscriptionData);
                            setIsLoading(false);

                            resolve({ success: true, paymentId: response.razorpay_payment_id });
                        } catch (err) {
                            console.error('[Razorpay] Error updating subscription:', err);
                            setIsLoading(false);
                            resolve({ success: false, error: err.message });
                        }
                    },
                    modal: {
                        ondismiss: () => {
                            setIsLoading(false);
                            resolve({ success: false, error: 'Payment cancelled' });
                        },
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', (response) => {
                    console.error('[Razorpay] Payment failed:', response.error);
                    setIsLoading(false);
                    resolve({
                        success: false,
                        error: response.error.description || 'Payment failed'
                    });
                });

                razorpay.open();
            });

        } catch (err) {
            console.error('[Subscription] Error subscribing:', err);
            setError(err.message);
            setIsLoading(false);
            return { success: false, error: err.message };
        }
    };

    /**
     * Cancel subscription
     */
    const cancelSubscription = async () => {
        if (!user?.id || !subscription) {
            return { success: false, error: 'No active subscription' };
        }

        setIsLoading(true);
        setError(null);

        try {
            if (DEMO_MODE) {
                localStorage.removeItem(`pl_subscription_${user.id}`);
                setCurrentPlan('free');
                setSubscription(null);
                setIsLoading(false);
                return { success: true };
            }

            // Production: Update Supabase
            if (!supabase) {
                setIsLoading(false);
                return { success: false, error: 'Supabase not configured' };
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    is_pro_member: false,
                    subscription_id: null,
                    subscription_expires_at: null,
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setCurrentPlan('free');
            setSubscription(null);

            return { success: true };
        } catch (err) {
            console.error('[Subscription] Error canceling:', err);
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Check if user has Pro access
     */
    const hasProAccess = useCallback(() => {
        return currentPlan === 'pro';
    }, [currentPlan]);

    // Check subscription on mount
    useEffect(() => {
        checkSubscription();
    }, [checkSubscription]);

    return {
        currentPlan,
        subscription,
        isLoading,
        error,
        isPro: currentPlan === 'pro',
        plans: PLANS,
        checkSubscription,
        subscribe,
        cancelSubscription,
        hasProAccess,
        isDemo: DEMO_MODE,
    };
};

export default useSubscription;
