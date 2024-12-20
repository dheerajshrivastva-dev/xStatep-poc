import { assign, setup } from "xstate";

export const CaptchaMachine = setup({
  types: {
    context: {} as { question: string; answer: number; userAnswer: number },
    events: {} as { type: "saveAnswer", userAnswer: number } | { type: "next", userAnswer: number },
  },
  actions: {
    saveAnswer: assign({
      userAnswer: ({ event }) => event.userAnswer,
    })
  },
  guards: {
    userAnswerIsEqualToAnswer: function ({ context }) {
      // Add your guard condition here
      return context.answer === context.userAnswer;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGECGAHALgYwBaoDoBFAVzkwEsB7AOwGJZUA3MAbQAYBdRUdK2CpVo8QAD0QBGAGwBmAgE5FigOwAmdvIAc7AKyqpAGhABPRJokEd7a+1UT50mVJ0BfF0bRY8hAII1YAO5gAE50HNxIIHwCQjQi4ggALE4KSlrWOjqaUoYmiPLKBNpaBfqJ0jrlbh4YOPgEfoEhYRIRvPyC1HGRCclSqUraulk5RqYIEllFGpryiZpqmqo6yspu7iA0VBBwIp51qCLRncI9iAC0uePnOgOKfYlSqsvKMtUg+97EZLCxRx1-M5JVRjSTsRIENTOHISWbsZTw1TvT71AAKqFgsEg-xiXXiiGUOn66hkEjsOkmykeoIQBQIuhKemUlMJaw2KN8-iCwRxJ26oASpIhaXk7E0MlU2lWNIk4Mh+iJUlhooRanWLiAA */
  context: {
    question: "2 + 2 = ?",
    answer: 4,
    userAnswer: 0
  },
  id: "Captcha",
  initial: "Question",
  states: {
    Question: {
      on: {
        saveAnswer: {
          target: "Answer",
          actions: "saveAnswer"
        }
      },
    },

    Passed: {
      type: "final",
    },

    Answer: {
      always: [{
        target: "Passed",
        guard: {
          type: "userAnswerIsEqualToAnswer",
        },
      }, {
        target: "Question",
        reenter: true
      }]
    }
  },
});
