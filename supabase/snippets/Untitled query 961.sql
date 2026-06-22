create policy "Users can read own tts audio"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'tts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );