import React, { ReactElement, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import prettyBytes from "pretty-bytes";
import { toast } from "react-toastify";
import classNames from "classnames";

import styles from "./DropZone.module.scss";
import pxToRem from "../../utils/px-to-rem";
import Info from "../../public/static/icons/Info.svg";
import { ToastContent } from "./Toast";

type Input = {
  acceptedFileTypes: string[]; // in MIME Type
  recommendedFiles?: string[]; // For display only
  recommendedResolution?: number[]; // in px
  maxSize?: number; // in Bytes
  isMultiple?: boolean;
  label?: string;
  minHeight?: number;
  onAcceptFiles: (files: File[]) => void;
};

const DropZone = ({
  acceptedFileTypes,
  recommendedFiles,
  recommendedResolution,
  maxSize = 10000000,
  isMultiple = false,
  label = "Upload File(s)",
  minHeight = 340,
  onAcceptFiles,
}: Input): ReactElement => {
  const declineFile = useCallback(
    async ({
      errors,
      file,
    }: {
      errors: { code: string; message: string }[];
      file: File;
    }) => {
      let errorMessage = "";

      if (errors?.[0]?.code === "file-too-large") {
        errorMessage = `File must be smaller than ${prettyBytes(maxSize)}.`;
      } else if (errors?.[0]?.code === "file-invalid-type") {
        errorMessage = `Unsupported file type.`;
      } else {
        errorMessage = errors?.[0]?.message;
      }

      toast(
        <ToastContent title={file.name} message={errorMessage} type={"error"} />
      );
    },
    [maxSize]
  );

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      rejectedFiles?.forEach((file) => declineFile(file));

      if (acceptedFiles?.length > 0) {
        onAcceptFiles(acceptedFiles);
      }
    },
    [onAcceptFiles, declineFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: isMultiple,
  });

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div
          className={classNames(
            styles.wrapperStyle,
            isDragActive && styles.activeStyle
          )}
          style={{
            minHeight: pxToRem(minHeight),
          }}
        >
          <div className={styles.title}>{label}</div>
        </div>
        {(recommendedFiles || recommendedResolution) && (
          <div className={styles.recommendationSection}>
            <Info width={22} height={22} />
            <div>
              <div className={styles.recommendationHint}>
                Recommended file format and resolution:
              </div>
              <div className={styles.recommendationSpec}>
                <span className={styles.files}>
                  {" "}
                  {recommendedFiles.join(", ")}
                </span>
                ;
                {recommendedResolution && (
                  <span> {recommendedResolution.join(" x ")} px</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DropZone;
