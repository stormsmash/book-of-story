"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { DeleteOutline, WarningAmberRounded, Close } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

interface PhotoDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  photoUrl?: string;
}

export const PhotoDeleteDialog = ({ open, onClose, onConfirm, photoUrl }: PhotoDeleteDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              padding: 0,
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              overflow: "hidden",
              width: "280px",
              margin: "auto",
            },
            component: motion.div,
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
          }}
          maxWidth={false}>
          <Box sx={{ p: 2.5, textAlign: "center" }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "14px",
                background: "rgba(255, 59, 48, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}>
              <DeleteOutline sx={{ fontSize: 28, color: "#FF3B30" }} />
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: "#1a1a1a" }}>
              ลบรูปภาพนี้?
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: "0.85rem", lineHeight: 1.4 }}>
              รูปภาพจะถูกลบออกถาวร
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                sx={{
                  borderRadius: 2,
                  py: 0.8,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  borderColor: "#eee",
                  color: "#666",
                  "&:hover": {
                    borderColor: "#ddd",
                    bgcolor: "rgba(0,0,0,0.02)",
                  },
                }}>
                ยกเลิก
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={onConfirm}
                sx={{
                  borderRadius: 2,
                  py: 0.8,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  bgcolor: "#FF3B30",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#E6352B",
                    boxShadow: "0 4px 12px rgba(255, 59, 48, 0.2)",
                  },
                }}>
                ลบเลย
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
