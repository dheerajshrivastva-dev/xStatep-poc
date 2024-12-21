import { assign, setup } from "xstate";
import { generateCaptcha } from "../util";

export const CaptchaMachine = setup({
  types: {
    context: {} as { question: string; answer: number; userAnswer: number },
    events: {} as { type: "saveAnswer", userAnswer?: number } | { type: "next", userAnswer?: number } | { type: "back", userAnswer?: number },
    output: {} as { isPassed: boolean },
    input: {} as { question: string; answer: number; },
  },
  actions: {
    saveAnswerAction: assign({
      userAnswer: ({ event }) => event?.userAnswer ?? 0,
    }),
    setCaptchaQuestion: ({ context }) => {
      const { question, answer } = generateCaptcha();
      context.question = question;
      context.answer = answer;
    }
  },
  guards: {
    userAnswerIsEqualToAnswer: ({ context }) => {
      // Add your guard condition here
      return context.userAnswer === context.answer;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGECGAHALgYwBaoFlU8BLAOzADoBFAVzkxIHsyBiWVANzAEEzYA7mABOAbQAMAXUSh0TWCUYsZIAB6IAjADYAnJXEGDAJgAcOjUfFaTWgDQgAnpoDMGyjo8eArAHZnzkx8AFi8tAF8w+zQsPEJiXHIqPkERVlVYTFRMKlQAM2zhAAoNQwBKVmicfCJSCkpkoTEpFTkFJTIVdQRxeyduiKiMKrjapP5GtIysnPyRYrKKodiahLqGkVENaSQQVsVmDp2ut2cgoy8g8R0g52MjIJMg3sQjf0ofH1CtI0+L840IpEQGQmBA4CpKst4okWvJ9sojogALTaZyUII3G4+GwaDSfZzPBBIwKULyGDQmIxaUIUnQmAYgSHVaF1OgMA6wtocxFE3FedGY5zYrS4-EaQmPdxeHQ-e4XR6WcJApkjVZUAAKqFgsEgnPhh1AXQ+PkoWh8FMeFjp4mcOglJkoJn8-i0zmpJhMXgsDJVK0S9XGIj17U6iGcoXR1k+IpM4k+3kJOnE+idt1u0telOcgLCQA */
  context: ({ input }) => {
    return {
      question: input.question,
      answer: input.answer,
      userAnswer: 0,
    };
  },
  id: "CaptchaMachine",
  initial: "Question",
  output: ({ context }) => ({
    isPassed:context.userAnswer === context.answer,
  }),
  states: {
    Question: {
      on: {
        saveAnswer: {
          target: "Answer",
          actions: "saveAnswerAction"
        }
      },
    },

    Passed: {
      type: "final",
    },

    Answer: {
      after: {
        1000: [
          {
            target: "Passed",
            guard: {
              type: "userAnswerIsEqualToAnswer",
            }
          },
          {
            target: "Question",
            actions: "setCaptchaQuestion"
          }
        ],
      }
    }
  },
});
