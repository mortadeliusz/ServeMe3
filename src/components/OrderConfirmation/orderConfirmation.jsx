import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";
import { createOrder } from "../../firebase/main/firebase";
import Card from "../../UI/Card/Card";
import styles from "./orderConfirmation.module.css";

export function loader(rid) {
  return { rid: rid };
}
export default function OrderConfirmation(props) {
  const { basket, user } = useRouteLoaderData("rootRoute");
  const { rid } = useLoaderData();
  return (
    <>
      <div className={styles.summary}>
        {basket.items.map((item) => (
          <Card key={item.id}>{`${item.name}  x  ${item.qty}`}</Card>
        ))}
      </div>
      <div className={styles.actions}>
        <Link to=".." relative="path" className={styles.item}>
          <div
            className={`main-button`}
            onClick={() => onConfirm(basket, user?.uid || "anonymous", rid)}
          >
            Confirm
          </div>
        </Link>
        <Link to=".." relative="path" className={styles.item}>
          <div className={`main-button`}>Cancel</div>
        </Link>
      </div>
    </>
  );
}
function onConfirm(basket, uid, rid) {
  const order = {
    uid: uid,
    status: "New",
    items: basket.items.map((item) => {
      return { id: item.id, name: item.name, price: item.price, qty: item.qty };
    })
  };
  createOrder(order, rid).then((basket.items = []));
}
