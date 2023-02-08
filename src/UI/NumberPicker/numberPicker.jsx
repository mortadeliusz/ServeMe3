import styles from "./numberPicker.module.css";

const NumberPicker = (props) => {
  function onPlus(event) {
    event.stopPropagation(); //to prevent whatever the parent onClick does if number picker was clicked
    // props.onPlusHandler();
    props.onValueChange(props.value + 1);
  }
  function onMinus(event) {
    event.stopPropagation(); //to prevent whatever the parent onClick does if number picker was clicked
    // props.onMinusHandler();
    props.onValueChange(Math.max(props.value - 1, 0));
  }

  return (
    <div className={styles["number-picker"]}>
      <button
        className={styles["number-picker__button"] + " material-icons"}
        onClick={onMinus}
      >
        remove
      </button>
      <span className={styles["number-picker__value"]}>{props.value || 0}</span>
      <button
        className={styles["number-picker__button"] + " material-icons"}
        onClick={onPlus}
      >
        add
      </button>
    </div>
  );
};
export default NumberPicker;
