"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { AutoStories, Add } from "@mui/icons-material";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        textAlign: "center",
        p: 4,
      }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
        <AutoStories
          sx={{
            fontSize: 120,
            color: "primary.main",
            opacity: 0.5,
            mb: 3,
          }}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          ยังไม่มีเรื่องราว
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          เริ่มต้นสร้างเรื่องราวแรกของคุณและบันทึกความทรงจำอันล้ำค่า
        </Typography>

        <Button variant="contained" size="large" startIcon={<Add />} onClick={onCreateClick} sx={{ borderRadius: 3, px: 4 }}>
          สร้างเรื่องราวแรก
        </Button>
      </motion.div>
    </Box>
  );
};
