// This is a server component wrapper

import React from 'react';

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-wrapper">
      {children}
    </div>
  );
}
