import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { DateTime } from "luxon";
import { useAppDispatch } from "../../../../app/hooks";
import { Todo } from "../../models/Todo.model";
import { TodoStatus } from "../../models/TodoStatus.model";
import NewTodo from "../new-todo/NewTodo";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deleteTodoItemAsync, updateTodoAsync } from "../../store/todosSlice";
import { useState } from "react";

const TodoItem: React.FC<{ todo: Todo }> = (props) => {
  const labelId = `checkbox-list-secondary-label-${props.todo.id}`;
  const [editMode, setEditMode] = useState<boolean>(() => false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(() => null);
  const dispatch = useAppDispatch();

  //done
  function checkedHanlder() {
    dispatch(
      updateTodoAsync({
        ...props.todo,
        status: TodoStatus.completed,
        completedDate: new Date().getTime(),
      })
    );
  }

  const handleRestoreClick = () => {
    dispatch(
      updateTodoAsync({
        ...props.todo,
        status: TodoStatus.active,
        completedDate: undefined,
      })
    );
    setAnchorEl(null);
  };

  //edit task
  function doubleClickHanlder() {
    setEditMode(true);
  }
  function onUpdateHandler(description: string) {
    dispatch(updateTodoAsync({ ...props.todo, description }));
    setEditMode(false);
  }
  function onEditCancelled() {
    setEditMode(false);
  }

  //delete task
  const open = Boolean(anchorEl);
  const rightClickHanlder = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteClick = () => {
    dispatch(deleteTodoItemAsync(props.todo));
    setAnchorEl(null);
  };

  return (
    <>
      <div>{editMode}</div>
      {!editMode ? (
        <ListItem
          onDoubleClick={doubleClickHanlder}
          onContextMenu={rightClickHanlder}
          key={props.todo.id}
          secondaryAction={
            props.todo.status === TodoStatus.active ? (
              <Checkbox
                edge="end"
                inputProps={{ "aria-labelledby": labelId }}
                onChange={checkedHanlder}
              />
            ) : (
              ""
            )
          }
          disablePadding
        >
          <ListItemButton>
            <ListItemText
              id={labelId}
              primary={props.todo.description}
              secondary={
                props.todo.status === TodoStatus.active
                  ? `Creada ${DateTime.fromMillis(props.todo.createdDate)
                      .setLocale("es")
                      .toRelative()}`
                  : `Completada ${DateTime.fromMillis(
                      props.todo.completedDate ?? DateTime.now().toMillis()
                    )
                      .setLocale("es")
                      .toRelative()}`
              }
            />
          </ListItemButton>
        </ListItem>
      ) : (
        <NewTodo
          onSave={onUpdateHandler}
          onFocusOut={onEditCancelled}
          value={props.todo.description}
        />
      )}
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleDeleteClick}>Borrar Tarea</MenuItem>
        {props.todo.status === TodoStatus.completed && (
          <MenuItem onClick={handleRestoreClick}>
            Mover a tareas pendientes
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
export default TodoItem;
