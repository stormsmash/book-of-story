"use client";

import React from "react";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Story } from "@/types/story";
import Image from "next/image";

interface StoryCardProps {
  story: Story;
  onEdit: (story: Story) => void;
  onDelete: (story: Story) => void;
}

const MotionCard = motion(Card);

export const StoryCard = ({ story, onEdit, onDelete }: StoryCardProps) => {
  const router = useRouter();
  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      sx={{
        position: "relative",
        overflow: "visible",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        boxShadow: "none",
      }}
      onClick={() => router.push(`/album/${story.id}`)}>
      <div className="book-container">
        <div className="book">
          <div
            className="book-cover"
            style={{
              background: story.imageUrl ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${story.imageUrl})` : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 3,
                background: story.imageUrl ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" : "transparent",
              }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#000000",
                  fontWeight: 600,
                  // textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                {story.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#000000",
                  // textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                  display: "block",
                  mt: 0.5,
                }}>
                {new Date(story.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Box>
          </div>

          <div className="book-spine"></div>

          <div className="book-pages-side"></div>
        </div>
      </div>

      <Box
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 1,
          opacity: 0,
          transition: "opacity 0.3s ease",
          zIndex: 10,
          ".MuiCard-root:hover &": {
            opacity: 1,
          },
        }}>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/album/${story.id}`);
            }}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              "&:hover": { bgcolor: "white" },
            }}>
            <Visibility fontSize="small" />
          </IconButton>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(story);
            }}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              "&:hover": { bgcolor: "white" },
            }}>
            <Edit fontSize="small" color="primary" />
          </IconButton>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(story);
            }}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              "&:hover": { bgcolor: "white" },
            }}>
            <Delete fontSize="small" color="error" />
          </IconButton>
        </motion.div>
      </Box>
    </MotionCard>
  );
};
