import "./App.css";
import Clock from "./component/Clock";
import Weather from "./component/Weather";
import Todo from "./component/Todo";
import PinnedSite from "./component/PinnedSite";
import ThemeSwitcher from "./component/ThemeSwitcher";

const App = () => {
  return (
    <div className="h-dvh flex justify-center items-center">
      <div className="grid grid-cols-[repeat(9,1fr)] grid-rows-[repeat(10,60px)] gap-1 place-items-center">
        <div className="col-span-4 row-span-3 w-full h-full">
          <Weather />
        </div>
        <div className="col-start-6 col-span-4 row-span-2">
          <div className="flex flex-col gap-1">
            <ThemeSwitcher />
            <Clock />
          </div>
        </div>
        <div className="row-start-4 col-span-4 row-span-3">
          <PinnedSite />
        </div>
        <div className="row-start-7 col-span-4 row-span-4 w-full h-full">
          <Todo />
        </div>
      </div>
    </div>
  );
};

export default App;

function Note() {
  return (
    <div className="themed-card themed-shadow flex flex-col gap-2 rounded-xl p-2">
      <p className="font-bold text-xs">Making Noodles</p>
      <div>
        <p className="line-clamp-6 text-xs">
          Before I explain each step in detail, here is the summary of the
          process. It takes 40-45 mins from start to finish (including the
          passive resting time).
        </p>
      </div>
    </div>
  );
}
