# 📖 Book of Story - Photo Album

แอปพลิเคชัน Photo Album สวยงามที่ใช้เขียนเรื่องราวประกอบรูปภาพ พัฒนาด้วย Next.js, TypeScript, Material-UI และ Firebase

## ✨ Features

- 📸 **อัพโหลดรูปภาพ** - รองรับ Drag & Drop และ Preview
- ✍️ **เขียนเรื่องราว** - เขียนเรื่องราวประกอบรูปภาพได้อย่างเต็มที่
- 🎨 **UI สวยงาม** - ใช้ Material-UI พร้อม Custom Theme สีสันสดใส
- ✨ **Animation เต็มรูปแบบ** - ใช้ Framer Motion สร้างการเคลื่อนไหวที่ลื่นไหล
- 📱 **Responsive Design** - รองรับทุกขนาดหน้าจอ
- 🔥 **Firebase Integration** - เก็บข้อมูลและรูปภาพบน Cloud
- 🎯 **State Management** - ใช้ Zustand จัดการ State
- 🖼️ **Masonry Layout** - จัดเรียงการ์ดแบบสวยงาม

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Animation**: Framer Motion
- **Backend**: Firebase (Firestore + Storage)
- **State Management**: Zustand
- **File Upload**: React Dropzone
- **Layout**: React Masonry CSS

## 📦 Installation

### 1. Clone หรือสร้างโปรเจค

```bash
cd book-of-story
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Firebase

1. สร้างโปรเจคใน [Firebase Console](https://console.firebase.google.com/)
2. เปิดใช้งาน **Firestore Database**
3. เปิดใช้งาน **Storage**
4. ตั้งค่า Security Rules ใน Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /stories/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

5. คัดลอก Firebase Config จาก Project Settings

### 4. สร้างไฟล์ Environment Variables

สร้างไฟล์ `.env.local` และเพิ่มข้อมูล Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. รันโปรเจค

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## 📁 Project Structure

```
book-of-story/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── masonry.css         # Masonry layout styles
├── components/
│   ├── StoryCard.tsx       # การ์ดแสดงเรื่องราว
│   ├── StoryModal.tsx      # Modal ดูรายละเอียด
│   ├── StoryForm.tsx       # ฟอร์มสร้าง/แก้ไข
│   ├── DeleteConfirmDialog.tsx
│   ├── LoadingScreen.tsx
│   └── EmptyState.tsx
├── services/
│   └── storyService.ts     # Firebase operations
├── store/
│   └── storyStore.ts       # Zustand store
├── lib/
│   └── firebase.ts         # Firebase config
├── theme/
│   └── theme.ts            # MUI theme
└── types/
    └── story.ts            # TypeScript types
```

## 🎨 Features Detail

### 1. สร้างเรื่องราว
- อัพโหลดรูปภาพด้วย Drag & Drop
- เขียนชื่อเรื่องและเนื้อหา
- Preview รูปภาพก่อนบันทึก

### 2. แสดงผล
- Masonry Layout ปรับขนาดอัตโนมัติ
- Animation เมื่อ Hover
- รองรับ Mobile และ Tablet

### 3. แก้ไขและลบ
- แก้ไขเรื่องราวและรูปภาพ
- ยืนยันก่อนลบ
- อัพเดทแบบ Real-time

### 4. Responsive Design
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

## 🎯 การใช้งาน

1. **สร้างเรื่องราวใหม่**: คลิกปุ่ม "+" ที่มุมล่างขวา หรือในหน้าว่าง
2. **ดูรายละเอียด**: คลิกที่การ์ดหรือปุ่มตา
3. **แก้ไข**: คลิกปุ่มแก้ไข (ปากกา) บนการ์ด
4. **ลบ**: คลิกปุ่มลบ (ถังขยะ) และยืนยัน

## 🔧 Custom Theme

ปรับแต่งสีและ Style ได้ที่ `theme/theme.ts`:

```typescript
palette: {
  primary: {
    main: '#FF6B9D',  // สีชมพู
  },
  secondary: {
    main: '#9D6BFF',  // สีม่วง
  },
}
```

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

## 🤝 Contributing

ยินดีรับ Pull Request และ Issue ทุกประเภท

---

Made with ❤️ using Next.js + TypeScript + MUI + Firebase
