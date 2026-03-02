import { getSupabaseClient } from '../lib/supabaseClient';

export async function listGuestbook(page = 1, limit = 10) {
  const supabase = getSupabaseClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('guestbook_public_entries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message || '방명록 조회에 실패했습니다.');
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    entries: data ?? [],
    total,
    page,
    totalPages,
  };
}

function unwrapRpcResult(data, fallbackError) {
  if (!data) {
    throw new Error(fallbackError);
  }

  if (typeof data === 'object' && data.success === false) {
    throw new Error(data.error || fallbackError);
  }

  return data;
}

export async function createGuestbook(payload) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc('guestbook_create', {
    name: payload.name,
    message: payload.message,
    password_plain: payload.password,
  });

  if (error) {
    throw new Error(error.message || '방명록 작성에 실패했습니다.');
  }

  return unwrapRpcResult(data, '방명록 작성에 실패했습니다.');
}

export async function verifyGuestbookPassword(entryId, password) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc('guestbook_verify', {
    entry_id: entryId,
    password_plain: password,
  });

  if (error) {
    throw new Error(error.message || '비밀번호 확인에 실패했습니다.');
  }

  return unwrapRpcResult(data, '비밀번호 확인에 실패했습니다.');
}

export async function updateGuestbook(payload) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc('guestbook_update', {
    entry_id: payload.id,
    name: payload.name,
    message: payload.message,
    password_plain: payload.password,
  });

  if (error) {
    throw new Error(error.message || '방명록 수정에 실패했습니다.');
  }

  return unwrapRpcResult(data, '방명록 수정에 실패했습니다.');
}

export async function deleteGuestbook(entryId, password) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc('guestbook_delete', {
    entry_id: entryId,
    password_plain: password,
  });

  if (error) {
    throw new Error(error.message || '방명록 삭제에 실패했습니다.');
  }

  return unwrapRpcResult(data, '방명록 삭제에 실패했습니다.');
}
