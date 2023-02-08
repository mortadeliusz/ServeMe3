import styles from "./RestaurantMenuItem.module.css";
import Card from "../../UI/Card/Card";
import dummyBeerImage from "./dummyBeer.jpg";
import FreepikImage from "../../UI/FreepikImage/FreepikImage";
import NumberPicker from "../../UI/NumberPicker/numberPicker";
import { useRouteLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

const RestaurantMenuItem = (props) => {
  const basket = useRouteLoaderData("rootRoute").basket;
  const [itemQty, setItemQty] = useState(
    basket.items.filter((item) => item.id === props.item.id)[0]?.qty || 0
  );
  useEffect(() => props.onBasketChange(basket.items.length), [
    basket.items.length,
    props
  ]);

  const itemImageElement = (
    <div className={styles["image-min"]}>
      {props.item.image ? (
        <img src={props.item.image} alt="item" />
      ) : (
        <FreepikImage
          src={dummyBeerImage}
          alt="item"
          attributionURL="https://www.freepik.com/free-psd/beer-bottle-with-label-mockup_23967827.htm#page=4&query=beer%20bottle&position=17&from_view=keyword"
        />
      )}
    </div>
  );
  return (
    <Card className={styles["restaurant-menu-item"]}>
      {itemImageElement}
      <div className={styles.info}>
        <span>{props.item.name}</span>
        <span className={styles["item-description"]}>
          {props.item.description}
        </span>
      </div>
      {props.item.price} {props?.currencySymbol || "EUR"}
      <NumberPicker
        value={itemQty}
        onValueChange={(val) => {
          basket.update(props.item, val);
          setItemQty(val);
        }}
      />
    </Card>
  );
};

export default RestaurantMenuItem;
