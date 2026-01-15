import { createClient } from '@supabase/supabase-js';

// PLACEHOLDERS - To be replaced by User provided keys
const SUPABASE_URL = 'https://qaswcntwhsstlgaotjey.supabase.co';
const SUPABASE_KEY = 'sb_publishable_biRSQ8q8onHCysnQeiFTOg_7-mIJ8KB';

let supabase = null;

export const initSupabase = () => {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_KEY') {
        console.warn('Supabase credentials missing. Leaderboard will be disabled.');
        return false;
    }
    try {
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        return true;
    } catch (e) {
        console.error('Supabase init failed:', e);
        return false;
    }
};

export const saveScore = async (nickname, score) => {
    if (!supabase) return;
    console.log(`[Supabase] Attempting to save score: ${nickname} - ${score}`);
    const { data, error } = await supabase
        .from('scores')
        .insert([{ nickname, score }])
        .select();

    if (error) {
        console.error('[Supabase] Error saving score:', error);
    } else {
        console.log('[Supabase] Score saved successfully:', data);
    }
};

export const getLeaderboard = async () => {
    if (!supabase) return [];

    console.log('[Supabase] Fetching leaderboard...');
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

    if (error) {
        console.error('[Supabase] Error fetching leaderboard:', error);
        return [];
    }
    console.log('[Supabase] Leaderboard fetched:', data);
    return data;
};
