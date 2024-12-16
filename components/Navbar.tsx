"use client";

import Image from "next/image";
import { memo } from "react";

import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";

import { Button } from "./ui/button";
import ShapesMenu from "./ShapesMenu";
import ActiveUsers from "./Users/ActiveUsers";
import { NewThread } from "./comments/NewThread";

  const Navbar = ({ activeElement, imageInputRef, handleImageUpload, handleActiveElement }: NavbarProps) => {   // onBringForward, onBringBackward, selectedObject
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none items-center justify-between gap-4 py-5 bg-primary-black px-5 text-white">
      {/* <Image src="/assets/RCSANA.png" alt="RCSANA Logo" width={59} height={20} /> */}
      <div className="flex flex-row items-center justify-center gap-2"><img src="/assets/FAVICON.svg" alt="RCSANA"  width={30} height={10}/><h1 className="font-bold text-white ">RCSANA</h1></div>

      <ul className="flex flex-row">
        {navElements.map((item: ActiveElement | any) => (
          <li
            key={item.name}
            onClick={() => {
              if (Array.isArray(item.value)) return;
              handleActiveElement(item);
            }}
            className={`group px-2.5 py-5 flex justify-center items-center
            ${isActive(item.value) ? "bg-primary-green" : "hover:bg-primary-grey-200"}
            `}
          >
            {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
            {Array.isArray(item.value) ? (
              <ShapesMenu
                item={item}
                activeElement={activeElement}
                imageInputRef={imageInputRef}
                handleActiveElement={handleActiveElement}
                handleImageUpload={handleImageUpload}
              />
            ) : item?.value === "comments" ? (
              // If value is comments, trigger the NewThread component
              <NewThread>
                <Button className="relative w-5 h-5 object-contain">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    className={isActive(item.value) ? "invert" : ""}
                  />
                </Button>
              </NewThread>
            ) : (
              <Button className="relative w-5 h-5 object-contain">
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className={isActive(item.value) ? "invert" : ""}
                />
              </Button>
            )}
          </li>
        ))}
      </ul>

      {/* <div className="flex items-center gap-3">
        <Button 
          onClick={onBringForward} 
          className="bg-primary-green hover:bg-primary-green-dark text-white"
          disabled={!selectedObject}
        >
          Bring Forward
        </Button>
        <Button 
          onClick={onBringBackward} 
          className="bg-primary-green hover:bg-primary-green-dark text-white"
          disabled={!selectedObject}
        >
          Bring Backward
        </Button>
      </div> */}
      <ActiveUsers />
    </nav>
  );
};

export default memo(Navbar, (prevProps, nextProps) => 
  prevProps.activeElement === nextProps.activeElement &&
  prevProps.selectedObject === nextProps.selectedObject
);