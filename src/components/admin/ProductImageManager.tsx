import React, { useState, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  X,
  Upload,
  Star,
  Edit2,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  order?: number;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export default function ProductImageManager({
  images,
  onChange,
  maxImages = 10,
}: ProductImageManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID
  const generateId = () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Handle file selection
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploadError(null);
      setIsUploading(true);

      const newImages: ProductImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setUploadError(`${file.name} is not a valid image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError(`${file.name} is too large (max 5MB)`);
          continue;
        }

        // Check max images limit
        if (images.length + newImages.length >= maxImages) {
          setUploadError(`Maximum ${maxImages} images allowed`);
          break;
        }

        // Create local URL for preview (in real app, would upload to server)
        const url = URL.createObjectURL(file);
        const fileName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

        newImages.push({
          id: generateId(),
          url,
          alt: fileName,
          isPrimary: images.length === 0 && newImages.length === 0,
          order: images.length + newImages.length,
        });
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }

      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [images, maxImages, onChange]
  );

  // Handle URL addition
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    // Basic URL validation
    try {
      new URL(urlInput);
    } catch {
      setUploadError("Please enter a valid URL");
      return;
    }

    if (images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImage: ProductImage = {
      id: generateId(),
      url: urlInput.trim(),
      alt: "Product image",
      isPrimary: images.length === 0,
      order: images.length,
    };

    onChange([...images, newImage]);
    setUrlInput("");
    setShowUrlModal(false);
    setUploadError(null);
  };

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    // Update order values
    const reordered = newImages.map((img, i) => ({
      ...img,
      order: i,
      isPrimary: i === 0,
    }));

    onChange(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Set primary image
  const handleSetPrimary = (imageId: string) => {
    const imageIndex = images.findIndex((img) => img.id === imageId);
    if (imageIndex <= 0) return;

    const newImages = [...images];
    const [image] = newImages.splice(imageIndex, 1);
    newImages.unshift(image);

    const reordered = newImages.map((img, i) => ({
      ...img,
      order: i,
      isPrimary: i === 0,
    }));

    onChange(reordered);
  };

  // Delete image
  const handleDelete = (imageId: string) => {
    const newImages = images
      .filter((img) => img.id !== imageId)
      .map((img, i) => ({
        ...img,
        order: i,
        isPrimary: i === 0,
      }));

    onChange(newImages);
  };

  // Start editing alt text
  const handleStartEditAlt = (image: ProductImage) => {
    setEditingAlt(image.id);
    setAltText(image.alt);
  };

  // Save alt text
  const handleSaveAlt = (imageId: string) => {
    const newImages = images.map((img) =>
      img.id === imageId ? { ...img, alt: altText } : img
    );
    onChange(newImages);
    setEditingAlt(null);
    setAltText("");
  };

  return (
    <div className="space-y-4">
      {/* Upload Error */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto p-0.5 hover:bg-destructive/20 rounded-sm"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={image.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative aspect-square bg-secondary rounded-sm overflow-hidden group border-2 transition-all ${
              draggedIndex === index
                ? "opacity-50 border-accent"
                : dragOverIndex === index
                ? "border-accent border-dashed"
                : "border-transparent"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23888' stroke-width='1.5' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
              }}
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center">
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleStartEditAlt(image)}
                  className="p-1.5 bg-background rounded-sm hover:bg-secondary transition-colors"
                  title="Edit alt text"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                {index > 0 && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    className="p-1.5 bg-background rounded-sm hover:bg-secondary transition-colors"
                    title="Set as primary"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  className="p-1.5 bg-background rounded-sm cursor-grab active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-1.5 bg-background rounded-sm hover:bg-destructive/10 text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Primary Badge */}
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-sm font-medium flex items-center gap-1">
                <Star className="h-2.5 w-2.5" /> Primary
              </span>
            )}

            {/* Order Number */}
            <span className="absolute top-1.5 left-1.5 text-[10px] bg-foreground/70 text-background px-1.5 py-0.5 rounded-sm font-mono">
              {index + 1}
            </span>
          </div>
        ))}

        {/* Add Image Button */}
        {images.length < maxImages && (
          <div className="aspect-square border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="product-image-upload"
            />
            <label
              htmlFor="product-image-upload"
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-2"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="text-xs text-center">Upload Images</span>
                </>
              )}
            </label>
          </div>
        )}

        {/* Add URL Button */}
        {images.length < maxImages && (
          <button
            onClick={() => setShowUrlModal(true)}
            className="aspect-square border-2 border-dashed border-border rounded-sm flex flex-col items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            <ImageIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">Add from URL</span>
          </button>
        )}
      </div>

      {/* Image Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {images.length} of {maxImages} images
        </span>
        <span>Drag to reorder. First image is primary.</span>
      </div>

      {/* Alt Text Edit Modal */}
      {editingAlt && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-sm shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-display font-bold text-sm">Edit Alt Text</h3>
              <button
                onClick={() => setEditingAlt(null)}
                className="p-1 hover:bg-secondary rounded-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
                  <img
                    src={images.find((i) => i.id === editingAlt)?.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Alt Text (for accessibility & SEO)
                  </label>
                  <input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Describe the image..."
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Describe what's shown in the image for screen readers.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-border bg-secondary/30">
              <button
                onClick={() => setEditingAlt(null)}
                className="px-3 py-1.5 text-sm font-medium border border-border rounded-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveAlt(editingAlt)}
                className="px-3 py-1.5 text-sm font-medium btn-accent rounded-sm flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Input Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-sm shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-display font-bold text-sm">Add Image from URL</h3>
              <button
                onClick={() => {
                  setShowUrlModal(false);
                  setUrlInput("");
                }}
                className="p-1 hover:bg-secondary rounded-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-sm text-sm bg-background outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a direct link to an image file (jpg, png, webp).
                </p>
              </div>
              {urlInput && (
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-sm">
                  <div className="w-16 h-16 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={urlInput}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-border bg-secondary/30">
              <button
                onClick={() => {
                  setShowUrlModal(false);
                  setUrlInput("");
                }}
                className="px-3 py-1.5 text-sm font-medium border border-border rounded-sm hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-1.5 text-sm font-medium btn-accent rounded-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" /> Add Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
