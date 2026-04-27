'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-3xl border-white/5 p-0 overflow-hidden rounded-[3rem] shadow-2xl outline-none z-[5000] cursor-none">
        <DialogTitle className="sr-only">Project Detail</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};
