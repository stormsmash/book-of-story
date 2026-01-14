import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { Photo, CalendarToday } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Story } from "@/types/story";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface BookCoverProps {
  story: Story;
  onClick: () => void;
  onLoad?: () => void;
}

export const BookCover = ({ story, onClick, onLoad }: BookCoverProps) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), "d MMM yy", { locale: th });
  };

  React.useEffect(() => {
    if (!story.imageUrl && onLoad) {
      onLoad();
    }
  }, [story.imageUrl, onLoad]);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 0 }}
      animate={{ opacity: 1, rotateY: 0 }}
      whileHover={{
        scale: 1.03,
        rotateY: -8,
        rotateX: 3,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        perspective: 1200,
        cursor: "pointer",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}>
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          aspectRatio: "3/4",
          position: "relative",
          borderRadius: "4px 16px 16px 4px",
          overflow: "hidden",
          background: `linear-gradient(to right, 
            #2a2a2a 0%, 
            #4a4a4a 3%, 
            ${story.themeColor || stringToColor(story.title)} 3%, 
            ${lightenColor(story.themeColor || stringToColor(story.title), 20)} 100%)`,
          transition: "box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          "&:hover": {
            boxShadow: "12px 12px 32px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.15)",
            "& .photo-badge": {
              transform: "translateY(-2px)",
            },
            "& .cover-image": {
              transform: "scale(1.05)",
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "20px",
            background: "linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.3) 100%)",
            zIndex: 1,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            right: 0,
            top: "8px",
            bottom: "8px",
            width: "8px",
            background: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 2px)",
            opacity: 0.6,
            zIndex: 0,
          },
        }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "12px",
            background: "linear-gradient(to right, rgba(255,255,255,0.4), rgba(0,0,0,0.2))",
            borderRight: "1px solid rgba(0,0,0,0.3)",
            boxShadow: "inset -1px 0 2px rgba(0,0,0,0.3)",
            zIndex: 2,
          }}
        />

        {story.photoCount !== undefined && story.photoCount > 0 && (
          <Chip
            className="photo-badge"
            icon={<Photo sx={{ fontSize: { xs: 16, sm: 14 } }} />}
            label={story.photoCount}
            size="small"
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 16 },
              bgcolor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(2px)",
              fontWeight: 700,
              fontSize: { xs: "0.85rem", sm: "0.75rem" },
              height: { xs: 28, sm: 26 },
              px: { xs: 1, sm: 0.5 },
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              transition: "transform 0.3s ease",
              zIndex: 3,
              "& .MuiChip-icon": {
                color: story.themeColor || stringToColor(story.title),
                marginLeft: { xs: "4px", sm: "0px" },
              },
              "& .MuiChip-label": {
                paddingLeft: { xs: "6px", sm: "8px" },
                paddingRight: { xs: "8px", sm: "12px" },
              },
            }}
          />
        )}

        <Box
          sx={{
            position: "absolute",
            top: "8%",
            left: "12%",
            right: "8%",
            bottom: "8%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            border: {
              xs: "2.5px solid rgba(255,255,255,0.7)",
              sm: "3px solid rgba(255,255,255,0.6)",
            },
            borderRadius: 1,
            padding: { xs: 1.5, sm: 2 },
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
            boxShadow: "inset 0 2px 8px rgba(255,255,255,0.25)",
          }}>
          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              position: "relative",
              overflow: "hidden",
              borderRadius: 1,
            }}>
            {story.imageUrl ? (
              <>
                <Box
                  className="cover-image"
                  component="img"
                  src={story.imageUrl}
                  alt={story.title}
                  onLoad={onLoad}
                  onError={onLoad}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 1,
                    // boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    transition: "transform 0.3s ease",
                    filter: "contrast(1.1) saturate(1.15)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : (
              <Box
                sx={{
                  fontSize: { xs: "3.5rem", sm: "4rem" },
                  opacity: 0.9,
                  filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))",
                }}>
                📸
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                color: "#000000",
                // textShadow: "2px 2px 8px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.6)",
                fontFamily: "'Playfair Display', 'Noto Serif Thai', serif",
                mb: 0.5,
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                letterSpacing: "0.02em",
              }}>
              {story.title}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: "rgba(255, 255, 255, 0.75)",
                px: { xs: 1.2, sm: 1 },
                py: { xs: 0.5, sm: 0.3 },
                borderRadius: 1,
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}>
              <CalendarToday
                sx={{
                  fontSize: { xs: 12, sm: 12 },
                  color: "#000000",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.7rem" },
                  fontWeight: 600,
                  color: "#000000",
                  // textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                }}>
                {formatDate(story.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {[
          { top: "6%", left: "10%" },
          { top: "6%", right: "6%" },
          { bottom: "6%", left: "10%" },
          { bottom: "6%", right: "6%" },
        ].map((position, index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              ...position,
              width: { xs: 14, sm: 16 },
              height: { xs: 14, sm: 16 },
              border: {
                xs: "2.5px solid rgba(255, 255, 255, 0.8)",
                sm: "2px solid rgba(255, 255, 255, 0.75)",
              },
              ...(position.top !== undefined &&
                position.left !== undefined && {
                  borderRight: "none",
                  borderBottom: "none",
                }),
              ...(position.top !== undefined &&
                position.right !== undefined && {
                  borderLeft: "none",
                  borderBottom: "none",
                }),
              ...(position.bottom !== undefined &&
                position.left !== undefined && {
                  borderRight: "none",
                  borderTop: "none",
                }),
              ...(position.bottom !== undefined &&
                position.right !== undefined && {
                  borderLeft: "none",
                  borderTop: "none",
                }),
              pointerEvents: "none",
              zIndex: 3,
              opacity: 0.9,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
            }}
          />
        ))}

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "12%",
            right: 0,
            bottom: 0,
            background: "linear-gradient(45deg, transparent 0%, rgba(255,215,0,0.15) 50%, transparent 100%)",
            pointerEvents: "none",
            opacity: 0.6,
            mixBlendMode: "overlay",
          }}
        />
      </Paper>
    </motion.div>
  );
};

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  const saturation = 65 + (hash % 20);
  const lightness = 45 + (hash % 15);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function lightenColor(color: string, percent: number): string {
  if (color.startsWith("hsl")) {
    const matches = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (matches) {
      const h = matches[1];
      const s = matches[2];
      const l = Math.min(100, parseInt(matches[3]) + percent);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  } else if (color.startsWith("#")) {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.min(255, r + (255 - r) * (percent / 100));
    g = Math.min(255, g + (255 - g) * (percent / 100));
    b = Math.min(255, b + (255 - b) * (percent / 100));

    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return color;
}
