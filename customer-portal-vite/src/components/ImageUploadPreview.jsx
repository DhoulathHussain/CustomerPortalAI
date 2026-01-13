import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";

const ImageUploadPreview = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    let objectUrl;
    if (value instanceof File) {
      objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
    } else if (typeof value === "string" && value) {
      if (value.startsWith("data:image")) setPreviewUrl(value);
      else setPreviewUrl(`data:image/jpeg;base64,${value}`);
    } else {
      setPreviewUrl(null);
    }
    return () => objectUrl && URL.revokeObjectURL(objectUrl);
  }, [value]);

  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          marginBottom: 8,
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "#999", fontSize: 12 }}>No Image</span>
        )}
      </div>

      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        sx={{ textTransform: "none" }}
      >
        Upload Photo
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUploadPreview;