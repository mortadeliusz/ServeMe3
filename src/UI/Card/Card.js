import classes from "./Card.module.css";

const Card = (props) => {
  return (
    <div
      className={`${classes.card} ${props.className}`}
      onClick={props.onClickHandler}
    >
      {props.children}
    </div>
  );
};

export default Card;
