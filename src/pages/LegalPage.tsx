import React from "react";

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">{title}</h1>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
        {children}
      </div>
    </div>
  );
}
