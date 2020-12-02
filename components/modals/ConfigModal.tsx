import { Config } from "@components/globalTypes";
import { buttonStyle } from "@components/modals/sharedStyles";
import { css } from "@emotion/react";
import { FormEvent, useState } from "react";
import { GenericModal } from ".";

type ConfigModalProps = {
  isOpen: boolean;
  config: Config;
  setConfig(config: Config): void;
  onDismiss(): void;
};

const formCss = css`
  font-size: 1.25rem;
  text-transform: uppercase;
  display: grid;
  grid-template-rows: 0.25fr 1fr 0.25fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "sexHeader sexHeader" "sexMale sexFemale" "ageHeader weightHeader" "age weight";
  row-gap: 1rem;
  column-gap: 2rem;

  input[type="number"],
  label[for^="sex"] {
    display: block;
    font-size: 3rem;
    font-weight: 900;
    width: 100%;
    background-color: #222;
    border: 3px solid #666;
    border-radius: 1rem;
    padding: 1rem;
    text-align: center;
    color: white;
    outline: none;
    font-feature-settings: "tnum", "lnum", "zero", "ss06";
  }

  label[for^="sex"] {
    font-size: 1.75rem;
    font-weight: 900;
    background-color: #222;
  }

  input[type="radio"] {
    display: none;
  }

  input[type="number"]:focus,
  input[type="radio"]:checked + label[for^="sex"] {
    background-color: #333;
    border-color: deepskyblue;
  }

  input[type="number"]:hover,
  label[for^="sex"]:hover {
    background-color: #333;
    cursor: pointer;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const ConfigModal = (props: ConfigModalProps): JSX.Element => {
  const [values, setValues] = useState(props.config);

  return (
    <GenericModal
      isOpen={props.isOpen}
      showClose={!props.config.default}
      onDismiss={props.onDismiss}
      headline="Your profile"
    >
      <p
        css={css`
          width: 100%;
          text-align: left;
          color: #999;
          margin: 0.5rem 0 2rem;
        `}
      >
        This data is used to calculate your maximal HR and calorie burn. It is
        stored in your browser and does not leave your device.
      </p>

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
        css={formCss}
      >
        <h3 style={{ gridArea: "sexHeader" }}>Your sex:</h3>
        <div style={{ gridArea: "sexMale" }}>
          <input
            type="radio"
            id="sex_m"
            name="gender"
            value="MALE"
            checked={values.gender === "MALE"}
          />
          <label htmlFor="sex_m">Male</label>
        </div>

        <div style={{ gridArea: "sexFemale" }}>
          <input
            type="radio"
            id="sex_f"
            name="gender"
            value="FEMALE"
            checked={values.gender === "FEMALE"}
          />
          <label htmlFor="sex_f">Female</label>
        </div>

        <div style={{ gridArea: "ageHeader" }}>
          <label htmlFor="age">
            <h3>Your age:</h3>
          </label>
        </div>

        <div style={{ gridArea: "age" }}>
          <input type="number" id="age" name="age" defaultValue={values.age} />
        </div>

        <div style={{ gridArea: "weightHeader" }}>
          <label htmlFor="age">
            <h3>Your weight (kg):</h3>
          </label>
        </div>

        <div style={{ gridArea: "weight" }}>
          <input
            type="number"
            id="weight"
            name="weight"
            defaultValue={values.weight}
          />
        </div>
      </form>
      <button
        css={css`
          ${buttonStyle};
          width: calc(100% - 3rem);
          position: absolute;
          bottom: 2rem;
          height: 5rem;
          @media screen and (max-width: 768px) {
            height: 3rem;
          }
        `}
        className="stop"
        onClick={() => {
          props.setConfig({
            age: values.age,
            gender: values.gender,
            weight: values.weight,
            default: false,
            maxHr: 0,
          });
          props.onDismiss();
        }}
      >
        Save
      </button>
    </GenericModal>
  );
};
