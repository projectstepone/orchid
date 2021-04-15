import React from 'react';
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const onPathClicked = (event) => {
    event.preventDefault()
    const transitionId = event.target.id
    console.log("transitionId", transitionId)
    console.log('transition', data.transition)
  }
  return (
    <>
      <path id={'path_'+ id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text>
        <textPath id={id} href={`#path_${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle" onClick={onPathClicked}>
          { data.transition.id }
        </textPath>
      </text>
    </>
  );
}