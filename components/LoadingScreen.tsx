"use client";

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AutoStories } from "@mui/icons-material";

export const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        overflow: "hidden",
        gap: 3,
      }}>
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}>
        <AutoStories sx={{ fontSize: { xs: 48, sm: 64 }, color: "primary.main" }} />
      </motion.div>

      <CircularProgress size={48} thickness={4} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
          กำลังโหลดอัลบั้มรูป...
        </Typography>
      </motion.div>
    </Box>
  );
};
