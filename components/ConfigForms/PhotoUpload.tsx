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

      const data: StyleConfig = await res.json();
      setUploadState("done");
      onAnalysisComplete(data);
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
          "relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-all",
          isDragging
            ? "border-stone-500 bg-stone-100"
            : "border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100",
        ].join(" ")}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Uploaded preview"
            className="max-h-40 max-w-full rounded-lg object-contain"
          />
        ) : (
          <>
            <span className="text-3xl" role="img" aria-label="Camera">
              📷
            </span>
            <div>
              <p className="font-medium text-stone-700">
                Drag & drop or click to browse
              </p>
              <p className="mt-1 text-sm text-stone-400">
                JPEG, PNG — max 10 MB
              </p>
            </div>
          </>
        )}

        {/* Loading overlay */}
        {uploadState === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm">
            <span
              className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700"
              role="status"
              aria-label="Analysing photo"
            />
            <p className="text-sm font-medium text-stone-600">
              Analysing your photo…
            </p>
          </div>
        )}

        {/* Done badge */}
        {uploadState === "done" && (
          <span className="absolute right-3 top-3 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            ✓ Analysed
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
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
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
          className="text-sm text-stone-500 underline hover:text-stone-800"
        >
          Replace photo
        </button>
      )}
    </div>
  );
}
