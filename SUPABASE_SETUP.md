# Supabase Database Setup

## ขั้นตอนการติดตั้ง Supabase Database

### 1. สร้าง Table `stories`

ไปที่ Supabase Dashboard → SQL Editor และรันคำสั่งนี้:

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo)
CREATE POLICY "Allow all operations" ON stories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for ordering
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
```

### 2. สร้าง Storage Bucket `stories`

1. ไปที่ Supabase Dashboard → Storage
2. คลิก "New bucket"
3. ตั้งชื่อว่า `stories`
4. เลือก **Public bucket** (เพื่อให้สามารถเข้าถึงรูปภาพได้)
5. คลิก "Create bucket"

### 3. ตั้งค่า Storage Policies

หลังจากสร้าง bucket แล้ว ไปที่ Policies tab ของ bucket `stories` และเพิ่ม policies:

**Policy 1: Allow Upload**

```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'stories');
```

**Policy 2: Allow Delete**

```sql
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'stories');
```

**Policy 3: Allow Select (Read)**

```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'stories');
```

### 4. อัพเดท Environment Variables

แก้ไขไฟล์ `.env.local` (หรือสร้างใหม่ถ้ายังไม่มี):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

หา URL และ Key ได้จาก: Supabase Dashboard → Settings → API

---

## ทดสอบ Connection

หลังจาก setup เสร็จแล้ว:

1. รัน dev server: `npm run dev`
2. เข้าไปที่ `http://localhost:3000/test-supabase`
3. ตรวจสอบว่าแสดงข้อความ "Success! Connected to Supabase."

---

## หมายเหตุ

- Table `test_connection` จะถูกสร้างอัตโนมัติเมื่อรัน test page (ถ้าคุณต้องการก็สามารถสร้างล่วงหน้าได้)
- ถ้าต้องการเปลี่ยน RLS policies ให้เข้มงวดขึ้น สามารถแก้ไขได้ในภายหลัง
