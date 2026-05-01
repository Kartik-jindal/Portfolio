'use client';

/**
 * @fileOverview Admin Media Library — browse, preview, and delete S3 assets.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { listMedia, deleteMedia, uploadMedia } from '@/lib/aws/media-actions';
import { MEDIA_FOLDERS, type MediaItem } from '@/lib/aws/media-types';
import { getAssetUrl } from '@/lib/utils';
import { Image as ImageIcon, Trash2, Copy, Loader2, ChevronDown, FolderOpen, AlertTriangle, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string>('');
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = useCallback(async (prefix: string, token?: string) => {
    setLoading(true);
    try {
      const result = await listMedia(prefix ? `${prefix}/` : undefined, token, 40);
      if (token) {
        setItems(prev => [...prev, ...result.items]);
      } else {
        setItems(result.items);
      }
      setNextToken(result.nextToken);
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load media.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setItems([]);
    setNextToken(undefined);
    setSelectedItem(null);
    fetchItems(activeFolder);
  }, [activeFolder, fetchItems]);

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedKey(url);
    toast({ title: 'Copied', description: 'CDN URL copied to clipboard.' });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = async (key: string) => {
    setDeleting(true);
    try {
      const result = await deleteMedia(key);
      if (result.success) {
        setItems(prev => prev.filter(i => i.key !== key));
        setSelectedItem(null);
        setDeleteConfirm(null);
        toast({ title: 'Deleted', description: 'Asset removed from S3.' });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: error.message });
    } finally {
      setDeleting(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', activeFolder || 'general');

      const result = await uploadMedia(formData);
      if (result.success) {
        toast({ title: 'Success', description: 'File uploaded successfully.' });
        // Refresh the list to show the new item
        fetchItems(activeFolder);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <span className="text-primary font-black uppercase tracking-[0.6em] text-[12px]">Asset Management</span>
          <h1 className="text-6xl font-headline font-black italic tracking-tighter text-white">Media Library.</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-white/30">
            <FolderOpen className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest">{items.length} assets loaded</span>
          </div>
          
          <div className="relative">
            <input
              type="file"
              id="media-upload"
              className="hidden"
              onChange={handleUpload}
              accept="image/*,application/pdf"
            />
            <Button
              onClick={() => document.getElementById('media-upload')?.click()}
              disabled={uploading}
              className="h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest px-8 group"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
              )}
              {uploading ? 'Uploading...' : 'Upload Asset'}
            </Button>
          </div>
        </div>
      </header>

      {/* Folder tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFolder('')}
          className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            activeFolder === ''
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'text-white/40 hover:text-white hover:bg-white/5 border border-white/5'
          }`}
        >
          All Files
        </button>
        {MEDIA_FOLDERS.map(folder => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeFolder === folder
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            {folder}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Grid */}
        <div className="lg:col-span-8">
          {loading && items.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="glass p-20 rounded-[3rem] border-white/5 flex flex-col items-center justify-center text-white/20">
              <ImageIcon className="w-16 h-16 mb-6" />
              <span className="text-[13px] font-black uppercase tracking-widest">No assets found</span>
              <span className="text-[11px] text-white/10 mt-2">Upload images via the Project or Blog editors</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map(item => {
                  const isActive = selectedItem?.key === item.key;
                  const isPdf = item.key.endsWith('.pdf');
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        isActive
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      {isPdf ? (
                        <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl">📄</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">PDF</span>
                        </div>
                      ) : (
                        <img
                          src={getAssetUrl(item.url)}
                          alt={item.key}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}

                      {/* Hover info */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-mono text-white/60 block truncate">
                          {item.key.split('/').pop()}
                        </span>
                      </div>

                      {isActive && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-black" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {nextToken && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => fetchItems(activeFolder, nextToken)}
                    disabled={loading}
                    className="h-12 rounded-xl border-white/10 text-[11px] font-black uppercase tracking-widest px-8"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar — asset detail */}
        <div className="lg:col-span-4">
          {selectedItem ? (
            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-8 sticky top-32">
              {/* Preview */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                {selectedItem.key.endsWith('.pdf') ? (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <span className="text-4xl">📄</span>
                  </div>
                ) : (
                  <img src={getAssetUrl(selectedItem.url)} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Filename</span>
                  <p className="text-sm font-mono text-white/70 break-all">{selectedItem.key.split('/').pop()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Folder</span>
                    <p className="text-sm font-bold text-white/60">{selectedItem.folder}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Size</span>
                    <p className="text-sm font-bold text-white/60">{(selectedItem.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">CDN URL</span>
                  <p className="text-[10px] font-mono text-white/40 break-all">{selectedItem.url}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handleCopy(selectedItem.url)}
                  className="w-full h-12 rounded-xl border-white/10 text-[11px] font-black uppercase tracking-widest"
                >
                  {copiedKey === selectedItem.url ? <Check className="w-3.5 h-3.5 mr-2 text-primary" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                  {copiedKey === selectedItem.url ? 'Copied!' : 'Copy CDN URL'}
                </Button>

                {deleteConfirm === selectedItem.key ? (
                  <div className="space-y-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-[10px] text-destructive/80 font-bold leading-relaxed">
                        This will permanently delete the file from S3. Any Projects or Blog posts using this image will show broken links. This cannot be undone.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(selectedItem.key)}
                        disabled={deleting}
                        className="flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
                        {deleting ? 'Deleting...' : 'Confirm Delete'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteConfirm(null)}
                        className="h-10 rounded-lg text-[10px] font-black uppercase tracking-widest border-white/10 px-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirm(selectedItem.key)}
                    className="w-full h-12 rounded-xl border-destructive/20 text-destructive/60 text-[11px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                    Delete Asset
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass p-12 rounded-[2.5rem] border-white/5 flex flex-col items-center justify-center text-white/20 h-64">
              <ImageIcon className="w-10 h-10 mb-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">Select an asset to view details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
