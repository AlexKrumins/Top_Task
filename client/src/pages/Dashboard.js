import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import ReactDOM from 'react-dom';

import Title from "../components/Title";
import { Col, Row, Container } from "../components/Grid";
import { Input, TextArea, FormBtn } from "../components/Form"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Stopwatch from "../components/Stopwatch";
import API from "../utils/API"
// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

class Dashboard extends Component {
  state = {
    tasks: [],
    title: "",
    notes: "",
    user: parseInt(this.props.match.params.id),
    //dummy list for dnd
    items: getItems(10),
    selected: getItems(5, 10),
    helm: [],
  };


  id2List = {
    droppable: 'items',
    droppable2: 'selected',
    creationStation: 'helm',
  };
  
  getList = id => this.state[this.id2List[id]];
  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
        return;
    }

    if (source.droppableId === destination.droppableId) {
        const items = reorder(
            this.getList(source.droppableId),
            source.index,
            destination.index
        );

        let state = { items };

        if (source.droppableId === 'droppable2') {
            state = { selected: items };
        }

        if (source.droppableId === 'creationStation' && this.state.helm === []) {
            state = { helm: items };
        }

        this.setState(state);
    } else {
        const result = move(
            this.getList(source.droppableId),
            this.getList(destination.droppableId),
            source,
            destination
        );

        this.setState({
            items: result.droppable,
            selected: result.droppable2,
            helm: result.creationStation
        });
    }
  };

  
  componentDidMount() {
    this.loadTasks();
  }

  loadTasks = () => {
    console.log(this.state.user)
    if (!this.props.match.params.id) { return window.location.replace("/login") }
    else{
      API.getTasks(this.props.match.params.id)
        .then(res =>
          this.setState({ tasks: res.data, title: "", user: this.props.match.params.id, notes: "" })
        )
        .catch(err => console.log(err));
    }
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.title) {
      API.saveTask({
        title: this.state.title,
        notes: this.state.notes,
        UserId: this.state.user
      })
        .then(res => this.loadTasks())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Title>Top Task Dashboard</Title>
        <Row>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Col size="md-4">
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {this.state.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}>
                            {item.content}
                          </div>
                          )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
            <Col size="md-4">
              <Stopwatch />
              <form>
                <h1>Create a new task</h1>
                <Input
                  value={this.state.title}
                  onChange={this.handleInputChange}
                  name="title"
                  placeholder="Task Name (required)"
                />
                <TextArea
                  value={this.state.notes}
                  onChange={this.handleInputChange}
                  name="notes"
                  placeholder="Notes (Optional)"
                />
                <FormBtn
                  disabled={!this.state.title}
                  onClick={this.handleFormSubmit}
                >
                  Add Task to Library
                </FormBtn>
              </form>
            </Col>
            <Col size="md-4">
              <Droppable droppableId="droppable2">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                      {this.state.selected.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                              )}>
                              {item.content}
                            </div>
                            )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
            </Col>
          </DragDropContext>
        </Row>

      </Container>
    );
  }
}

export default Dashboard;