import React, { useState } from "react";
import { Typography, TypographyProps, Box, Button } from "@mui/material";

interface ReadMoreTypographyProps extends TypographyProps {
  text: string;
  lines?: number;
}

export const ReadMoreTypography = ({ text, lines = 1, sx, ...props }: ReadMoreTypographyProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLongText = text.length > 50;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <Typography
        {...props}
        sx={{
          ...sx,
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "unset" : lines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "pre-wrap",
          textAlign: "center",
          wordBreak: "break-word",
        }}>
        {text}
      </Typography>
      {isLongText && (
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          sx={{
            mt: 0.5,
            minWidth: "auto",
            p: 0.5,
            fontSize: "0.75rem",
            color: "#000000",
            textTransform: "none",
          }}>
          {isExpanded ? "ย่อลง" : "อ่านต่อ"}
        </Button>
      )}
    </Box>
  );
};
