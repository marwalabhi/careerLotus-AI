import { supabase } from '../supabase/client';

export async function addMessage(
  chatSessionId: string,
  content: string,
  role: 'USER' | 'ASSISTANT'
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_session_id: chatSessionId, // Column name matches schema
      content: content,
      role: role,
    })
    .select()
    .single();

  if (error) throw error;
  return data; // { id, chat_session_id, content, role, created_at }
}

export async function getMessagesInSession(chatSessionId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_session_id', chatSessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data; // array of message objects
}
