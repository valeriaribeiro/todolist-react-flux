import React, { Component } from 'react';
import './App.css';
import ToDoList from './views/components/ToDoList';
import NewToDoItem from './views/components/newToDoItem';
import ToDoActions from './data/actions/ToDoActions';
import ToDoStore from './data/stores/ToDoStore';


async function getToDoState() {
  return {
    toDoList: await ToDoStore.getAll()
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDoList: []
    }

    this._onChange = this._onChange.bind(this);

    this._onChange();
  }

  componentDidMount() {
    ToDoStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ToDoStore.removeChangeListener(this._onChange);
  }

  async _onChange() {
    this.setState(await getToDoState());
  }
  

  render() {
    const { state } = this;

    return (
      <div className="App">
        <NewToDoItem onAdd={ToDoActions.create} />
        <hr />

        <button className="tw-btn" onClick={ToDoActions.clear}>Limpar</button>
        
        <hr />
        <ToDoList
          items={state.toDoList}
          onRemove={ToDoActions.remove}
          onUpdate={ToDoActions.update}
        />
      </div>
    )
  }
}

export default App;
