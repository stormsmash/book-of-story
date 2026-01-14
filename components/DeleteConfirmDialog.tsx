"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { Warning } from "@mui/icons-material";
import { motion } from "framer-motion";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export const DeleteConfirmDialog = ({ open, onClose, onConfirm, title }: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1.5}>
          <motion.div animate={{ rotate: [0, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
            <Warning color="error" sx={{ fontSize: 32 }} />
          </motion.div>
          <Typography variant="h6" component="span">
            ยืนยันการลบ
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography>
          คุณแน่ใจหรือไม่ที่จะลบเรื่อง <strong>"{title}"</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          ยกเลิก
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          ลบเรื่องราว
        </Button>
      </DialogActions>
    </Dialog>
  );
};
