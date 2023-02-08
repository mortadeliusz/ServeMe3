import "./styles.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { loader as myOrdersLoader } from "./components/MyOrders/myOrders";
import { loader as restaurantsLoader } from "./components/Restaurants/restaurants";
import { loader as restaurantDataLoader } from "./components/Restaurant/restaurant";
import { loader as orderConfirmationLoader } from "./components/OrderConfirmation/orderConfirmation";
import NavBar from "./components/NavBar/NavBar";
import Hero from "./components/Hero/hero";
import Restaurants from "./components/Restaurants/restaurants";
import MyOrders from "./components/MyOrders/myOrders";
import ErrorElement from "./components/errorRoute/errorElement";
import Restaurant from "./components/Restaurant/restaurant";
import OrderConfirmation from "./components/OrderConfirmation/orderConfirmation";
import Basket from "./Basket";
import { monitorUserOrders } from "./firebase/main/firebase";

export default function App() {
  const [user, setUser] = useState();
  console.log("rendering App");
  useEffect(() => {
    if (!user) return;
    return monitorUserOrders(user?.uid);
  }, [user]);

  const routes = [
    {
      path: "/",
      id: "rootRoute",
      element: (
        <>
          <NavBar />
          <div style={{ padding: "5px 25px" }}>
            <Outlet />
          </div>
        </>
      ),
      loader: () => {
        return {
          user: user,
          logInHandler: logInHandler,
          logOutHandler: logOutHandler,
          basket: new Basket(undefined)
        };
      },
      children: [
        {
          path: "/",
          element: <Hero />
        },
        {
          path: "/restaurants",
          id: "restaurants",
          element: <Restaurants />,
          loader: restaurantsLoader
        },
        {
          path: "/restaurants/:rid",
          element: <Restaurant />,
          id: "restaurant",
          loader: ({ params }) => restaurantDataLoader(params.rid)
        },
        {
          path: "/restaurants/:rid/orderConfirmation",
          element: <OrderConfirmation />,
          id: "orderConfirmation",
          loader: ({ params }) => orderConfirmationLoader(params.rid)
        },
        {
          path: "/myorders",
          element: <MyOrders />,
          loader: () => myOrdersLoader(user)
        }
      ],
      errorElement: (
        <>
          <NavBar />
          <ErrorElement />
        </>
      )
    }
  ];
  const mainRouter = createBrowserRouter(routes);

  return (
    <div className="App">
      <RouterProvider router={mainRouter} />
    </div>
  );

  function logInHandler(user) {
    setUser(user);
  }
  function logOutHandler() {
    setUser(null);
  }
}
