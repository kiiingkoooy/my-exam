import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [fruits, setFruits] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [fruitResult, setFruitResult] = useState([]);

  //API handling
  const fetchData = async () => {
    const response = await fetch("https://fruityvice.com/api/fruit/all");

    const responseData = await response.json();

    const loadedData = [];

    for (const key in responseData) {
      loadedData.push({
        id: key,
        name: responseData[key].name,
      });
    }
    setFruits(loadedData);
  };

  //Selected fruit from the List
  const selectedFruit = (id, name) => {
    let fruitId;

    fruitResult.map((fruit) =>
      fruit.id.includes(id) ? (fruitId = fruit.id) : fruit.id
    );
    
    if (fruitId === id) {
      //If the Fruit has a duplicate, the counter increments
      fruitResult.map((fruit) => {
        if (fruit.id === fruitId) {
          return fruit.quantity++;
        }
      });
      console.log(fruitResult);
    } else {
      setFruitResult([
        ...fruitResult,
        {
          id: id,
          name: name,
          quantity: Number(1),
        },
      ]);
    }
  };

  //Incrementing and decrementing the counter of the Fruit
  const fruitCounter = (id, action) => {
    if (action === "increment") {
      fruitResult.map((fruit) => {
        if (fruit.id === id) {
          return fruit.quantity++;
        }
      });
    }
    if (action === "decrement") {
      fruitResult.map((fruit) => {
        if (fruit.id === id) {
          fruit.quantity--;
          if (fruit.quantity < 1) {
            const arr = fruitResult.filter((fruit) => fruit.id !== id);
            setFruitResult(arr);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
  });

  //Fruit result display
  let fruitList = fruits
    .filter((search) => {
      const searchTerm = value.toLocaleLowerCase();
      const fruit = search.name.toLocaleLowerCase();

      return fruit.startsWith(searchTerm);
    })
    .map((fruit) => (
      <li
        className="list-none hover:bg-slate-200 cursor-pointer text-lg pl-2"
        onClick={() => selectedFruit(fruit.id, fruit.name)}
        key={fruit.id}
      >
        {fruit.name}
      </li>
    ));

  return (
    <div className="App">
      <div className="mx-12 mt-7">
        <div>
          <h1 className="text-[30px] font-bold">Add Products</h1>
          <div>
            <p className="text-gray-500">Product</p>
            <form>
              <div className="flex space-x-3">
                <input
                  placeholder="Please Input a fruit"
                  className="border w-full xl:w-[50%] rounded-md text-gray-500 px-3"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  //onFocus={(e) => setInputFocused(!inputFocused)}
                  onClick={(e) => setInputFocused(!inputFocused)}
                />
                <button className="border bg-blue-700 px-3 py-1 rounded-lg text-white">
                  Add
                </button>
              </div>
            </form>
          </div>
          {inputFocused && (
            <div className="border-2 overflow-y-scroll h-[200px]">
              {fruitList}
            </div>
          )}
        </div>
        <div className="border h-[100%] mt-[50px] py-3 text-2xl font-bold pl-2">
          <p className="flex justify-center mt-[35px] mb-[40px] text-[50px]">
            Fruits
          </p>
          {fruitResult.map((fruit) => (
            <div className="flex border items-center justify-between pl-2 mb-3 py-2">
              <p className="flex">{fruit.name}</p>
              <div className="flex pr-10">
                <div className="flex space-x-10">
                  <button
                    onClick={(e) => fruitCounter(fruit.id, e.target.id)}
                    id="decrement"
                  >
                    -
                  </button>
                  <span className="border px-2 bg-slate-100">
                    {fruit.quantity}
                  </span>
                  <button
                    onClick={(e) => fruitCounter(fruit.id, e.target.id)}
                    id="increment"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
