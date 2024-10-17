/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog';
import { devtools } from 'frog/dev';
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next';
import { serveStatic } from 'frog/serve-static';
import { container, fontStyle } from '../styles/styles';
import { Roboto } from '../styles/fonts';

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: 'How BASEd are you?',
  imageOptions: {
    // @ts-ignore
    fonts: [...Roboto],
  },
});

const questions = [
  {
    question: 'Moo Deng 🦛, Pesto 🐧 or Both?',
    answers: [
      { answer: '🦛', weight: '0' },
      { answer: '🐧', weight: '1' },
      { answer: '🦛❤️️🐧', weight: '2' },
    ],
  },
  {
    question: 'Gold, Silver or Bronze?',
    answers: [
      { answer: 'Gold', weight: '0' },
      { answer: 'Silver', weight: '1' },
      { answer: 'Bronze', weight: '2' },
    ],
  },
  {
    question: 'Yes, No or Maybe?',
    answers: [
      { answer: 'Yes', weight: '0' },
      { answer: 'No', weight: '1' },
      { answer: 'Maybe', weight: '2' },
    ],
  },
  {
    question: 'Which MVP are you?',
    answers: [
      { answer: 'Katya', weight: '0' },
      { answer: 'Kealii', weight: '1' },
      { answer: 'Marcus', weight: '2' },
    ],
  },
  {
    question: 'Vince, VinceM or The Major?',
    answers: [
      { answer: 'Vince', weight: '0' },
      { answer: 'VinceM', weight: '1' },
      { answer: 'The Major', weight: '2' },
    ],
  },
];
const crypto = [
  { name: 'Bitcoin', desc: 'You are slow but very valuable.' },
  { name: 'Ethereum', desc: 'You are fast and always adapting to new things.' },
  { name: 'Polkadot', desc: 'You are complex and quick to embrace new ideas.' },
  { name: 'Litecoin', desc: 'You are quick and cheap.' },
  { name: 'Dogecoin', desc: 'You are the goodest doggo.' },
];
const enkryptDesc =
  'Easily manage your {crypto} with Enkrypt! The most user-friendly multichain wallet!';

const storedAnswers: number[] = [];
let questionNum = 0;

function EnkryptLogo() {
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

app.frame('/', c => {
  return c.res({
    image: (
      <div style={container}>
        <EnkryptLogo />
        <div style={fontStyle}>{app.title}</div>
      </div>
    ),
    intents: [
      <Button value='reset' action='/questions'>
        Let's find out!
      </Button>,
    ],
  });
});

app.frame('/questions', c => {
  const { buttonValue } = c;
  if (buttonValue && buttonValue != 'reset') {
    questionNum++;
    storedAnswers.push(parseInt(buttonValue));
  } else {
    storedAnswers.splice(0, storedAnswers.length);
    questionNum = 0;
  }
  const lastQuestion = questionNum === questions.length - 1;
  const linkAction = lastQuestion ? '/result' : '';
  const currentQuestion = questions[questionNum];
  const [answer1, answer2, answer3] = currentQuestion.answers;
  return c.res({
    image: (
      <div style={container}>
        <EnkryptLogo />
        <div style={fontStyle}>{currentQuestion.question}</div>
      </div>
    ),
    intents: [
      <Button value={answer1.weight} action={linkAction}>
        {answer1.answer}
      </Button>,
      <Button value={answer2.weight} action={linkAction}>
        {answer2.answer}
      </Button>,
      <Button value={answer3.weight} action={linkAction}>
        {answer3.answer}
      </Button>,
      <Button.Reset>Start Over</Button.Reset>,
    ],
  });
});

app.frame('/result', c => {
  let result = 0;
  for (const element of storedAnswers) {
    result += element;
  }
  result = result % crypto.length;
  const cryptoValue = crypto[result];
  return c.res({
    image: (
      <div style={{ ...container, flexDirection: 'row' }}>
        <EnkryptLogo />
        <img
          src={`/crypto/${cryptoValue.name}.png`}
          width={380}
          height={380}
          alt={`${cryptoValue.name}`}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignText: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60%',
          }}
        >
          <div style={{ ...fontStyle, fontSize: 45 }}>{`You are ${
            cryptoValue.name
          }.\n${cryptoValue.desc}\n${enkryptDesc.replace(
            '{crypto}',
            cryptoValue.name
          )}`}</div>
        </div>
      </div>
    ),
    intents: [
      <Button.Link href='https://chrome.google.com/webstore/detail/enkrypt/kkpllkodjeloidieedojogacfhpaihoh'>
        Download Enkrypt
      </Button.Link>,
      <Button.Reset>Start Over</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
