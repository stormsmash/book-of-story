"use client";

import React, { useState, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton, Alert, LinearProgress } from "@mui/material";
import { Close, Edit, PhotoCamera } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Photo } from "@/types/story";
import Image from "next/image";

interface PhotoEditDialogProps {
  open: boolean;
  onClose: () => void;
  photo: Photo | null;
  onUpdateCaption: (photoId: string, caption: string) => Promise<void>;
  onUpdateImage: (photoId: string, file: File, caption: string) => Promise<void>;
}

export const PhotoEditDialog = ({ open, onClose, photo, onUpdateCaption, onUpdateImage }: PhotoEditDialogProps) => {
  const [caption, setCaption] = useState(photo?.caption || "");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (photo) {
      setCaption(photo.caption || "");
      setNewImageFile(null);
      setNewImagePreview("");
      setError("");
    }
  }, [photo]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setNewImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 10485760, // 10MB
  });

  const handleSave = async () => {
    if (!photo) return;

    setLoading(true);
    setError("");

    try {
      if (newImageFile) {
        await onUpdateImage(photo.id, newImageFile, caption);
      } else {
        await onUpdateCaption(photo.id, caption);
      }
      handleClose();
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCaption(photo?.caption || "");
    setNewImageFile(null);
    setNewImagePreview("");
    setError("");
    onClose();
  };

  if (!photo) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="h2" fontWeight={600}>
            แก้ไขรูปภาพ
          </Typography>
          <IconButton onClick={handleClose} edge="end" disabled={loading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              รูปภาพ
            </Typography>
            <Box
              {...getRootProps()}
              sx={{
                position: "relative",
                width: "100%",
                height: 300,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "grey.100",
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : "transparent",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  "& .upload-overlay": {
                    opacity: 1,
                  },
                },
              }}>
              <input {...getInputProps()} disabled={loading} />

              <Image src={newImagePreview || photo.imageUrl} alt="Preview" fill style={{ objectFit: "contain" }} />

              <Box
                className="upload-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: "rgba(0,0,0,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  color: "white",
                }}>
                <PhotoCamera sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" fontWeight={500}>
                  คลิกเพื่อเปลี่ยนรูปภาพ
                </Typography>
              </Box>

              {newImagePreview && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewImageFile(null);
                    setNewImagePreview("");
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(0,0,0,0.6)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    zIndex: 2,
                  }}
                  size="small">
                  <Close fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          <TextField fullWidth label="คำบรรยายภาพ" value={caption} onChange={(e) => setCaption(e.target.value)} multiline rows={4} placeholder="เขียนคำบรรยายสำหรับรูปภาพนี้..." inputProps={{ maxLength: 500 }} helperText={`${caption.length}/500 ตัวอักษร`} disabled={loading} />
        </Box>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "center" }}>
              กำลังบันทึก...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          ยกเลิก
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
