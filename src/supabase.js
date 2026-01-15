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
    const { error } = await supabase
        .from('scores')
        .insert([{ nickname, score }]);

    if (error) console.error('Error saving score:', error);
};

export const getLeaderboard = async () => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
    return data;
};
