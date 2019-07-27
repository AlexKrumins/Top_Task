import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const grid = 8;

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

function List(props) {
  return(
    <Droppable droppableId={props.droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}>
            {props.children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
export default List;