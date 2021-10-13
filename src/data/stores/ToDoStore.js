import { ToDoService } from '../services/ToDoService';
import ToDoConstants from '../constants/ToDoConstants';


import Events from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';


const Channel = new Events.EventEmitter(),
  CHANGE_EVENT = 'change';

let _toDoList = [];

function createItem(description) {
  return ToDoService.create({
    description,
    isChecked: false
  })
    .then(newItem => {
      _toDoList.push(newItem);
    })
}

function updateItem(newItem) {
  const itemIndex = _toDoList.findIndex(item => item.id === newItem.id);
    
  _toDoList[itemIndex] = newItem;

  return ToDoService.update(newItem);
}

function removeItem(id) {
  const itemIndex = _toDoList.findIndex(item => item.id === id);
    
  _toDoList.splice(itemIndex, 1);

  return ToDoService.remove(id);
}


function clearDone() {
  const toDo = [],
    done = [];
    
  _toDoList.forEach(item => {
    if (item.isChecked) {
      done.push(item);
    } else {
      toDo.push(item);
    }
  });

  done.forEach(item => removeItem(item.id));
  _toDoList = toDo;
}

const ToDoStore = {
  async getAll() {
    if (_toDoList.length === 0) {
      _toDoList = await ToDoService.list();
    }
    return _toDoList;
  },
  
  emitChange() {
    Channel.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    Channel.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    Channel.removeListener(CHANGE_EVENT, callback);
  },
}

async function handleAction(action) {
  // eslint-disable-next-line default-case
  switch (action.actionType) {
    case ToDoConstants.TODO_CREATE:
      const description = action.description;
      await createItem(description);
      ToDoStore.emitChange();
      break;   
    case ToDoConstants.TODO_UPDATE:
      const item = action.item;
      await updateItem(item);
      ToDoStore.emitChange();
      break;    
    case ToDoConstants.TODO_REMOVE:
      const id = action.id;
      await removeItem(id);
      ToDoStore.emitChange();
      break;    
    case ToDoConstants.TODO_CLEAR:
      clearDone();
      ToDoStore.emitChange();
      break;
  }
}

ToDoStore.dispatchToken = AppDispatcher.register(handleAction);

export default ToDoStore;