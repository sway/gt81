import Modal from "react-modal";
import { FormEvent, useState } from "react";

import { Config } from "@components/UserView";
import actionButtonStyles from "@styles/ActionButton.module.scss";
import formStyles from "@styles/modals/ConfigModal.module.scss";

type ConfigModalProps = {
  isOpen: boolean;
  setConfig(config: Config): void;
  onDismiss(): void;
};

const modalStyle: ReactModal.Styles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  content: {
    position: "absolute",
    top: "50%",
    width: "50vw",
    minWidth: "400px",
    maxWidth: "600px",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    backgroundColor: "#111111",
    backgroundImage: 'url("~/assets/images/topo.svg")',
    WebkitOverflowScrolling: "touch",
    borderRadius: "1rem",
    border: "1px solid #333",
    outline: "none",
    padding: "20px",
    color: "white",
    fontFamily: "'Work Sans'",
    height: "35rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textTransform: "uppercase",
  },
};

export const ConfigModal = (props: ConfigModalProps): JSX.Element => {
  const [values, setValues] = useState({
    sex: "sex_m",
    age: 32,
    weight: 82,
  });

  return (
    <Modal isOpen={props.isOpen} style={modalStyle}>
      <h1>Your profile</h1>

      <form
        onChange={(event: FormEvent) => {
          const target = event.target as HTMLInputElement;
          const value = target.value;
          const name = target.name;

          setValues({
            ...values,
            [name]: value,
          });
        }}
        className={formStyles.form}
      >
        <h3 style={{ gridArea: "sexHeader" }}>Your sex:</h3>
        <div style={{ gridArea: "sexMale" }}>
          <input
            type="radio"
            id="sex_m"
            name="sex"
            value="sex_m"
            defaultChecked
          />
          <label htmlFor="sex_m">Male</label>
        </div>

        <div style={{ gridArea: "sexFemale" }}>
          <input type="radio" id="sex_f" name="sex" defaultValue="sex_f" />
          <label htmlFor="sex_f">Female</label>
        </div>

        <div style={{ gridArea: "ageHeader" }}>
          <label htmlFor="age">
            <h3>Your age:</h3>
          </label>
        </div>

        <div style={{ gridArea: "age" }}>
          <input type="number" id="age" name="age" defaultValue="32" />
        </div>

        <div style={{ gridArea: "weightHeader" }}>
          <label htmlFor="age">
            <h3>Your weight (kg):</h3>
          </label>
        </div>

        <div style={{ gridArea: "weight" }}>
          <input type="number" id="weight" name="weight" defaultValue="75" />
        </div>
      </form>
      <button
        className={actionButtonStyles.stop}
        style={{
          width: "75%",
          position: "absolute",
          bottom: "2rem",
          height: "5rem",
          boxSizing: "border-box",
        }}
        onClick={() => {
          props.setConfig({
            age: values.age,
            gender: values.sex === "sex_m" ? "MALE" : "FEMALE",
            weight: values.weight,
            default: false,
          });
          props.onDismiss();
        }}
      >
        Save
      </button>
    </Modal>
  );
};
