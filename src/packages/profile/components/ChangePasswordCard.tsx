'use client';

import { ReactNode } from 'react';

type ChangePasswordCardProps = {
  children: ReactNode;
};

export default function ChangePasswordCard({ children }: ChangePasswordCardProps) {
  return <div className="rounded-lg bg-white shadow">{children}</div>;
}
