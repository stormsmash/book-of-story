import { supabase } from "@/lib/supabase";
import { Story, StoryFormData, Photo } from "@/types/story";

const TABLE_NAME = "stories";
const BUCKET_NAME = "stories";

export const storyService = {
  // อัพโหลดรูปภาพ
  async uploadImage(file: File): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    return publicUrl;
  },

  // ลบรูปภาพ
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract filename from URL
      const fileName = imageUrl.split("/").pop();
      if (!fileName) return;

      const { error } = await supabase.storage.from(BUCKET_NAME).remove([fileName]);

      if (error) {
        console.error("Error deleting image:", error);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  },

  // สร้าง Story ใหม่
  async createStory(data: StoryFormData): Promise<Story> {
    let imageUrl = "";

    if (data.imageFile) {
      imageUrl = await this.uploadImage(data.imageFile);
    }

    const storyData = {
      title: data.title,
      story: data.story,
      image_url: imageUrl,
      theme_color: data.themeColor || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newStory, error } = await supabase.from(TABLE_NAME).insert([storyData]).select().single();

    if (error) {
      throw error;
    }

    return {
      id: String(newStory.id),
      title: newStory.title,
      story: newStory.story,
      imageUrl: newStory.image_url,
      themeColor: newStory.theme_color,
      createdAt: new Date(newStory.created_at),
      updatedAt: new Date(newStory.updated_at),
    };
  },

  // ดึงข้อมูล Stories ทั้งหมด
  async getStories(): Promise<Story[]> {
    const { data, error } = await supabase.from(TABLE_NAME).select("*, photos(count)").order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map((item) => ({
      id: String(item.id),
      title: item.title,
      story: item.story,
      imageUrl: item.image_url,
      themeColor: item.theme_color,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      photoCount: item.photos ? item.photos[0]?.count : 0,
    }));
  },

  // ดึงรูปภาพในอัลบั้ม
  async getAlbumPhotos(albumId: string): Promise<Photo[]> {
    const { data, error } = await supabase.from("photos").select("*").eq("album_id", albumId).order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item) => ({
      id: String(item.id),
      albumId: String(item.album_id),
      imageUrl: item.image_url,
      caption: item.caption,
      createdAt: new Date(item.created_at),
    }));
  },

  // เพิ่มรูปภาพในอัลบั้ม
  async addPhotoToAlbum(albumId: string, file: File, caption?: string): Promise<Photo> {
    const fileName = `photos/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("photos")
      .insert([
        {
          album_id: albumId,
          image_url: publicUrl,
          caption: caption,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: String(data.id),
      albumId: String(data.album_id),
      imageUrl: data.image_url,
      caption: data.caption,
      createdAt: new Date(data.created_at),
    };
  },

  // ลบรูปภาพจากอัลบั้ม
  async deletePhoto(photoId: string, imageUrl: string): Promise<void> {
    // Delete from storage
    const fileName = imageUrl.split("/").pop();
    if (fileName) {
      await supabase.storage.from(BUCKET_NAME).remove([`photos/${fileName}`]);
    }

    // Delete from DB
    const { error } = await supabase.from("photos").delete().eq("id", photoId);
    if (error) throw error;
  },

  // อัพเดทคำบรรยายรูปภาพ
  async updatePhoto(photoId: string, caption: string): Promise<void> {
    const { error } = await supabase
      .from("photos")
      .update({ caption }) // Note: photos table might need updated_at if we want to track it, but for now just update caption
      .eq("id", photoId);

    if (error) throw error;
  },

  // อัพเดทรูปภาพและคำบรรยาย
  async updatePhotoImage(photoId: string, file: File, caption: string): Promise<void> {
    // Get current photo to delete old image
    const { data: currentPhoto, error: fetchError } = await supabase.from("photos").select("image_url").eq("id", photoId).single();

    if (fetchError) throw fetchError;

    // Upload new image
    const fileName = `photos/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    // Update database
    const { error: updateError } = await supabase.from("photos").update({ image_url: publicUrl, caption }).eq("id", photoId);

    if (updateError) throw updateError;

    // Delete old image
    if (currentPhoto?.image_url) {
      const oldFileName = currentPhoto.image_url.split("/").pop();
      if (oldFileName) {
        await supabase.storage.from(BUCKET_NAME).remove([`photos/${oldFileName}`]);
      }
    }
  },

  // อัพเดท Story
  async updateStory(id: string, data: Partial<StoryFormData>): Promise<void> {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.story !== undefined) updateData.story = data.story;
    if (data.themeColor !== undefined) updateData.theme_color = data.themeColor;

    if (data.imageFile) {
      updateData.image_url = await this.uploadImage(data.imageFile);
    }

    const { error } = await supabase.from(TABLE_NAME).update(updateData).eq("id", id);

    if (error) {
      throw error;
    }
  },

  // ลบ Story
  async deleteStory(id: string, imageUrl: string): Promise<void> {
    // 1. Delete all photos in the album from storage
    try {
      const photos = await this.getAlbumPhotos(id);
      const filesToRemove = photos
        .map((photo) => {
          const fileName = photo.imageUrl.split("/").pop();
          return fileName ? `photos/${fileName}` : null;
        })
        .filter((f) => f !== null) as string[];

      if (filesToRemove.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(filesToRemove);
      }
    } catch (error) {
      console.error("Error deleting album photos:", error);
    }

    // 2. Delete cover image
    if (imageUrl) {
      await this.deleteImage(imageUrl);
    }

    // 3. Delete story
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) {
      throw error;
    }
  },
};
