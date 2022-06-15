import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

const newItems = JSON.parse(localStorage.getItem('items')) || [];

// helpful links:
// useState crash => https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/
function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  //arrow declaration => expensive computation ex: API calls
  const [items, setItems] = useState(newItems);
  localStorage.setItem('items', JSON.stringify(items));

  const [filterType, setFilterType] = useState("");
  const [searchInput,SetSearchInput] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleSearchInput = (e) =>{
     setFilterType("search");
     SetSearchInput(e.target.value);
  }

  const handleAddItem = () => {
    setItems((prevItems) => [
      { label: itemToAdd, key: uuidv4() },
      ...prevItems,
    ]);

    setItemToAdd("");
  };

  const handleRemoveItems =({ key }) => {
    setItems(items.filter(item => item.key !== key));
  }
  const handleChangeColor = ({ key }) =>{
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, important: !item.important };
        } else return item;
      })
    );
  }

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const amounImportant = items.filter((item) => item.important).length;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "search"
      ? items.filter((item) => item.label.toLowerCase().includes(searchInput.toLowerCase()))
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done,important tasks to do: {amounImportant} 
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="search"
          className="form-control search-input"
          placeholder="type to search"
          onChange = {handleSearchInput}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.important ? " important" : ""}${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                {/*Exclamation mark '!*/}
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => handleChangeColor(item)}
                >
                  <i className="fa fa-exclamation " />
                </button>
                
                  {/*TRASH MARK*/}
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleRemoveItems(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
