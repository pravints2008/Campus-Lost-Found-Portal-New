import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey.length > 20
  );
};

// Fallback mock client if not yet configured, so the app doesn't crash on load
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key'
);

/**
 * Uploads an item image to Supabase Storage bucket 'item-images'.
 * If the bucket doesn't exist or storage is not configured, it returns a base64 DataURL fallback.
 */
export async function uploadItemPhoto(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    return convertFileToBase64(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('item-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('Storage bucket upload failed, using base64 fallback:', uploadError.message);
      return convertFileToBase64(file);
    }

    const { data } = supabase.storage.from('item-images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn('Exception during image upload, using base64 fallback:', err);
    return convertFileToBase64(file);
  }
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
