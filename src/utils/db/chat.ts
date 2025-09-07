import { supabase } from '@/utils/supabase/client';

export async function createChatSession(userId: string | null, title = 'New Chat') {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId, // Column name in Supabase table
      title: title,
    })
    .select() // return the inserted row
    .single();

  if (error) throw error;
  return data; // { id, user_id, title, created_at, updated_at }
}

export async function getChatSessions(userId: string) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data; // array of session objects
}
