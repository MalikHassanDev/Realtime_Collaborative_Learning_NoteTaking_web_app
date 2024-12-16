// 'use client'
// interface NotepadProps {
//   content: string;
//   setContent: (content: string) => void;
// }

// const Notepad: React.FC<NotepadProps> = ({ content, setContent }) => {
//   return (
//     <div className="p-4">
//     <h1>Notepad</h1>
//       <textarea
//         className="w-full h-40 p-2 border border-primary-grey-200 bg-primary-black text-primary-grey-300"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write your notes here..."
//       />
//     </div>
//   );
// };

// export default Notepad;





import React, { useRef, useEffect } from 'react';

interface NotepadProps {
  content: string;
  setContent: (content: string) => void;
}

const Notepad: React.FC<NotepadProps> = ({ content, setContent }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const applyStyle = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
  };

  useEffect(() => {
    if (editorRef.current) {
      content = editorRef.current.innerHTML;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      // Extract plain text from the contentEditable div
      setContent(editorRef.current.innerText);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1>NotesPad</h1>
        <button className='p-2 hover:bg-slate-500 rounded-s-lg' onClick={() => applyStyle('bold')}><b>B</b></button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('italic')}><i>I</i></button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('underline')}><u>U</u></button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('justifyLeft')}>Left</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('justifyCenter')}>Center</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('justifyRight')}>Right</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('foreColor', 'red')}>Red</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('foreColor', 'blue')}>Blue</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('foreColor', 'white')}>white</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('fontSize', '1')}>Small</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('fontSize', '3')}>Normal</button>
        <button className='p-2 hover:bg-slate-500 ' onClick={() => applyStyle('fontSize', '5')}>Large</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="w-full h-40 overflow-auto p-2 border border-primary-grey-200 bg-primary-black text-primary-grey-300"
        onKeyUp={(e)=> {e.stopPropagation()}}
        onInput={handleInput}
        data-placeholder="Write your notes here..."//
      ></div>
    </div>
  );
};


export default Notepad;