import { Link, useLoaderData, useRouteLoaderData } from "react-router-dom";
import { getRestaurantWithItems } from "../../firebase/main/firebase";
import dummyRestaurantImage from "./images/pub.jpg";
import styles from "./restaurant.module.css";
import Card from "../../UI/Card/Card";
import FreepikImage from "../../UI/FreepikImage/FreepikImage";
import RestaurantMenuItem from "../RestaurantMenuItem/RestaurantMenuItem";
import { useState } from "react";

export async function loader(restaurantId) {
  const restaurant = await getRestaurantWithItems(restaurantId);
  return { restaurant: restaurant };
}

export default function Restaurant() {
  const [anythingInBasket, setAnythingInBasket] = useState(false);
  const basket = useRouteLoaderData("rootRoute").basket;
  const restaurantId = useLoaderData().restaurant.id;
  if (basket.rid !== restaurantId) {
    basket.rid = restaurantId;
    basket.items = [];
  }

  console.log("rendering restaurant");
  if (!useLoaderData().restaurant)
    return <h3>We didn't find this restaurant in our database.</h3>;

  return (
    <div className={styles.restaurant}>
      <RestaurantHeader />
      <RestaurantMenu setAnythingInBasket={setAnythingInBasket} />
      {anythingInBasket && <ActionButtons />}
    </div>
  );
}

const RestaurantHeader = () => {
  const { image, name } = useLoaderData();

  return (
    <Card className={styles["restaurant-header"]}>
      {image ? (
        <img
          className={styles["restaurant-header__image"]}
          src={image}
          alt="restaurant"
        />
      ) : (
        <FreepikImage
          className={styles["restaurant-header__image"]}
          src={dummyRestaurantImage}
          alt="restaurant"
          attributionURL="https://www.freepik.com/free-vector/music-bar-pub-cartoon-empty-interior-with-illuminated-signboard_5467486.htm#query=bar&position=18&from_view=search"
        />
      )}
      <h2 className={styles["restaurant-header__name"]}>{name}</h2>
    </Card>
  );
};
const RestaurantMenu = (props) => {
  const { menuItems, currencySymbol } = useLoaderData().restaurant;
  return (
    <div className={styles["restaurant-menu"]}>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <RestaurantMenuItem
              item={item}
              currencySymbol={currencySymbol}
              onBasketChange={(len) => props.setAnythingInBasket(len > 0)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
const ActionButtons = (props) => {
  return (
    <div className={styles["action-buttons"]}>
      <Link to="orderConfirmation">
        <div className={`main-button `}>Place Order</div>
      </Link>
    </div>
  );
};
