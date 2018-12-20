import {
  Feedback
} from './esm/es5/build/bruit-core.entry';

export function send(apiKey, agreement, data, dataFn) {

  if (!apiKey) {
    console.error('[BRUIT] apiKey must be defined !');
    return;
  }

  if (!data) {
    data = [];
  }

  data.push({
    id: 'agreement',
    label: 'agreement',
    value: agreement || false,
    type: 'checkbox'
  });

  var feedback = new Feedback(apiKey);
  return feedback.init().then(() =>
    feedback.send(data, undefined, dataFn)
  );

}
