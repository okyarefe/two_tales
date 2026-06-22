create policy "Users can upload own tts audio"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'tts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );