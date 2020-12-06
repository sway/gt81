import { isIOS } from "@util/deviceDetector";
import { GenericModal } from ".";

export const NotSupportedModal = (): JSX.Element => {
  return (
    <GenericModal
      isOpen={true}
      showClose={false}
      headline="Oops, this ain't gonna work"
      onDismiss={() => {
        return;
      }}
      height="25rem"
    >
      {isIOS() ? (
        <p>
          I&apos;m sorry, but GT81 is currently not supported on iOS and iPad OS
          devices or in Safari since there is no way to connect to a Bluetooth
          device from the browser.
        </p>
      ) : (
        <p>
          I&apos;m sorry, but GT81 is currently not supported in Safari since
          there is no way to connect to a Bluetooth device from the browser.
        </p>
      )}
      <p>
        Please, use Chrome, Firefox, or Edge on your laptop or Android device
        instead 🙏.
      </p>
    </GenericModal>
  );
};
