import { COLORS } from '@/constants';
import { LiveCursorProps } from '@/types/type'
import Cursor from './Cursor';
import { generateRandomName } from '@/lib/utils';

export const LiveCursors = ({others}: LiveCursorProps) => {
  return others.map(({connectionId, presence})=> {
    
    if(!presence?.cursor) return null; // only show when Cursor if cursor info exist

     return  (
        // these all are the necessary properties that we need to pass to show cursor
        // on the screen\/
        <Cursor 
            key={connectionId}
            color={COLORS[Number(connectionId) % COLORS.length]}
            x={presence.cursor.x}
            y={presence.cursor.y}
            message={presence.message}
        />
        )  
    })
}