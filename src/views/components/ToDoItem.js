import React, { Component } from 'react';


class ToDoItem extends Component {
  static defaultProps = {
    item: {},
    onRemove: () => { },
    onUpdate: () => { },
    
  }

  constructor(props) {
    super(props);

    this.check = this.check.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);

    this.input = React.createRef();
  }

  check() {
    const { item } = this.props;

    item.isChecked = !item.isChecked;
    this.props.onUpdate(item);
  }

  remove() {
    this.props.onRemove(this.props.item.id);
  }

  update() {
    const { item } = this.props;
    item.description = this.input.current.value;
    this.props.onUpdate(item);
  }


  render() {
    const { props } = this,
      item = props.item;
    
    return (
      <li className="todo-list-item">
        <input
          className="tw-check"
          type="checkbox"
          checked={item.isChecked}
          onChange={this.check}
        />

        <input
          className="tw-input"
          type="text"
          disabled={item.isChecked}
          defaultValue={item.description}
          onBlur={this.update}
          ref={this.input}
        />

        <button className="tw-btn" onClick={this.remove}>
          X
        </button>
      </li>
    );
  }
}

export default ToDoItem;
