export function EnkryptLogo(): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        top: '3vh',
        left: '3vw',
      }}
    >
      <img src='/enkrypt.png' alt='Enkrypt Logo' width={133} height={26} />
    </div>
  );
}

export const MEWLogoWhite = () => {
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        top: '3vh',
        left: '3vw',
      }}
    >
      <img
        src='/mew-logo-white.png'
        alt='MEW White Logo'
        width={396 / 2}
        height={111 / 2}
      />
    </div>
  );
};

export const MEWLogoDark = () => {
  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        top: '3vh',
        left: '3vw',
      }}
    >
      <img
        src='/mew-logo-dark.png'
        alt='MEW Dark Logo'
        width={477 / 2}
        height={129 / 2}
      />
    </div>
  );
};
