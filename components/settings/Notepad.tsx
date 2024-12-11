import React, { useState } from 'react';

interface NotepadProps {
  content: string;
  setContent: (content: string) => void;
}

const Notepad: React.FC<NotepadProps> = ({ content, setContent }) => {
  return (
    <div className="p-4">
    <h1>Notepad</h1>
      <textarea
        className="w-full h-40 p-2 border border-primary-grey-200 bg-primary-black text-primary-grey-300"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes here..."
      />
    </div>
  );
};

export default Notepad;





