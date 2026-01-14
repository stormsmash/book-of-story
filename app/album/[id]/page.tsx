"use client";

import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Grid, Fab, IconButton, Snackbar, Alert, Switch, FormControlLabel, Skeleton, GlobalStyles } from "@mui/material";
import { Add, ArrowBack, Delete, Edit } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useStoryStore } from "@/store/storyStore";
import { storyService } from "@/services/storyService";
import { Photo, Story } from "@/types/story";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PhotoUploadDialog } from "@/components/PhotoUploadDialog";
import { PhotoEditDialog } from "@/components/PhotoEditDialog";
import { StoryForm } from "@/components/StoryForm";
import { StoryFormData } from "@/types/story";
import { ReadMoreTypography } from "@/components/ReadMoreTypography";
import { PhotoDeleteDialog } from "@/components/PhotoDeleteDialog";

import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import lgRotate from "lightgallery/plugins/rotate";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lg-rotate.css";

const GalleryThumbnail = ({ photo }: { photo: Photo }) => {
  const [loaded, setLoaded] = useState(false);

  const isLongCaption = (photo.caption || "").length > 50;
  const captionHtml = isLongCaption
    ? `<div class="lg-caption-container">
        <input type="checkbox" id="lg-readmore-${photo.id}" class="lg-readmore-checkbox" />
        <div class="lg-caption-content">
          <h4>${photo.caption}</h4>
        </div>
        <label for="lg-readmore-${photo.id}" class="lg-readmore-label"></label>
      </div>`
    : `<h4>${photo.caption || ""}</h4>`;

  return (
    <a data-src={photo.imageUrl} data-sub-html={captionHtml} className="gallery-item">
      {!loaded && <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" sx={{ borderRadius: 2, position: "absolute", top: 0, left: 0 }} />}
      <img
        className="img-responsive"
        src={photo.imageUrl}
        alt={photo.caption || "Album photo"}
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </a>
  );
};

function lightenColor(color: string, percent: number): string {
  if (color.startsWith("#")) {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.min(255, r + (255 - r) * (percent / 100));
    g = Math.min(255, g + (255 - g) * (percent / 100));
    b = Math.min(255, b + (255 - b) * (percent / 100));

    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return color;
}

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const { stories, setStories } = useStoryStore();
  const [album, setAlbum] = useState<Story | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGalleryMode, setIsGalleryMode] = useState(false);
  const [addPhotoOpen, setAddPhotoOpen] = useState(false);
  const [editPhotoOpen, setEditPhotoOpen] = useState(false);
  const [editAlbumOpen, setEditAlbumOpen] = useState(false);
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const albumId = params.id as string;

  useEffect(() => {
    loadAlbumData();
  }, [albumId]);

  const loadAlbumData = async () => {
    setIsLoading(true);
    try {
      let currentAlbum = stories.find((s) => String(s.id) === albumId);
      if (!currentAlbum) {
        const allStories = await storyService.getStories();
        setStories(allStories);
        currentAlbum = allStories.find((s) => String(s.id) === albumId);
      }
      setAlbum(currentAlbum || null);

      if (currentAlbum) {
        const albumPhotos = await storyService.getAlbumPhotos(albumId);
        setPhotos(albumPhotos);
      }
    } catch (error) {
      showSnackbar("ไม่สามารถโหลดข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUploadPhoto = async (file: File, caption: string) => {
    if (!albumId) {
      showSnackbar("ไม่พบข้อมูลอัลบั้ม", "error");
      return;
    }

    try {
      const newPhoto = await storyService.addPhotoToAlbum(albumId, file, caption);
      setPhotos([newPhoto, ...photos]);
      showSnackbar("อัปโหลดรูปภาพสำเร็จ!", "success");
    } catch (error) {
      showSnackbar("เกิดข้อผิดพลาดในการอัปโหลด", "error");
    }
  };

  const handleUpdateCaption = async (photoId: string, caption: string) => {
    try {
      await storyService.updatePhoto(photoId, caption);
      setPhotos(photos.map((p) => (p.id === photoId ? { ...p, caption } : p)));
      showSnackbar("แก้ไขคำบรรยายสำเร็จ!", "success");
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateImage = async (photoId: string, file: File, caption: string) => {
    try {
      await storyService.updatePhotoImage(photoId, file, caption);
      await loadAlbumData();
      showSnackbar("เปลี่ยนรูปภาพสำเร็จ!", "success");
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateAlbum = async (data: StoryFormData) => {
    if (!album) return;
    try {
      await storyService.updateStory(album.id, data);
      setAlbum({
        ...album,
        title: data.title,
        story: data.story,
      });
      await loadAlbumData();
      showSnackbar("แก้ไขรายละเอียดอัลบั้มสำเร็จ!", "success");
    } catch (error) {
      showSnackbar("เกิดข้อผิดพลาดในการแก้ไขอัลบั้ม", "error");
      throw error;
    }
  };

  const handleDeletePhoto = (photo: Photo) => {
    setPhotoToDelete(photo);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePhoto = async () => {
    if (!photoToDelete) return;
    try {
      await storyService.deletePhoto(photoToDelete.id, photoToDelete.imageUrl);
      setPhotos(photos.filter((p) => p.id !== photoToDelete.id));
      showSnackbar("ลบรูปภาพสำเร็จ!", "success");
    } catch (error) {
      showSnackbar("เกิดข้อผิดพลาดในการลบ", "error");
    } finally {
      setDeleteDialogOpen(false);
      setPhotoToDelete(null);
    }
  };

  const handleEditClick = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditPhotoOpen(true);
  };

  const handleCreateAlbumFromEmpty = async (data: StoryFormData) => {
    try {
      const newStory = await storyService.createStory(data);
      const allStories = await storyService.getStories();
      setStories(allStories);
      showSnackbar("สร้างอัลบั้มสำเร็จ!", "success");
      router.push(`/album/${newStory.id}`);
    } catch (error) {
      showSnackbar("เกิดข้อผิดพลาดในการสร้างอัลบั้ม", "error");
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (!album)
    return (
      <>
        <Box sx={{ p: 4, textAlign: "center", mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            ไม่พบอัลบั้ม
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            อัลบั้มที่คุณต้องการเข้าถึงอาจถูกลบหรือไม่มีอยู่จริง
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push("/")}>
              กลับสู่หน้าหลัก
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setCreateAlbumOpen(true)}>
              สร้างอัลบั้มใหม่
            </Button>
          </Box>
        </Box>
        <StoryForm open={createAlbumOpen} onClose={() => setCreateAlbumOpen(false)} onSubmit={handleCreateAlbumFromEmpty} mode="create" />
      </>
    );
  return (
    <>
      <GlobalStyles
        styles={{
          ".lg-sub-html": {
            backgroundColor: "transparent !important",
            background: "none !important",
            border: "none !important",
            boxShadow: "none !important",
            backdropFilter: "none !important",
            bottom: "20px !important",
            padding: "0 !important",
            maxWidth: "80% !important",
            margin: "0 auto !important",
            left: "0 !important",
            right: "0 !important",
            whiteSpace: "normal !important",
            textAlign: "center !important",
            textShadow: "0 2px 4px rgba(0,0,0,0.9)",
          },
          ".lg-caption-container": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          },
          ".lg-readmore-checkbox": {
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: 0,
            height: 0,
          },
          ".lg-caption-content h4": {
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: "0 !important",
            color: "#fff !important",
            fontSize: "1rem !important",
            fontWeight: "500 !important",
            lineHeight: "1.6 !important",
            textAlign: "center !important",
          },
          ".lg-readmore-checkbox:checked ~ .lg-caption-content h4": {
            WebkitLineClamp: "unset !important",
          },
          ".lg-readmore-label": {
            display: "inline-block",
            cursor: "pointer",
            color: album?.themeColor || "#FF6B9D",
            fontSize: "0.9rem",
            marginTop: "8px",
            fontWeight: 600,
            transition: "all 0.2s ease",
          },
          ".lg-readmore-label:hover": {
            color: "#FFC371 !important",
            textDecoration: "underline",
          },
          ".lg-readmore-label::after": {
            content: '"อ่านต่อ"',
          },
          ".lg-readmore-checkbox:checked ~ .lg-readmore-label::after": {
            content: '"ย่อลง"',
          },
        }}
      />
      <Container maxWidth="xl" sx={{ py: 2, pb: { xs: 10, sm: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push("/")}
            variant="contained"
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 3,
              background: album?.themeColor ? `linear-gradient(135deg, ${album.themeColor} 0%, ${lightenColor(album.themeColor, 30)} 100%)` : "linear-gradient(135deg, #FF6B9D 0%, #FFC371 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              textTransform: "none",
              boxShadow: album?.themeColor ? `0 4px 15px ${album.themeColor}66` : "0 4px 15px rgba(255, 107, 157, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: album?.themeColor ? `linear-gradient(135deg, ${lightenColor(album.themeColor, 10)} 0%, ${album.themeColor} 100%)` : "linear-gradient(135deg, #FFC371 0%, #FF6B9D 100%)",
                transform: "translateY(-2px)",
                boxShadow: album?.themeColor ? `0 6px 20px ${album.themeColor}99` : "0 6px 20px rgba(255, 107, 157, 0.6)",
              },
            }}>
            กลับสู่หน้าอัลบั้ม
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={isGalleryMode}
                onChange={(e) => setIsGalleryMode(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: album?.themeColor || "#FF6B9D",
                    "&:hover": {
                      backgroundColor: album?.themeColor ? `${album.themeColor}14` : "rgba(255, 107, 157, 0.08)",
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: album?.themeColor || "#FF6B9D",
                  },
                }}
              />
            }
            label="Gallery Mode"
            sx={{
              color: "#555",
              "& .MuiTypography-root": { fontWeight: 500, fontSize: { xs: "0.9rem", sm: "1rem" } },
            }}
          />
        </Box>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box
            sx={{
              mb: 2,
              px: 2,
              py: 2,
              textAlign: "center",
              position: "relative",
              borderRadius: 3,
              maxWidth: 800,
              mx: "auto",
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              border: "3px solid",
              borderImageSlice: 1,
              borderImageSource: album?.themeColor ? `linear-gradient(135deg, ${album.themeColor}, ${lightenColor(album.themeColor, 40)})` : "linear-gradient(135deg, #FF6B9D, #FFC371, #C471ED)",
            }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: "#555",
                lineHeight: 1.7,
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}>
              {album.story}
            </Typography>
          </Box>
        </motion.div>
        {photos.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              ยังไม่มีรูปภาพในอัลบั้ม
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              คลิกปุ่ม + ด้านล่างเพื่อเพิ่มรูปภาพแรก
            </Typography>
            <Button variant="outlined" startIcon={<Add />} onClick={() => setAddPhotoOpen(true)}>
              เพิ่มรูปภาพ
            </Button>
          </Box>
        ) : isGalleryMode ? (
          <Box
            sx={{
              minHeight: { xs: "60vh", sm: "70vh", md: "calc(100vh - 280px)" },
              maxHeight: { xs: "none", md: "calc(100vh - 200px)" },
              width: "100%",
              overflow: "auto",
              "& .lg-react-element": {
                height: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignContent: "flex-start",
                gap: { xs: "4px", sm: "8px" },
                padding: { xs: "8px", sm: "12px" },
              },
              "& .lg-outer": {
                height: "100%",
                position: "relative",
              },
              "& .lg-components": {
                height: "100%",
              },
              "& .gallery-item": {
                display: "inline-block",
                margin: 0,
                cursor: "pointer",
                position: "relative",
                flexShrink: 0,
              },
              "& .gallery-item img": {
                width: { xs: "150px", sm: "100px", md: "120px" },
                height: { xs: "150px", sm: "100px", md: "120px" },
                objectFit: "cover",
                borderRadius: "8px",
                transition: "transform 0.2s",
                border: "2px solid",
                borderColor: album?.themeColor ? `${album.themeColor}33` : "rgba(255, 107, 157, 0.2)",
              },
              "& .gallery-item img:hover": {
                transform: "scale(1.05)",
                borderColor: album?.themeColor ? album.themeColor : "rgba(255, 107, 157, 0.5)",
              },
            }}>
            <LightGallery
              key="inline-gallery"
              mode="lg-fade"
              mobileSettings={{
                controls: true,
                showCloseIcon: true,
                download: true,
                rotate: true,
              }}
              inline={true}
              hash={false}
              closable={true}
              rotate={true}
              plugins={[lgThumbnail, lgZoom, lgRotate]}
              thumbnail={true}
              toggleThumb={false}
              animateThumb={true}
              allowMediaOverlap={true}
              showMaximizeIcon={true}
              slideShowAutoplay={false}
              speed={500}
              {...({} as any)}>
              {photos.map((photo) => (
                <GalleryThumbnail key={photo.id} photo={photo} />
              ))}
            </LightGallery>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {photos.map((photo, index) => (
                <Grid item xs={12} sm={6} md={4} key={photo.id}>
                  <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <Box
                      sx={{
                        position: "relative",
                        background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #FF6B9D, #FFC371, #C471ED) border-box",
                        border: "3px solid transparent",
                        overflow: "hidden",
                        boxShadow: "0 8px 24px rgba(255, 107, 157, 0.2)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          boxShadow: album?.themeColor ? `0 12px 40px ${album.themeColor}59` : "0 12px 40px rgba(255, 107, 157, 0.35), 0 0 0 1px rgba(255, 107, 157, 0.1)",
                          transform: "translateY(-8px) scale(1.02)",
                        },
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}>
                      <Box
                        sx={{
                          position: "relative",
                          paddingTop: "100%",
                          bgcolor: "grey.100",
                          overflow: "hidden",
                          "&:hover .action-buttons": {
                            opacity: 1,
                          },
                        }}>
                        <Box
                          component="img"
                          src={photo.imageUrl}
                          alt={photo.caption || "Album photo"}
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          className="action-buttons"
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            display: "flex",
                            gap: 1,
                            opacity: { xs: 1, sm: 0 },
                            transition: "opacity 0.3s ease",
                          }}>
                          <IconButton
                            onClick={() => handleEditClick(photo)}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 107, 157, 0.2)",
                              "&:hover": {
                                bgcolor: "rgba(255, 107, 157, 0.95)",
                                color: "white",
                                transform: "scale(1.1)",
                                border: "1px solid rgba(255, 107, 157, 0.5)",
                              },
                              boxShadow: "0 4px 12px rgba(255, 107, 157, 0.2)",
                              transition: "all 0.3s ease",
                            }}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeletePhoto(photo)}
                            size="small"
                            sx={{
                              bgcolor: "rgba(255, 255, 255, 0.9)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 107, 157, 0.2)",
                              "&:hover": {
                                bgcolor: "rgba(239, 68, 68, 0.95)",
                                color: "white",
                                transform: "scale(1.1)",
                                border: "1px solid rgba(239, 68, 68, 0.5)",
                              },
                              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                              transition: "all 0.3s ease",
                            }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ p: 2, flexGrow: 1, display: "flex", justifyContent: "center" }}>
                        {photo.caption ? (
                          <ReadMoreTypography text={photo.caption} variant="body1" lines={1} sx={{ lineHeight: 1.6 }} />
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            ไม่มีคำบรรยาย
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
      {!isGalleryMode && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
          <Fab
            color="primary"
            aria-label="add photo"
            onClick={(e) => {
              e.stopPropagation();
              setAddPhotoOpen(true);
            }}
            type="button"
            sx={{
              position: "fixed",
              bottom: { xs: 16, sm: 32 },
              right: { xs: 16, sm: 32 },
              width: { xs: 56, sm: 64 },
              height: { xs: 56, sm: 64 },
              bgcolor: album?.themeColor || "primary.main",
              boxShadow: album?.themeColor ? `0 8px 24px ${album.themeColor}66` : "0 8px 24px rgba(255, 107, 157, 0.4)",
              "&:hover": {
                bgcolor: album?.themeColor ? lightenColor(album.themeColor, 10) : "primary.dark",
              },
            }}>
            <Add sx={{ fontSize: { xs: 28, sm: 32 } }} />
          </Fab>
        </motion.div>
      )}

      <PhotoUploadDialog open={addPhotoOpen} onClose={() => setAddPhotoOpen(false)} onUpload={handleUploadPhoto} albumTitle={album.title} />

      <PhotoEditDialog open={editPhotoOpen} onClose={() => setEditPhotoOpen(false)} photo={editingPhoto} onUpdateCaption={handleUpdateCaption} onUpdateImage={handleUpdateImage} />

      <StoryForm open={editAlbumOpen} onClose={() => setEditAlbumOpen(false)} onSubmit={handleUpdateAlbum} story={album} mode="edit" />

      <PhotoDeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setPhotoToDelete(null);
        }}
        onConfirm={confirmDeletePhoto}
        photoUrl={photoToDelete?.imageUrl}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
