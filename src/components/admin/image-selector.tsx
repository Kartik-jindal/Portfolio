'use client';

/**
 * @fileOverview ImageSelector — unified image input for admin forms.
 *
 * Provides two coexisting paths:
 *  1. Upload a new file to S3 (existing flow)
 *  2. Pick an existing image from the S3 Media Library
 *
 * The parent form only cares about the final CDN URL string.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { uploadMedia } from '@/lib/aws/media-actions';
import { listMedia } from '@/lib/aws/media-actions';
import { type MediaItem, type ListMediaResult, MEDIA_FOLDERS } from '@/lib/aws/media-types';
import { getAssetUrl } from '@/lib/utils';
import { Image as ImageIcon, Upload, FolderOpen, X, Check, Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageSelectorProps {
  /** Current image URL (CDN URL from form state). */
  value: string;
  /** Called with the new CDN URL when an image is selected or uploaded. */
  onChange: (url: string) => void;
  /** S3 folder prefix for new uploads (e.g. 'projects', 'blog'). */
  uploadPath?: string;
  /** Whether the parent form is in an uploading state already. */
  disabled?: boolean;
}

export function ImageSelector({ value, onChange, uploadPath = 'general', disabled }: ImageSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string>(uploadPath);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const { toast } = useToast();

  // ── Upload handler ──────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('path', uploadPath);
      const result = await uploadMedia(fd);
      if (result.success && result.url) {
        onChange(result.url);
        toast({ title: 'Upload Complete', description: 'Asset synced to CDN.' });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected
      e.target.value = '';
    }
  };

  // ── Library fetching ────────────────────────────────────────────────────
  const fetchLibrary = useCallback(async (prefix: string, token?: string) => {
    setLibraryLoading(true);
    try {
      const result: ListMediaResult = await listMedia(
        prefix ? `${prefix}/` : undefined,
        token,
        40,
      );
      if (token) {
        // Append for "load more"
        setLibraryItems(prev => [...prev, ...result.items]);
      } else {
        setLibraryItems(result.items);
      }
      setNextToken(result.nextToken);
    } catch {
      toast({ variant: 'destructive', title: 'Library Error', description: 'Failed to load media assets.' });
    } finally {
      setLibraryLoading(false);
    }
  }, [toast]);

  // Fetch when library opens or folder changes
  useEffect(() => {
    if (libraryOpen) {
      setLibraryItems([]);
      setNextToken(undefined);
      fetchLibrary(activeFolder);
    }
  }, [libraryOpen, activeFolder, fetchLibrary]);

  const handleSelect = (item: MediaItem) => {
    onChange(item.url);
    setLibraryOpen(false);
    toast({ title: 'Image Selected', description: 'CDN URL applied to form.' });
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/5 shadow-2xl">
        {value ? (
          <img src={getAssetUrl(value)} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <ImageIcon className="w-16 h-16" />
          </div>
        )}

        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={disabled || uploading}
          />
          <span className="text-[13px] font-black uppercase tracking-widest text-white pointer-events-none">
            {uploading ? 'Syncing...' : 'Upload New'}
          </span>
        </div>
      </div>

      {/* Dual action bar */}
      <div className="flex gap-3">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={disabled || uploading}
          />
          <div className={`h-12 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all hover:border-primary/40 hover:text-primary ${uploading ? 'text-primary' : 'text-white/40'}`}>
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading...' : 'Upload New'}
          </div>
        </label>

        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          disabled={disabled}
          className="flex-1 h-12 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/40 transition-all hover:border-primary/40 hover:text-primary"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          From Library
        </button>
      </div>

      {/* Library modal overlay */}
      {libraryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-5xl max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-[2rem] flex flex-col overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div className="space-y-1">
                <h2 className="text-2xl font-headline font-black italic tracking-tight text-white">Media Library</h2>
                <p className="text-[11px] uppercase font-black tracking-widest text-white/30">Select an existing asset from S3</p>
              </div>
              <button
                onClick={() => setLibraryOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Folder tabs */}
            <div className="flex gap-2 px-8 py-4 border-b border-white/5 overflow-x-auto">
              <button
                onClick={() => setActiveFolder('')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeFolder === ''
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                All Files
              </button>
              {MEDIA_FOLDERS.map(folder => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeFolder === folder
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-8">
              {libraryLoading && libraryItems.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : libraryItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-white/20">
                  <ImageIcon className="w-12 h-12 mb-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">No assets found in this folder</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {libraryItems.map(item => {
                      const isSelected = value === item.url;
                      const isPdf = item.key.endsWith('.pdf');
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-white/5 hover:border-primary/40'
                          }`}
                        >
                          {isPdf ? (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">PDF</span>
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt={item.key}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}

                          {/* Hover overlay */}
                          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {isSelected ? (
                              <Check className="w-6 h-6 text-primary" />
                            ) : (
                              <span className="text-[9px] font-black uppercase tracking-widest text-white">Select</span>
                            )}
                          </div>

                          {/* File info */}
                          <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-mono text-white/60 block truncate">
                              {item.key.split('/').pop()}
                            </span>
                            <span className="text-[8px] font-mono text-white/30">
                              {(item.size / 1024).toFixed(0)} KB
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Load more */}
                  {nextToken && (
                    <div className="flex justify-center mt-6">
                      <Button
                        variant="outline"
                        onClick={() => fetchLibrary(activeFolder, nextToken)}
                        disabled={libraryLoading}
                        className="h-10 rounded-xl border-white/10 text-[10px] font-black uppercase tracking-widest"
                      >
                        {libraryLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <ChevronDown className="w-3.5 h-3.5 mr-2" />}
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
