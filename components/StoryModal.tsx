"use client";

import React from "react";
import { Dialog, IconButton, Box, Typography, Divider } from "@mui/material";
import { Close } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Story } from "@/types/story";
import Image from "next/image";

interface StoryModalProps {
  story: Story | null;
  open: boolean;
  onClose: () => void;
}

export const StoryModal = ({ story, open, onClose }: StoryModalProps) => {
  if (!story) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                zIndex: 1300,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                "&:hover": {
                  bgcolor: "white",
                },
              }}>
              <Close />
            </IconButton>

            <div className="open-book">
              <div className="paper-texture"></div>

              <motion.div className="open-book-left" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  {story.imageUrl && (
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        maxHeight: "100%",
                        aspectRatio: "3/4",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}>
                      <Image src={story.imageUrl} alt={story.title} fill style={{ objectFit: "cover" }} priority />
                    </Box>
                  )}
                </Box>
              </motion.div>

              <motion.div className="open-book-right" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Typography
                      variant="h3"
                      component="h2"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        background: "linear-gradient(45deg, #FF6B9D 30%, #9D6BFF 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 2,
                        fontFamily: '"Noto Sans Thai", sans-serif',
                      }}>
                      {story.title}
                    </Typography>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        mb: 3,
                        display: "block",
                        color: "text.secondary",
                        fontStyle: "italic",
                      }}>
                      {new Date(story.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </motion.div>

                  <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.1)" }} />

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 2.2,
                        color: "text.primary",
                        whiteSpace: "pre-wrap",
                        fontFamily: '"Noto Sans Thai", serif',
                        fontSize: "1.1rem",
                        textAlign: "justify",
                        textIndent: "2em",
                      }}>
                      {story.story}
                    </Typography>
                  </motion.div>
                </Box>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
