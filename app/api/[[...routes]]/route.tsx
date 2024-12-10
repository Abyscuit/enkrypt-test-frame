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
  title: 'What blockchain are you?',
  imageOptions: {
    // @ts-ignore
    fonts: [...Roboto],
  },
});

const questions = [
  {
    question: 'Onchain, on-chain or on chain?',
    answers: [
      { answer: 'Onchain', weight: '0' },
      { answer: 'On-Chain', weight: '1' },
      { answer: 'On Chain', weight: '2' },
    ],
  },
  {
    question: 'DeFi or Memecoins?',
    answers: [
      { answer: 'DeFi', weight: '0' },
      { answer: 'Memecoins', weight: '1' },
      { answer: '1) What', weight: '2' },
    ],
  },
  {
    question: "I'm in it for the…",
    answers: [
      { answer: 'Tech', weight: '0' },
      { answer: 'Memes', weight: '1' },
      { answer: 'Money', weight: '2' },
    ],
  },
  {
    question: 'When did you start in crypto?',
    answers: [
      { answer: 'Post 2020', weight: '0' },
      { answer: '2017-2020', weight: '1' },
      { answer: 'Pre 2017', weight: '2' },
    ],
  },
  {
    question: 'Are you currently staking any crypto?',
    answers: [
      { answer: 'Maybe?', weight: '0' },
      { answer: 'No', weight: '1' },
      { answer: 'Yes', weight: '2' },
    ],
  },
];
const crypto = [
  { name: 'Dogecoin', desc: "It's giving fun to be around." },
  { name: 'Solana', desc: 'Not afraid to embrace your silly side!' },
  {
    name: 'Ethereum',
    desc: 'You adapt to challenges and are not afraid to try new things.',
  },
  { name: 'Bitcoin', desc: 'A reliable leader, the people love you!' },
  { name: 'Base', desc: 'Basically very based.' },
];
const enkryptDesc =
  'Easily manage your {crypto} with our multichain browser wallet Enkrypt!';

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
