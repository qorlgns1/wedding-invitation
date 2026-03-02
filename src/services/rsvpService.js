import { getSupabaseClient } from '../lib/supabaseClient';

export async function submitRsvp(payload) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from('rsvp_entries').insert([
    {
      which_side: payload.which_side,
      can_attend: payload.can_attend,
      guest_name: payload.guest_name,
      phone_number: payload.phone_number ?? '',
      companion_count: payload.companion_count ?? 1,
      meal_attendance: payload.meal_attendance ?? '',
    },
  ]);

  if (error) {
    throw new Error(error.message || '참석 의사 저장에 실패했습니다.');
  }

  return { status: 'success' };
}
