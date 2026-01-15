"use client";

import React, { useState, useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton, Alert, LinearProgress } from "@mui/material";
import { Close, CloudUpload, Image as ImageIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import imageCompression from "browser-image-compression";

interface PhotoUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, caption: string) => Promise<void>;
  albumTitle: string;
}

export const PhotoUploadDialog = ({ open, onClose, onUpload, albumTitle }: PhotoUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
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
    maxSize: 10485760,
  });

  const handleSubmit = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!selectedFile) {
      setError("กรุณาเลือกรูปภาพ");
      return;
    }

    setLoading(true);
    setError("");

    let fileToUpload = selectedFile;

    // Apply compression if the file is larger than 1MB
    if (selectedFile.size > 1024 * 1024) {
      setCompressing(true);
      setCompressionProgress(0);
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (progress: number) => {
            setCompressionProgress(progress);
          },
        };

        setOriginalSize(selectedFile.size);
        fileToUpload = await imageCompression(selectedFile, options);
        setCompressedSize(fileToUpload.size);
      } catch (err) {
        console.error("Compression error:", err);
        // Fallback to original file if compression fails
      } finally {
        setCompressing(false);
      }
    }

    try {
      await onUpload(fileToUpload, caption);
      handleClose();
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการอัปโหลด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview("");
    setCaption("");
    setError("");
    setOriginalSize(null);
    setCompressedSize(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" component="h2" fontWeight={600}>
              เพิ่มรูปภาพ
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {albumTitle}
            </Typography>
          </Box>
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

        <Box mb={3}>
          <motion.div whileHover={{ scale: preview ? 1 : 1.01 }} transition={{ duration: 0.2 }}>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: isDragActive ? "primary.main" : preview ? "success.main" : "divider",
                borderRadius: 3,
                p: 3,
                textAlign: "center",
                cursor: loading ? "not-allowed" : "pointer",
                bgcolor: isDragActive ? "action.hover" : preview ? "success.50" : "background.paper",
                transition: "all 0.3s ease",
                position: "relative",
                minHeight: preview ? 400 : 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                pointerEvents: loading ? "none" : "auto",
              }}>
              <input {...getInputProps()} disabled={loading} />

              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      minHeight: 400,
                    }}>
                    <Image src={preview} alt="Preview" fill style={{ objectFit: "contain" }} />

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreview("");
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.7)",
                        },
                      }}
                      size="small">
                      <Close />
                    </IconButton>

                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "white",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                      }}>
                      <Typography variant="caption">{selectedFile?.name}</Typography>
                    </Box>
                  </motion.div>
                ) : (
                  <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <CloudUpload
                      sx={{
                        fontSize: 64,
                        color: isDragActive ? "primary.main" : "action.disabled",
                        mb: 2,
                        transition: "all 0.3s ease",
                      }}
                    />
                    <Typography variant="h6" color={isDragActive ? "primary" : "text.secondary"} gutterBottom>
                      {isDragActive ? "วางรูปภาพที่นี่..." : "ลากรูปภาพมาวางที่นี่"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      หรือคลิกเพื่อเลือกรูป
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      รองรับ JPG, PNG, GIF, WebP (ขนาดไม่เกิน 10MB)
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </motion.div>
        </Box>

        <TextField fullWidth label="คำบรรยายภาพ" value={caption} onChange={(e) => setCaption(e.target.value)} multiline rows={4} placeholder="เขียนคำบรรยายสำหรับรูปภาพนี้... (ไม่บังคับ)" inputProps={{ maxLength: 500 }} helperText={`${caption.length}/500 ตัวอักษร`} disabled={loading} />

        {compressing && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={compressionProgress} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "center" }}>
              กำลังย่อขนาดรูปภาพ ({compressionProgress}%)...
            </Typography>
          </Box>
        )}

        {loading && !compressing && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block", textAlign: "center" }}>
              กำลังอัปโหลด...
            </Typography>
          </Box>
        )}

        {compressedSize && originalSize && (
          <Typography variant="caption" color="success.main" sx={{ mt: 1, display: "block", textAlign: "center" }}>
            ย่อขนาดสำเร็จ: {(originalSize / 1024 / 1024).toFixed(2)}MB → {(compressedSize / 1024 / 1024).toFixed(2)}MB
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading} type="button">
          ยกเลิก
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!selectedFile || loading} startIcon={<CloudUpload />} type="button">
          {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
