"use client";

import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button, Grid, Fab, Snackbar, Alert, AppBar, Toolbar, useScrollTrigger, Slide, Paper, Stack, IconButton } from "@mui/material";
import { Add, AutoStories, Edit, Delete } from "@mui/icons-material";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStoryStore } from "@/store/storyStore";
import { storyService } from "@/services/storyService";
import { BookCover } from "@/components/BookCover";
import { StoryForm } from "@/components/StoryForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { LoadingScreen } from "@/components/LoadingScreen";
import { EmptyState } from "@/components/EmptyState";
import { Story, StoryFormData } from "@/types/story";

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Home() {
  const router = useRouter();
  const { stories, selectedStory, isLoading, setStories, addStory, updateStory, deleteStory, setSelectedStory, setIsLoading } = useStoryStore();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.3]);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const data = await storyService.getStories();
      setStories(data);
    } catch (error) {
      showSnackbar("ไม่สามารถโหลดข้อมูลได้", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStory = async (data: StoryFormData) => {
    try {
      const newStory = await storyService.createStory(data);
      addStory(newStory);
      showSnackbar("สร้างอัลบั้มรูปสำเร็จ!", "success");
    } catch (error) {
      showSnackbar("เกิดข้อผิดพลาดในการสร้างอัลบั้มรูป", "error");
      throw error;
    }
  };

  const handleUpdateStory = async (data: StoryFormData) => {
    if (!selectedStory) return;
    try {
      await storyService.updateStory(selectedStory.id, data);
      updateStory(selectedStory.id, {
        ...data,
        imageUrl: data.imageFile ? "" : selectedStory.imageUrl,
        updatedAt: new Date(),
      });
      showSnackbar("แก้ไขอัลบั้มรูปสำเร็จ!", "success");
      await loadStories();
    } catch (error) {
      showSnackbar("เกิดข้อผิดพลาดในการแก้ไข", "error");
      throw error;
    }
  };

  const handleDeleteStory = async () => {
    if (!storyToDelete) return;
    try {
      await storyService.deleteStory(storyToDelete.id, storyToDelete.imageUrl);
      deleteStory(storyToDelete.id);
      setDeleteDialogOpen(false);
      setStoryToDelete(null);
      showSnackbar("ลบอัลบั้มรูปสำเร็จ!", "success");
    } catch (error) {
      showSnackbar("เกิดข้อผิดพลาดในการลบ", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditStory = (story: Story) => {
    setSelectedStory(story);
    setFormMode("edit");
    setFormModalOpen(true);
  };

  const handleDeleteClick = (story: Story) => {
    setStoryToDelete(story);
    setDeleteDialogOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedStory(null);
    setFormMode("create");
    setFormModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Text reveal animation
  const titleText = "Photo Albums";

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <>
      {/* App Bar with slide animation */}
      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #FADCDC 0%, #FAE0D8 50%, #FFE5E8 100%)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(250, 220, 220, 0.3)",
            minHeight: { xs: 56, sm: 64 },
          }}>
          <Toolbar sx={{ py: { xs: 0.5, sm: 0.75 }, minHeight: { xs: 56, sm: 64 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5 },
                flexGrow: 1,
              }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}>
                <Box
                  sx={{
                    background: "rgba(250, 220, 220, 0.4)",
                    borderRadius: { xs: 1.5, sm: 2 },
                    p: { xs: 0.75, sm: 1 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <AutoStories sx={{ fontSize: { xs: 22, sm: 28 }, color: "#C67B7B" }} />
                </Box>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <Box>
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      letterSpacing: "-0.02em",
                      color: "#8B5A5A",
                    }}>
                    Photo Albums
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: { xs: "none", sm: "block" },
                      opacity: 0.9,
                      fontSize: "0.75rem",
                      color: "#A67373",
                    }}>
                    บันทึกความทรงจำ
                  </Typography>
                </Box>
              </motion.div>
            </Box>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.35 }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                color="inherit"
                startIcon={<Add sx={{ fontSize: { xs: 20, sm: 22, md: 24 } }} />}
                onClick={handleCreateClick}
                size="small"
                sx={{
                  bgcolor: "rgba(250, 220, 220, 0.55)",
                  color: "#8B5A5A",
                  backdropFilter: "blur(6px)",
                  "&:hover": {
                    bgcolor: "rgba(250, 220, 220, 0.75)",
                  },
                  borderRadius: { xs: 2, sm: 2.5, md: 3 },
                  px: { xs: 2, sm: 2.5, md: 3.5 },
                  py: { xs: 0.8, sm: 1, md: 1.1 },
                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                  fontWeight: 600,
                  minWidth: { xs: "auto", sm: "110px", md: "130px" },
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.25s ease",
                }}>
                <Box component="span" sx={{ display: { xs: "inline", sm: "inline" } }}>
                  สร้าง
                </Box>
              </Button>
            </motion.div>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Main Content */}
      <Box
        sx={{
          minHeight: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
          background: "linear-gradient(180deg, #FFF5F5 0%, #FFFAFA 100%)",
          position: "relative",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "300px",
            background: "radial-gradient(circle at 50% 0%, rgba(250, 220, 220, 0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}>
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 1.5, sm: 2, md: 2 },
            px: { xs: 2, sm: 2, md: 3 },
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}>
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <Box sx={{ mb: { xs: 1.5, sm: 2, md: 2.5 }, textAlign: "center" }}>
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                  background: "linear-gradient(135deg, #C67B7B 0%, #D89A9A 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: { xs: 0.5, sm: 1 },
                }}>
                {titleText}
              </Typography>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 500,
                    mx: "auto",
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    lineHeight: 1.6,
                    display: { xs: "none", sm: "block" },
                    color: "#A67373",
                  }}>
                  เก็บรักษาความทรงจำอันล้ำค่า
                </Typography>
              </motion.div>
              {!isLoading && stories.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1, duration: 0.5, type: "spring" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      display: "inline-block",
                      px: { xs: 2, sm: 2.5 },
                      py: { xs: 0.5, sm: 0.75 },
                      mt: { xs: 1, sm: 2 },
                      borderRadius: 2,
                      background: "rgba(250, 220, 220, 0.3)",
                      border: "1px solid rgba(250, 220, 220, 0.5)",
                    }}>
                    <Typography variant="body2" fontSize={{ xs: "0.8rem", sm: "0.875rem" }} color="text.secondary">
                      ทั้งหมด{" "}
                      <motion.span key={stories.length} initial={{ scale: 1.5, color: "#C67B7B" }} animate={{ scale: 1, color: "inherit" }} transition={{ duration: 0.5 }} style={{ display: "inline-block", fontWeight: 700 }}>
                        {stories.length}
                      </motion.span>{" "}
                      อัลบั้ม
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </Box>
          </motion.div>

          {isLoading && <LoadingScreen />}

          {!isLoading && stories.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <EmptyState onCreateClick={handleCreateClick} />
            </motion.div>
          )}

          {/* Enhanced Grid with Stagger Animation */}
          {!isLoading && stories.length > 0 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
                <AnimatePresence mode="popLayout">
                  {stories.map((story, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={story.id}>
                      <motion.div
                        layout
                        variants={itemVariants}
                        custom={index}
                        whileHover={{
                          y: -12,
                          scale: 1.03,
                          rotateZ: index % 2 === 0 ? 2 : -2,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          },
                        }}
                        whileTap={{ scale: 0.98 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: { xs: 2, sm: 3 },
                            overflow: "hidden",
                            background: "#fff",
                            border: "1px solid rgba(250, 220, 220, 0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 12px 32px rgba(250, 220, 220, 0.4)",
                              borderColor: "rgba(250, 220, 220, 0.6)",
                            },
                          }}>
                          <Box onClick={() => router.push(`/album/${story.id}`)} sx={{ cursor: "pointer" }}>
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                              <BookCover story={story} onClick={() => {}} />
                            </motion.div>
                          </Box>
                          <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                            <Stack direction="row" spacing={0.5} justifyContent="center">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditStory(story);
                                  }}
                                  sx={{
                                    color: "#C67B7B",
                                    bgcolor: "rgba(250, 220, 220, 0.3)",
                                    "&:hover": {
                                      bgcolor: "rgba(250, 220, 220, 0.5)",
                                      transform: "rotate(15deg)",
                                    },
                                    transition: "all 0.3s ease",
                                    width: { xs: 32, sm: 36 },
                                    height: { xs: 32, sm: 36 },
                                  }}>
                                  <Edit sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                </IconButton>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(story);
                                  }}
                                  sx={{
                                    color: "#D87B7B",
                                    bgcolor: "rgba(216, 123, 123, 0.1)",
                                    "&:hover": {
                                      bgcolor: "rgba(216, 123, 123, 0.2)",
                                      transform: "rotate(-15deg)",
                                    },
                                    transition: "all 0.3s ease",
                                    width: { xs: 32, sm: 36 },
                                    height: { xs: 32, sm: 36 },
                                  }}>
                                  <Delete sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                </IconButton>
                              </motion.div>
                            </Stack>
                          </Box>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </motion.div>
          )}
        </Container>
      </Box>

      {/* Enhanced FAB with Floating Animation */}
      {!isLoading && stories.length > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          variants={floatingVariants}
          whileHover={{
            scale: 1.1,
            rotate: 90,
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.9 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 9999,
          }}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleCreateClick}
            size="medium"
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              background: "linear-gradient(135deg, #FADCDC 0%, #FAE0D8 100%)",
              color: "#8B5A5A",
              boxShadow: "0 4px 16px rgba(250, 220, 220, 0.5)",
              "&:hover": {
                background: "linear-gradient(135deg, #FAE0D8 0%, #FADCDC 100%)",
                boxShadow: "0 8px 32px rgba(250, 220, 220, 0.6)",
              },
              transition: "all 0.3s ease",
            }}>
            <Add sx={{ fontSize: { xs: 24, sm: 28 } }} />
          </Fab>
        </motion.div>
      )}

      <StoryForm open={formModalOpen} onClose={() => setFormModalOpen(false)} onSubmit={formMode === "create" ? handleCreateStory : handleUpdateStory} story={selectedStory} mode={formMode} />

      <DeleteConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDeleteStory} title={storyToDelete?.title || ""} />

      <AnimatePresence>
        {snackbar.open && (
          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.8 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                variant="filled"
                sx={{
                  borderRadius: 2,
                  minWidth: { xs: 280, sm: 300 },
                  fontSize: { xs: "0.85rem", sm: "0.875rem" },
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                }}>
                {snackbar.message}
              </Alert>
            </motion.div>
          </Snackbar>
        )}
      </AnimatePresence>
    </>
  );
}
