export const generateCode = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 4)
    .toUpperCase();

export const computeScore = ({ response, answer }) => {
  if (response === answer) {
    return -5;
  }
  return Math.abs(answer - response);
};
