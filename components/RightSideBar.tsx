import React, { useRef, useState } from 'react';
import Dimensions from './settings/Dimensions';
import Export from './settings/Export';
import Color from './settings/Color';
import Text from './settings/Text';
import Notepad from './settings/Notepad';
import { RightSidebarProps } from '@/types/type';
import { modifyShape } from '@/lib/shapes';

export const RightSideBar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  activeObjectRef,
  syncShapeInStorage
}: RightSidebarProps) => {
  
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);
  const [notepadContent, setNotepadContent] = useState('');

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({
      ...prev, [property]: value
    }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage
    });
  };

  return (
    <section className='flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-2-[327px] sticky right-0 h-auto max-sm:hidden select-none'>
      <h2 className='px-5 pt-4 textxs uppercase'>Design</h2>
      <span className='text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-grey-200 pb-4'>Modify the Changes</span>

      <Dimensions 
        width={elementAttributes.width}
        height={elementAttributes.height}
        handleInputChange={handleInputChange}
        isEditingRef={isEditingRef}
      />
      <Text 
        fontFamily={elementAttributes.fontFamily}
        fontWeight={elementAttributes.fontWeight}
        fontSize={elementAttributes.fontSize}
        handleInputChange={handleInputChange}
      />
      <Color 
        inputRef={colorInputRef}
        attribute={elementAttributes.fill}
        attributeType='fill'
        placeholder="color"
        handleInputChange={handleInputChange}
      />
      <Color 
        inputRef={strokeInputRef}
        attribute={elementAttributes.stroke}
        attributeType='stroke'
        placeholder="stroke"
        handleInputChange={handleInputChange}
      />
      <Notepad content={notepadContent} setContent={setNotepadContent}  />
      <Export notepadContent={notepadContent} />
    </section>
  );
};