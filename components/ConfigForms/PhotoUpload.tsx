"use client";

import { useRef, useState, useEffect } from "react";
import type { StyleConfig } from "@/lib/store";

interface PhotoUploadProps {
  onAnalysisComplete: (config: StyleConfig) => void;
  onReset?: () => void;
}

type UploadState = "idle" | "loading" | "done" | "error";

export default function PhotoUpload({ onAnalysisComplete, onReset }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (JPEG, PNG, etc.).");
      setUploadState("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File too large — max 10 MB.");
      setUploadState("error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.onerror = () => setPreview(null);
    reader.readAsDataURL(file);

    uploadFile(file);
  }

  async function uploadFile(file: File) {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setUploadState("loading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/analyze-photo", {
        method: "POST",
        body: formData,
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setUploadState("done");
      onAnalysisComplete(data.fields ?? data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setErrorMsg(
        "Could not analyse the photo. You can still fill in the form manually."
      );
      setUploadState("error");
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Photo upload area"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={[
          "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-6 text-center transition-all",
          isDragging
            ? "border-[#7A7068] bg-[#F3EEE5]"
            : "border-[#DDD8CF] bg-[#FAF7F2] hover:border-[#7A7068] hover:bg-[#F3EEE5]",
        ].join(" ")}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Uploaded preview"
            className="max-h-40 max-w-full object-contain"
          />
        ) : (
          <>
            <div>
              <p className="text-sm text-[#1A1814]">
                Drop image or click
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#7A7068]">
                JPEG · PNG · max 10 MB
              </p>
            </div>
          </>
        )}

        {/* Loading overlay */}
        {uploadState === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-sm">
            <span
              className="h-8 w-8 animate-spin rounded-full border-2 border-[#DDD8CF] border-t-[#1A1814]"
              role="status"
              aria-label="Analysing photo"
            />
            <p className="text-sm text-[#7A7068]">
              Analysing your photo…
            </p>
          </div>
        )}

        {/* Done badge */}
        {uploadState === "done" && (
          <span className="absolute right-3 top-3 bg-[#6B7C6E] text-white px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]">
            Analysed
          </span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onInputChange}
        />
      </div>

      {/* Error */}
      {uploadState === "error" && (
        <p className="border-l-2 border-red-400 pl-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      {/* Replace button */}
      {preview && uploadState !== "loading" && (
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            setUploadState("idle");
            setErrorMsg("");
            if (inputRef.current) inputRef.current.value = "";
            onReset?.();
          }}
          className="text-[10px] uppercase tracking-[0.12em] text-[#7A7068] hover:text-[#1A1814]"
        >
          Replace photo
        </button>
      )}
    </div>
  );
}
