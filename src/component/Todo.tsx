import { useEffect, useMemo, useState } from "react";
import { KeyTodos } from "../utils/localSotrageKey";

export default function Todo() {
  const [todoData, setTodoData] = useState<TodoDatatype>([]);

  useEffect(() => {
    const todos = localStorage.getItem(KeyTodos);
    if (!todos) return;
    const parsedTodos = JSON.parse(todos) as TodoDatatype;
    setTodoData(parsedTodos);
  }, []);

  return (
    <div className="card shadow-card flex flex-col gap-2 p-3 rounded-xl w-full h-full">
      <HeaderTodo todoData={todoData} />
      <ListTodo todoData={todoData} setTodo={setTodoData} />
      <AddTodo setTodo={setTodoData} />
    </div>
  );
}

function HeaderTodo({ todoData }: { todoData: TodoDatatype }) {
  const checkedTodo = useMemo(() => {
    let count = 0;
    todoData.forEach((todo) => {
      if (todo.checkedTodo) count += 1;
    });
    return count;
  }, [todoData]);

  return (
    <div className="flex justify-between items-center text-lg font-bold">
      <p className="pl-2">Todo 📋</p>
      <p className="pr-2 font-mono">
        {checkedTodo}/{todoData.length}
      </p>
    </div>
  );
}

function ListTodo({
  todoData,
  setTodo,
}: {
  todoData: TodoDatatype;
  setTodo: React.Dispatch<React.SetStateAction<TodoDatatype>>;
}) {
  return todoData.length === 0 ? (
    <div className="grow flex justify-center items-center">
      <p className="text-themed-text-gray">Empty nih bos</p>{" "}
    </div>
  ) : (
    <div className="grow flex flex-col gap-1 overflow-y-auto">
      {todoData.map((data) => {
        return (
          <ItemTodo
            key={data.id}
            id={data.id}
            checkedTodo={data.checkedTodo}
            todo={data.todo}
            date={data.date}
            setTodo={setTodo}
          />
        );
      })}
    </div>
  );
}

function ItemTodo({
  id,
  checkedTodo,
  date,
  todo,
  setTodo,
}: TodoDataObject & {
  setTodo: React.Dispatch<React.SetStateAction<TodoDatatype>>;
}) {
  // onChange todo (check or uncheck)
  function changeCheckTodo(id: string) {
    setTodo((prev) => {
      const newTodos = prev.map((todo) =>
        id === todo.id ? { ...todo, checkedTodo: !todo.checkedTodo } : todo
      );
      localStorage.setItem(KeyTodos, JSON.stringify(newTodos));
      return newTodos;
    });
  }

  //delete todo
  function deleteTodo(id: string) {
    setTodo((prev) => {
      const newTodo = prev.filter((todo) => todo.id !== id);
      localStorage.setItem(KeyTodos, JSON.stringify(newTodo));
      return newTodo;
    });
  }

  return (
    <div className="hover:bg-themed-hover flex gap-3 rounded-md p-1 group">
      <input
        type="checkbox"
        checked={checkedTodo}
        onChange={() => {
          changeCheckTodo(id);
        }}
      />
      <div>
        <p
          className={`text-xs font-medium max-w-[220px] text-ellipsis overflow-hidden ${
            checkedTodo && "line-through"
          }`}
        >
          {todo}
        </p>
        <p className="text-themed-text-gray text-xs">{date}</p>
      </div>
      <div className="ml-auto mr-2.5 hidden group-hover:block" title="delete">
        <button
          onClick={() => {
            deleteTodo(id);
          }}
        >
          x
        </button>
      </div>
    </div>
  );
}

function AddTodo({
  setTodo,
}: {
  setTodo: React.Dispatch<React.SetStateAction<TodoDatatype>>;
}) {
  //add new todo
  function submitTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!formData.get("todo")?.toString()?.trim()) return;

    const newTodo = {
      id: new Date().toISOString(),
      todo: formData.get("todo") as string,
      checkedTodo: false,
      date: new Date().toLocaleString(),
    };

    setTodo((prev) => {
      localStorage.setItem(KeyTodos, JSON.stringify([newTodo, ...prev]));
      return [newTodo, ...prev];
    });

    event.currentTarget.reset();
  }

  return (
    <form className="flex gap-2" onSubmit={submitTodo}>
      <input
        className="input text-xs flex-1 outline-0 rounded-md px-4 p-1"
        type="text"
        name="todo"
        id="todo"
      />
      <button className="btn w-[35px] aspect-square rounded-full" type="submit">
        +
      </button>
    </form>
  );
}

type TodoDatatype = TodoDataObject[];

type TodoDataObject = {
  id: string;
  checkedTodo: boolean;
  todo: string;
  date: string;
};
