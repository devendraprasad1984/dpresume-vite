import React, { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { centerCrop, makeAspectCrop, Crop } from "react-image-crop";

import styles from "./ProfileImageCropper.module.scss";
import DropZone from "../core/DropZone";
import XButton from "../buttons/XButton";

interface Input {
  onChange: ({
    file,
    crop: { x, y, width, height },
  }: {
    file: File;
    crop: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }) => void;
  recommendedResolution?: number[];
  aspect?: number;
  dropZoneLabel?: string;
  showClearButton?: boolean;
}

const ProfileImageCropper = ({
  onChange,
  aspect = 1,
  recommendedResolution,
  dropZoneLabel = "Upload Photo",
  showClearButton = true,
}: Input) => {
  const [imgSrc, setImgSrc] = useState("");
  const [imgFile, setImageFile] = useState<File>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();

  const onSelectFile = (files: File[]) => {
    if (files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result.toString() || "");
        setImageFile(files[0]);
      });
      reader.readAsDataURL(files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = e.currentTarget;

    const { width, height } = e.currentTarget;

    // This is to demonstrate how to make and center a % aspect crop
    // which is a bit trickier, so we use some helper functions.
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  };

  const onComplete = (crop) => {
    if (crop?.width && crop?.height && imgRef.current) {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const cropData = {
        x: Math.floor(crop.x * scaleX),
        y: Math.floor(crop.y * scaleY),
        width: Math.floor(crop.width * scaleX),
        height: Math.floor(crop.height * scaleY),
      };

      onChange({
        file: imgFile,
        crop: cropData,
      });
    }
  };

  return (
    <div>
      {!imgSrc && (
        <>
          <DropZone
            acceptedFileTypes={["image/jpeg", "image/pjpeg", "image/png"]}
            recommendedFiles={["jpeg", "png"]}
            recommendedResolution={recommendedResolution}
            onAcceptFiles={onSelectFile}
            label={dropZoneLabel}
          />
        </>
      )}
      {imgSrc && (
        <div className={styles.cropPreview}>
          <ReactCrop
            crop={crop}
            onChange={(crop) => setCrop(crop)}
            onComplete={onComplete}
            aspect={aspect}
          >
            <img alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
          </ReactCrop>
          {showClearButton && (
            <div className={styles.clearImageButton}>
              <XButton
                onClick={() => {
                  setCrop(undefined);
                  setImgSrc("");
                  setImageFile(null);
                  onChange({
                    file: undefined,
                    crop: undefined,
                  });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileImageCropper;
