import React from 'react';
// Forced re-compile to clear parallel route cache

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
