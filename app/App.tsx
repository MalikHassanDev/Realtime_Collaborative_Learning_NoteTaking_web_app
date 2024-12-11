"use client";
import LeftSidebar from "@/components/LeftSidebar";
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import { RightSideBar } from "@/components/RightSideBar";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { initialize } from "next/dist/server/lib/render-server";
import { handleCanvaseMouseMove, handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectMoving, handleCanvasObjectScaling, handleCanvasSelectionCreated, handlePathCreated, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import { icons } from "lucide-react";
import { act } from "react-dom/test-utils";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";


export default function Page() {
  const undo = useUndo();
  const redo = useRedo();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null); //canvas old  
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const imageInputRef= useRef<HTMLInputElement>(null);
  const isEditingRef= useRef(false);
  // const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);


  const canvasObjects = useStorage((root) => root.canvasObjects)

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: '',
    height: '',
    fontSize: '',
    fontFamily: '',
    fontWeight: '',
    fill: '#aabbcc',
    stroke: '#aabbcc',
  })

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;
    const canvasObjects = storage.get('canvasObjects');

    canvasObjects.set(objectId, shapeData);
  }, []);



  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: '',
  })

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get('canvasObjects')

    if (!canvasObjects || canvasObjects.size === 0)
      return true;

    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, [])

  const deleteShapeFromStorage = useMutation(({ storage }, deleteId) => {
    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.delete(deleteId)
  }, [])

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    switch (elem?.value) {
      case 'reset':
        deleteAllShapes(); // clear from live block storage
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement)
        break;
      case 'delete':
        handleDelete(fabricRef.current as any,
          deleteShapeFromStorage)
        setActiveElement(defaultNavElement)
        break; 
        case 'image':
          imageInputRef.current?.click();
          isDrawing.current= false;
          if(fabricRef.current){
            fabricRef.current.isDrawingMode = false;
          }
          break;
      default:
        break;
    }

    selectedShapeRef.current = elem?.value as string;
  };

  // handle leftsidebar canvas element selection 
  const handleSelectCanvasElement = (objectId: string) => {
    if (!fabricRef.current) return;
    const object = fabricRef.current.getObjects().find(obj => obj.objectId === objectId);
    if (object) {
      fabricRef.current.setActiveObject(object);
      fabricRef.current.renderAll();
    }
  };


  // using all these Ref to initiakize the fabric canves, we do in useeffect
  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef })

    canvas.on("mouse:down", (options: any) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      })
    })

    canvas.on("mouse:move", (options: any) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage
      })
    })

    canvas.on("mouse:up", (options: any) => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef,
      })
    })

    canvas.on("object:modified", (options: any) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage
      })
    })

    canvas.on("selection:created", (options: any) =>{
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      })
    })

    canvas.on("object:scaling", (options: any) =>{
      handleCanvasObjectScaling({
        options, setElementAttributes 
      })
    })

    canvas.on("path:created", (options: any) =>{
      handlePathCreated({
        options, syncShapeInStorage 
      })
    })
    
    window.addEventListener("resize", () => {
      handleResize({ fabricRef })
    })

    window.addEventListener("keydown", (e: any) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    })

    return () => {
      canvas.dispose(); //properly delete selected element 
    }

  }, [])

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef
    })
  }, [canvasObjects])




  // const handleCanvasMouseDownn = (options: fabric.IEvent) => {
  //   const target = options.target;
  //   setSelectedObject(target || null);
  // };
  // const onBringForward = () => {
  //   if (selectedObject && fabricRef.current) {
  //     fabricRef.current.bringToFront(selectedObject);
  //     fabricRef.current.renderAll();
  //   }
  // };
  
  // const onBringBackward = () => {
  //   if (selectedObject && fabricRef.current) {
  //     fabricRef.current.sendToBack(selectedObject);
  //     fabricRef.current.renderAll();
  //   }
  // };
  // // const onBringBackwards = () => {
  // //   if (selectedObject && fabricRef.current) {
  // //     fabricRef.current.sendBackwards(selectedObject);
  // //     fabricRef.current.renderAll();
  // //   }
  // // };

  // useEffect(() => {
  //   if (fabricRef.current) {
  //     fabricRef.current.on('mouse:down', handleCanvasMouseDownn);
  //   }
  
  //   return () => {
  //     if (fabricRef.current) {
  //       fabricRef.current.off('mouse:down', handleCanvasMouseDownn);
  //     }
  //   };
  // }, []);


  return (


    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e: any) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          });
        }}
        // onBringForward={onBringForward}
        // onBringBackward={onBringBackward}
        // selectedObject={selectedObject}
      />
      <section className="flex h-full flex-row">
        <LeftSidebar allShapes={Array.from(canvasObjects)} onSelect={handleSelectCanvasElement} />
        <Live canvasRef={canvasRef} undo={undo} redo={redo}/>
        <RightSideBar 
        elementAttributes ={elementAttributes}
        setElementAttributes={setElementAttributes}
        fabricRef={fabricRef}
        isEditingRef ={isEditingRef}
        activeObjectRef = {activeObjectRef}
        syncShapeInStorage={syncShapeInStorage}
        />

      </section>
    </main>

  );
}
