"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LoadingOverlay from "./LoadingOverlay";
import { DEFAULT_VOICE, voiceOptions, voiceCategories } from "@/lib/constants";

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: DEFAULT_VOICE,
    },
  });

  const onSubmit = async (values: BookUploadFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Form values:", values);
    setIsSubmitting(false);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      form.setValue("pdfFile", file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      form.setValue("coverImage", file);
    }
  };

  const removePdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPdfFile(null);
    form.setValue("pdfFile", undefined as any);
  };

  const removeCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImage(null);
    form.setValue("coverImage", undefined);
  };

  return (
    <div className="new-book-wrapper">
      {isSubmitting && <LoadingOverlay />}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* PDF File Upload */}
        <Controller
          control={form.control}
          name="pdfFile"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="form-label">Book PDF File</FieldLabel>
              <div
                className={cn(
                  "upload-dropzone border-2 border-dashed border-[#8B7355]/30",
                  pdfFile && "upload-dropzone-uploaded",
                )}
                onClick={() => document.getElementById("pdf-upload")?.click()}
              >
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePdfUpload}
                />
                {pdfFile ? (
                  <div className="flex flex-col items-center">
                    <p className="upload-dropzone-text truncate max-w-[200px]">
                      {pdfFile.name}
                    </p>
                    <button
                      type="button"
                      onClick={removePdf}
                      className="upload-dropzone-remove mt-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="upload-dropzone-icon" />
                    <p className="upload-dropzone-text">Click to upload PDF</p>
                    <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
                  </>
                )}
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* Cover Image Upload */}
        <Controller
          control={form.control}
          name="coverImage"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="form-label">
                Cover Image (Optional)
              </FieldLabel>
              <div
                className={cn(
                  "upload-dropzone border-2 border-dashed border-[#8B7355]/30",
                  coverImage && "upload-dropzone-uploaded",
                )}
                onClick={() => document.getElementById("cover-upload")?.click()}
              >
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
                {coverImage ? (
                  <div className="flex flex-col items-center">
                    <p className="upload-dropzone-text truncate max-w-[200px]">
                      {coverImage.name}
                    </p>
                    <button
                      type="button"
                      onClick={removeCover}
                      className="upload-dropzone-remove mt-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="upload-dropzone-icon" />
                    <p className="upload-dropzone-text">
                      Click to upload cover image
                    </p>
                    <p className="upload-dropzone-hint">
                      Leave empty to auto-generate from PDF
                    </p>
                  </>
                )}
              </div>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* Title Input */}
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="form-label" htmlFor="title">
                Title
              </FieldLabel>
              <Input
                id="title"
                placeholder="ex: Rich Dad Poor Dad"
                className="form-input"
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* Author Input */}
        <Controller
          control={form.control}
          name="author"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel className="form-label" htmlFor="author">
                Author Name
              </FieldLabel>
              <Input
                id="author"
                placeholder="ex: Robert Kiyosaki"
                className="form-input"
                {...field}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        {/* Voice Selector */}
        <Controller
          control={form.control}
          name="voice"
          render={({ field, fieldState }) => (
            <Field className="space-y-4">
              <FieldLabel className="form-label">
                Choose Assistant Voice
              </FieldLabel>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-6"
              >
                <div>
                  <p className="text-sm font-medium text-[#777] mb-3">
                    Male Voices
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {voiceCategories.male.map((voicePersonaName) => {
                      const voice =
                        voiceOptions[
                          voicePersonaName as keyof typeof voiceOptions
                        ];
                      return (
                        <div key={voice.id} className="relative">
                          <RadioGroupItem
                            value={voice.id}
                            id={`voice-${voice.id}`}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`voice-${voice.id}`}
                            className={cn(
                              "voice-selector-option cursor-pointer block p-4 rounded-xl border-2 transition-all",
                              field.value === voice.id
                                ? "voice-selector-option-selected border-[#663820] bg-[#fdfcfb]"
                                : "border-transparent bg-white shadow-soft-sm",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border flex items-center justify-center",
                                  field.value === voice.id
                                    ? "border-[#663820]"
                                    : "border-gray-300",
                                )}
                              >
                                {field.value === voice.id && (
                                  <div className="w-2 h-2 rounded-full bg-[#663820]" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-[#212a3b]">
                                  {voice.name}
                                </p>
                                <p className="text-[10px] text-[#777] leading-tight mt-1">
                                  {voice.description}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[#777] mb-3">
                    Female Voices
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {voiceCategories.female.map((voicePersonaName) => {
                      const voice =
                        voiceOptions[
                          voicePersonaName as keyof typeof voiceOptions
                        ];
                      return (
                        <div key={voice.id} className="relative">
                          <RadioGroupItem
                            value={voice.id}
                            id={`voice-${voice.id}`}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`voice-${voice.id}`}
                            className={cn(
                              "voice-selector-option cursor-pointer block p-4 rounded-xl border-2 transition-all",
                              field.value === voice.id
                                ? "voice-selector-option-selected border-[#663820] bg-[#fdfcfb]"
                                : "border-transparent bg-white shadow-soft-sm",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "w-4 h-4 rounded-full border flex items-center justify-center",
                                  field.value === voice.id
                                    ? "border-[#663820]"
                                    : "border-gray-300",
                                )}
                              >
                                {field.value === voice.id && (
                                  <div className="w-2 h-2 rounded-full bg-[#663820]" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-[#212a3b]">
                                  {voice.name}
                                </p>
                                <p className="text-[10px] text-[#777] leading-tight mt-1">
                                  {voice.description}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </RadioGroup>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Button type="submit" className="form-btn" disabled={isSubmitting}>
          Begin Synthesis
        </Button>
      </form>
    </div>
  );
};

export default UploadForm;
