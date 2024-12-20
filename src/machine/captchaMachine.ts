import { assign, setup } from "xstate";

export const CaptchaMachine = setup({
  types: {
    context: {} as { question: string; answer: number; isPassed: boolean, userAnswer: number },
    events: {} as { type: "save", userAnswer: number } | { type: "next", userAnswer: number },
  },
  actions: {
    saveAnswer: assign({
      isPassed: ({ context, event }) => context.answer === event.userAnswer,
      userAnswer: ({ event }) => event.userAnswer,
    })
  },
  guards: {
    userAnswerIsEqualToAnswer: function ({ context }) {
      // Add your guard condition here
      return context.isPassed;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGECGAHALgYwBaoDoBFAVzkwEsB7AOwGJZUA3MAbQAYBdRUdK2CpVo8QAD0QBGAGwBmAgE5FigOwAmdvIAc7AKyqpAGhABPRJokEd7a+1UT50mVJ0BfF0bRY8hAII1YAO5gAE50HNxIIHwCQjQi4ggALE4KSlrWOjqaUoYmiPLKBNpaBfqJ0jrlbh4YOPgEfoEhYRIRvPyC1HGRCclSqUraulk5RqYIEllFGpryiZpqmqo6yspu7iA0VBBwIp51qCLRncI9iAC0uePnOgOKOYqq+sqJqtUg+97EZLCxRx1-M5JVRjSTsRIENTOHISWbsZTwt4bT71AAKqFgsEg-xiXXiiGUOn66hkEjsOkmLyu+UKuhKemUlMJa2RtS+jSCwRxJ26oASpIhaXk7E0MlU2lWoIm4Mh+iJUlhwoRanWLiAA */
  context: {
    question: "2 + 2 = ?",
    answer: 4,
    isPassed: false,
    userAnswer: 0
  },
  id: "Captcha",
  initial: "Question",
  states: {
    Question: {
      on: {
        save: {
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
