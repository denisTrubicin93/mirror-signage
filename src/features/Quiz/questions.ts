import { Question } from './models';

const MAXIMUM_EXPLANATION_LENGTH = 159;

const getRandomQuestions = (questions: Question[], count: number) => {
  const mapped = questions
    ? questions
        .filter(x => x.explanation.length <= MAXIMUM_EXPLANATION_LENGTH)
        .filter(function (elem) {
          return elem.url;
        })
        .map((item) => ({
          value: item,
          sort: Math.random(),
        }))
    : [];
  mapped.sort((a, b) => a.sort - b.sort);
  return mapped.map((item) => item.value).slice(0, count);
};

export { getRandomQuestions };
