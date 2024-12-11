import { useBroadcastEvent, useEventListener, useMyPresence, useOther } from "@/liveblocks.config"
import { LiveCursors } from "./Cursor/LiveCursors"
import { useOthers } from "@/liveblocks.config"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import CursorChat from "./Cursor/CursorChat";
import ReactionSelector from "./Reaction/ReactionButton";
import FlyingReaction from "./Reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";
import { Comments } from "./comments/Comments";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { shortcuts } from "@/constants";


//LIVE.TSX is a collection of all live functionality we'll implement 

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  undo: ()=> void;
  redo: ()=> void;
}

const Live = ({canvasRef, undo, redo}: Props) => {
  const others = useOthers();
  const [{cursor}, updateMyPresence]= useMyPresence() as any;

  
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  }); 
  
  // .....Reaction state.................
  const [reactions, setReactions] = useState<Reaction[]> //usesatet we further define array of reactions
  ([])
  
 const broadcast= useBroadcastEvent();

  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      // concat all the reactions created on mouse click
      setReactions((reactions) => 
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])) 
        // Broadcast the reaction to other users
        broadcast({
          x: cursor.x,
          y: cursor.y,
          value: cursorState.reaction,
        });
      }
    }, 100);

     // Remove reactions that are not visible anymore (every 1 sec)
    useInterval(() => {
    setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
  }, 1000);

    useEventListener((eventData) => {
      const event = eventData.event as ReactionEvent;
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: event.x, y: event.y },
            value: event.value,
            timestamp: Date.now(),
          },
        ])
      );
    });

  const handlePointerMove = useCallback((event: React.PointerEvent)  => {
    event.preventDefault();

    // cursor is not in the reactionSelelector then we have to update cursor position
    // bzc then the raection is gona be stick to the buttom of the screen and we don't care about sursor position
    if (cursor==null || cursorState.mode !== CursorMode.ReactionSelector) {

    }
    const x =Math.round(event.clientX) - event.currentTarget.getBoundingClientRect().x; 
    const y =Math.round(event.clientY) - event.currentTarget.getBoundingClientRect().y;
    
    // const x =Math.round(event.clientX);
    // const y =Math.round(event.clientY)

    updateMyPresence({ cursor: { x, y} });
    // move all above in if 
    //substracting x position to actucal screen"clientx
    //substracting Y position to actucal screen"clientY
    
  },  [])

  

  const handlePointerUp = useCallback((event:React.PointerEvent) => {
    setCursorState((state: CursorState)=> cursorState.mode === CursorMode.Reaction ? {
      ...state, isPressed: true}: state);
    },[cursorState.mode, setCursorState]) //dependency array 1.115
  

  //Pointer leave function 
  const handlePointerLeave = useCallback((event: React.PointerEvent)  => {
    event.preventDefault();
    setCursorState({ mode: CursorMode.Hidden});
    updateMyPresence({ cursor: null, message: null});
   
  },  [])

  const handlePointerDown = useCallback((event: React.PointerEvent)  => {
   
    const x =Math.round(event.clientX) - event.currentTarget.getBoundingClientRect().x; 
    const y =Math.round(event.clientY) - event.currentTarget.getBoundingClientRect().y;
    
    updateMyPresence({ cursor: { x, y} });

    setCursorState((state: CursorState)=> cursorState.mode === CursorMode.Reaction ? {
      ...state, isPressed: true}: state);//1.11.5
  },  [cursorState.mode, setCursorState])   //inside dependancy 

  useEffect(()=> {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      }
      else if (e.key==='Escape') 
        {
        updateMyPresence({message: ''})
        setCursorState({mode: CursorMode.Hidden})
      }   
      else if (e.key === 'e') {
        setCursorState({
          mode: CursorMode.ReactionSelector,
        })
        
      }  
    }


    const onKeyDown = (e: KeyboardEvent )=> {
      if (e.key==='/') {
        e.preventDefault();
      }
    }
    
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    return()=>{
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);

    }

  }, [updateMyPresence]);

  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);



  const handleContextMenuClick = useCallback( (key: string) => 
    {
      switch (key) {
        case 'Chat':
          setCursorState({
            mode: CursorMode.Chat,
            previousMessage:null,
            message: '',
          })
          break;
          case 'Undo':
          undo();
          break;
          case 'Redo':
          redo();
          break;
          case 'Reactions':
          setCursorState({
            mode:CursorMode.ReactionSelector
          })
          break;
        default:
          break;
      }
      
    },[],
  )



  
  

  return (
    <ContextMenu>
    <ContextMenuTrigger
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative h-full w-full flex flex-1 justify-center items-center"
      >
        
        <canvas ref= {canvasRef}/>
    {/* manage cursor stats */}

      {cursor && (
          <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        {/* Reaction state */}

       {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector 
          setReaction={setReaction}
          />
        )}

        {/* Render the reactions 1.16.3*/}
        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

      <LiveCursors others={others}/> 
      <Comments /> 
    </ContextMenuTrigger>

   
  <ContextMenuContent className="right-menu-content">
    {shortcuts.map((item)=>(
      <ContextMenuItem key={item.key} onClick={ () =>handleContextMenuClick(item.name)} className="right-menu-item">
        <p>{item.name}</p>
        <p className="text-sx text-primary-grey-300">{item.shortcut}</p>
      </ContextMenuItem>
    ))}
   
  </ContextMenuContent>
</ContextMenu> 
  )
}

export default Live