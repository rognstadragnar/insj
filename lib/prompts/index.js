const prompts = require('prompts');
const chalk = require('chalk');

function checkValidation({ validation, initial }, res) {
  const response = !res && initial ? initial : res;
  if (!validation) {
    return true;
  } else if (validation instanceof RegExp) {
    return validation.test(response);
  } else if (typeof validation === 'function') {
    return validation(response);
  }
  return false;
}

function formatMessage({ message, initial }) {
  if (initial) {
    return `${message} ${chalk.gray(`(${initial})`)}`;
  }
  return message;
}

async function runPrompt(rawQuestions) {
  let returnValue = {};
  const shouldAbort = false;
  let idx = 0;

  const questions = rawQuestions.map(q => {
    const question = Object.assign({}, q);
    const { initial } = question;
    delete question.initial;
    return Object.assign({}, question, {
      message: formatMessage({ message: question.message, initial }),
      validation: null,
      shouldAsk: null,
    });
  });

  async function onSubmit(prompt, response) {
    if (checkValidation(rawQuestions[idx], response)) {
      questions.shift();
      idx += 1;
    } else {
      console.log(prompt.errorMessage);
    }
  }

  const onCancel = () => {
    throw new Error();
  };

  async function run(response, prevQuestion) {
    if (response && prevQuestion && response[prevQuestion.name]) {
      returnValue = Object.assign({}, returnValue, response);
    } else if (prevQuestion && prevQuestion.initial) {
      returnValue = Object.assign({}, returnValue, { [prevQuestion.name]: prevQuestion.initial });
    } else if (response) {
      returnValue = Object.assign({}, returnValue, response);
    }

    if (!questions.length || shouldAbort) return;
    if (rawQuestions[idx].shouldAsk && !rawQuestions[idx].shouldAsk(returnValue)) {
      returnValue = Object.assign({}, returnValue, { [questions[0].name]: questions[0].default });
      questions.shift();
      idx += 1;
      await run(response);
    } else {
      console.log();
      const res = await prompts(questions[0], { onSubmit, onCancel });
      await run(res, rawQuestions[idx - 1 || 0]);
    }
  }

  await run();
  return returnValue;
}

module.exports = {
  runPrompt,
};
