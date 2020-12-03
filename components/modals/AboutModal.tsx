import { GenericModal } from "@components/modals/GenericModal";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { isMacOS } from "@util/deviceDetector";

const SubHeading = styled.h2`
  text-shadow: 1px 0 0 #66d8ff, -1px 0 0 #ff72be;
  text-align: left;
  width: 100%;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const noteStyle = css`
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  font-size: 0.875rem;
`;

const AboutColumn = styled.div`
  margin-top: 1.5rem;

  @media screen and (min-width: 768px) {
    & + & {
      margin-left: 1.5rem;
      padding-left: 1.5rem;
      border-left: 1px solid #222;
    }
  }
`;

export const AboutModal = (props: { onDismiss(): void }): JSX.Element => {
  return (
    <GenericModal
      isOpen={true}
      headline="About GT81"
      showClose
      fullscreen
      onDismiss={props.onDismiss}
    >
      <p
        css={css`
          @media screen and (min-width: 768px) {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
        `}
      >
        This is a web-based version of the workout dashboard you can find in
        BEAT81 classes. It was built in 2020 during the 2nd lockdown to be used
        during both online and offline workouts.
      </p>
      <div
        css={css`
          display: flex;
          flex-direction: row;

          @media screen and (max-width: 768px) {
            flex-direction: column;
          }
        `}
      >
        <AboutColumn>
          <SubHeading>How does it work</SubHeading>
          <p>
            GT81 connects to your heart-rate monitor over Bluetooth to be able
            to measure your heart rate and calculate the amount of calories
            burned and grit points earned based on your gender, age, and weight.
          </p>
          <p>
            All measurement and calculation happens locally and no data is sent
            anywhere.
          </p>
        </AboutColumn>
        <AboutColumn>
          <SubHeading>What do I need?</SubHeading>
          <p>
            You will need a laptop, tablet, or phone with a modern browser that
            supports (Web) Bluetooth, which are currently Chrome, Firefox, and
            Edge on macOS, Windows, and Android. Sadly, Web Bluetooth is not
            supported on iOS and iPad OS devices, so there&apos;s no way to
            connect.
          </p>
          <p>
            You will also need a Bluetooth-enabled heart rate monitor, ideally
            in the form of a chest strap. It does not really matter which one
            you get as long as it supports BLE (Bluetooth Low Energy). generic
            Bluetooth HR monitor. You can get a generic brand one on Amazon for
            approx. 30 EUR (e.g.{" "}
            <a href="https://www.amazon.de/-/en/Heartbeat-Bluetooth-Runtastic-Endomtom-Monitor/dp/B07DRKYZKM/">
              this one
            </a>
            ).
          </p>
        </AboutColumn>
        <AboutColumn>
          <SubHeading>How do I start?</SubHeading>
          <p>
            Once you&apos;ve configured your profile, pur your HR monitor on and
            click on &quot;Connect to device&quot;. Pick the device from the
            list displayed by the browser to pair and connect. The list only
            includes HR monitors, so the one you see is likely the one you have.
          </p>
          {isMacOS() && (
            <p css={noteStyle}>
              💁🏻‍♀️ If you don&apos;t see any devices you might need to allow
              access to Bluetooth to your browser in System Preferences &rarr;
              Security &amp; Privacy &rarr; Privacy &rarr; Bluetooth.
            </p>
          )}
        </AboutColumn>
      </div>
    </GenericModal>
  );
};
