import { GenericModal } from ".";

export const IOSModal = (): JSX.Element => {
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
      <p>
        I'm sorry, but GT81 is currently not supported on iOS and iPad OS
        devices since there is no way to connect to a Bluetooth device from the
        browser.
      </p>
      <p>Please, use your laptop or Android device instead 🙏.</p>
    </GenericModal>
  );
};
