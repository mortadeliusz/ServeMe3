import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import { getUserOrders } from "../../firebase/main/firebase";
import Card from "../../UI/Card/Card";
import classes from "./myOrders.module.css";

export default function MyOrders(props) {
  const { orders } = useLoaderData();
  const user = useRouteLoaderData("rootRoute").user;

  if (!user) return <h3>You have to be logged in to view your orders.</h3>;
  if (orders.length === 0) return <h3>No orders found.</h3>;
  return (
    <div className={classes.wrapper}>
      {orders.map((order) => (
        <Order order={order} key={order.id} />
      ))}
    </div>
  );
}
export async function loader(user) {
  var orders = [];
  if (user) orders = await getUserOrders(user.uid);
  return { orders: orders };
}

function Order({ order }) {
  return (
    <Card>
      {order.status} {new Date(order.created.seconds * 1000).toDateString()}{" "}
      {order.uid}
    </Card>
  );
}
