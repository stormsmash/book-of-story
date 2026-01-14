"use client";

import React, { useState, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton, Alert } from "@mui/material";
import { Close, CloudUpload, Image as ImageIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Story, StoryFormData } from "@/types/story";
import Image from "next/image";

interface StoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StoryFormData) => Promise<void>;
  story?: Story | null;
  mode: "create" | "edit";
}

export const StoryForm = ({ open, onClose, onSubmit, story, mode }: StoryFormProps) => {
  const [formData, setFormData] = useState<StoryFormData>({
    title: story?.title || "",
    story: story?.story || "",
    themeColor: story?.themeColor || "",
  });
  const [preview, setPreview] = useState<string>(story?.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync state when story prop changes (for edit mode)
  React.useEffect(() => {
    if (open) {
      setFormData({
        title: story?.title || "",
        story: story?.story || "",
        themeColor: story?.themeColor || "",
      });
      setPreview(story?.imageUrl || "");
      setError("");
    }
  }, [story, open]);

  const PRESET_COLORS = ["#FF6B9D", "#FFC371", "#C471ED", "#4facfe", "#00f2fe", "#43e97b", "#f093fb", "#f5576c", "#555555", "#222222"];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("กรุณาใส่ชื่อเรื่อง");
      return;
    }

    if (!formData.story.trim()) {
      setError("กรุณาเขียนเรื่องราว");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", story: "", themeColor: "" });
    setPreview("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" component="h2" fontWeight={600}>
            {mode === "create" ? "สร้างอัลบั้มรูปใหม่" : "แก้ไขอัลบั้มรูป"}
          </Typography>
          <IconButton onClick={handleClose} edge="end">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom fontWeight={500}>
              รูปภาพ{" "}
              <Typography component="span" variant="caption" color="text.secondary">
                (ไม่บังคับ)
              </Typography>
            </Typography>

            <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed",
                  borderColor: isDragActive ? "primary.main" : "divider",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: isDragActive ? "action.hover" : "background.paper",
                  transition: "all 0.3s ease",
                  position: "relative",
                  minHeight: preview ? 300 : 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}>
                <input {...getInputProps()} />

                {preview ? (
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      minHeight: 300,
                    }}>
                    <Image src={preview} alt="Preview" fill style={{ objectFit: "contain" }} />
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      {isDragActive ? "วางรูปภาพที่นี่..." : "ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกรูป"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      รองรับ JPG, PNG, GIF, WebP
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Box>

          <TextField fullWidth label="ชื่ออัลบั้ม" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required sx={{ mb: 3 }} inputProps={{ maxLength: 100 }} />

          <TextField fullWidth label="เนื้อหา" value={formData.story} onChange={(e) => setFormData({ ...formData, story: e.target.value })} multiline rows={8} required placeholder="เขียนเนื้อหาของคุณที่นี่..." inputProps={{ maxLength: 5000 }} helperText={`${formData.story.length}/5000 ตัวอักษร`} sx={{ mb: 3 }} />

          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={500}>
              สีธีมอัลบั้ม{" "}
              <Typography component="span" variant="caption" color="text.secondary">
                (เพื่อความสวยงาม)
              </Typography>
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
              <Box
                onClick={() => setFormData({ ...formData, themeColor: "" })}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid",
                  borderColor: formData.themeColor === "" || !formData.themeColor ? "primary.main" : "transparent",
                  bgcolor: "grey.200",
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  AUTO
                </Typography>
              </Box>
              {PRESET_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setFormData({ ...formData, themeColor: color })}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    cursor: "pointer",
                    bgcolor: color,
                    border: "2px solid",
                    borderColor: formData.themeColor === color ? "white" : "transparent",
                    boxShadow: formData.themeColor === color ? `0 0 0 2px ${color}` : "none",
                    transition: "all 0.2s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "กำลังบันทึก..." : mode === "create" ? "สร้างอัลบั้ม" : "บันทึกการแก้ไข"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
