import { assign,  setup } from "xstate";
import { CaptchaMachine } from "./captchaMachine";
import { generateCaptcha } from "../util";
import { NavigateFunction } from "react-router-dom";

export type goToStepParamsType = {
  step: number;
  path: string;
};

type InputType = {
  navigate?: null | NavigateFunction;
  data?: {
    step1data: string;
    step2data: string;
    step3data: string;
    step4data: string;
    step5data: string;
  }
  captcha?: boolean;
}

export const TestMachine = setup({
  types: {
    context: {} as {
      step: number;
      data: {
        step1data: string;
        step2data: string;
        step3data: string;
        step4data: string;
        step5data: string;
      };
      navigate: NavigateFunction | null;
      captchaSuccess: boolean;
    },
    events: {} as { type: "next", data?: string } | { type: "back", data?: string } | { type: "submit", data?: string } | { type: "save", data?: string } | {type: "retry", data?: string},
    input: {} as InputType,
  },
  actions: {
    goToStep: function ({ context }, params: goToStepParamsType) {
      // Add your action code here
      context.navigate?.(params.path);
      context.step = params.step;
    },
    saveData: function ({ context, event }, params: { data: string, key: string }) {
      context.data = { ...context.data, [params.key]: event?.data };
    },
  },
  actors: {
    "saveFinal": CaptchaMachine
  },
  guards: {
    isPassed: ({ context }) => {
      return context.captchaSuccess
    }
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDED2AnAtgWQIYGMALASwDswA6AZQBcwAHARgGJyAPGgbQAYBdRUPVSxiNYqlICQbRAFYALIwqMATLO6NF8tdwDMAGhABPRADYA7EoAcATm6ybimyt0v5AX3eG0WPETKUtAxKVLgAbmC0uHTMsOFgPPxIIEIiYhJSMgiMNjYUVubq3JY58qa6prKGJgiVVhSyldxWzfbyluae3hg4BCTk1HT0KqxgHIlSqaLikslZjIzmphTcpmpqrua6W1bVZubyFLp2Dk4ubl0gPr3+A0HDzABGBADWE8lT6bOgWQpKqupNJodAZjHJChQbNt2ltjjYDrJLtc-P1AkMVNR4lEYnEIu9BMJphk5ogrLpDlYAYwydx5LpyfI9rVTEpVuoWi0FB0kT0UQFBgxdKNxnxJoSvpkzCzIdtZAtqfICs0mYqMYq6aZaQU1rJEV4rry+vz7kLnvg3qKPuKZpLsotlqt1rJNttdLswQhZOZ6nSDuZYbkETzfEa7kNdJiItiwLF4viUtbiT9EJpzHlCtxuCpHLYVPYVEzZC1lNpFtnNTYCipgzdUQL6PJhVxLQS0jaSZ65codEDtOpQTVs9wGt7VBYrNmVEsa3ywwxG2aLUlW0TvtI5NKARotCCmW7ls7VBrdLIp5U9d0Q7c0fPI5EaNEY7iEi2E22k+vsrl8hnigtHOUlQqmUDSVtodhWOo8hlDOoY3vQshPK88afO2yaeoo3aAju-ZMpSFDyLkuQTvIjRQTYsHXvWsh3tGzAQBIlBkGEqAvJQz7IGQuAADYoYma7zJq9RWIRdgspYgHujUdKsuoo6MKsjAVLolF1vcNGhFGD4xGA6DoBgFD0Nx0QAGY9BQHFcbxr6oR+glqJCjr+gUlhsnuxQEYe5LUt6jSMKpxpDDRAAijGxAAro8mCiHx74CSmziHIUtjwrYMmrCqp4UFOWyntwdh5rYAVzghFCheQEVRTFjDLm+q62j5hx2DkCzbI68JMioLjZaYpgyROhSKJBxXwTRACiekYMw6BgDQ6BGLF9UdowpiOBQfVsnKUJrBUnWNJCh5KeSFQXgaV5qUFtHaTGi0Sst6g0WJOUuQpQEelOw66mUkF5jYCl5nq+qkKgEBwFIyJwWKcW2gAtCojIejDDqZhoKPEdoBQjfWjBQ0t6Hw4WlgrJUqhqIGRZY-cIRYtduN3eh5gFh6pj4WmK1upSNinlslNDEoz4QNGdNoZ+9KHOWVgFKo5i0lsCM1Czn2KJUANTqRKn6hDVH3Cowt2WYRYyoU8oiUqUnghGZG0moOSS3SvMMBimn3o+evxQgMvLFCxsLKbMvm7UInZX95SSzk3Ma5etaBY7FnxILtNWtDHY2Kt2XHZWuj-tSjBMizEa0iteXc+rDv0LobsNboeg-uoXUVPCysqs462ln6jDOhUphlxGztC0neOfkpXYFHXLirQcK15zXFQFNX8JQSoVg93HEQJ67A-00PLKHIsOT5YR462NPGK+4zQ0Ts4p1axd86Vx2BMeieeT5SJ1dklCji0mXhx94nK5byyIzFUacSKVhlrkBSWYf6r0gP3ABIsshi2DizKWH12jkhAfUL0hEWhZzcLkbumtDTayCvfdCSka6jyzOPRuU8PTDwoEsPqw8WTOCXkQqOs5RpXQ3gg-W2QTzWAzPXCeTcn7VwaAoFmeU-pZnsGXEKjFyFDzTBiFmhR6QFTKPLRA2xlgWFTiJCsE4s6KIoBNfS6AVHzDUetUeWisw6PcsOKwE9HBeign1LGnFSA8XuDYxAeY1gjkpJUbYU5IK6IQLKAi2YOhuOrvlIhnggA */
  context: ({ input }) => ({
    step: 1,
    data: {
      step1data: input.data?.step1data || "",
      step2data: input.data?.step2data || "",
      step3data: input.data?.step3data || "",
      step4data: input.data?.step4data || "",
      step5data: input.data?.step5data || "",
    },
    captchaSuccess: input?.captcha || false,
    navigate: input?.navigate || null,
  }),
  id: "FormMachine",
  initial: "Step1",
  states: {
    Step1: {
      initial: "SaveState",
      on: {
        next: {
          target: "Step2",
          actions: {
            type: "goToStep",
            params: {
              step: 2,
              path: "step2",
            },
          },
        },
      },
      states: {
        SaveState: {
          on: {
            save: {
              target: "savedState",
              actions: {
                type: "saveData",
                params: {
                  data: "step1data....",
                  key: "step1data"
                }
              },
            },
          },
        },
        savedState: {
          type: "final",
        },
      },
    },
    Step2: {
      initial: "SaveState",
      on: {
        next: {
          target: "Step3",
          actions: {
            type: "goToStep",
            params: {
              step: 3,
              path: "step3",
            },
          },
        },
        back: {
          target: "Step1",
          actions: {
            type: "goToStep",
            params: {
              step: 1,
              path: "step1",
            },
          },
        },
      },
      states: {
        SaveState: {
          on: {
            save: {
              target: "savedState",
              actions: {
                type: "saveData",
                params: {
                  data: "step2data....",
                  key: "step2data"
                }
              },
            },
          },
        },
        savedState: {
          type: "final",
        },
      },
    },
    Step3: {
      initial: "SaveState",
      on: {
        next: {
          target: "Step4",
          actions: {
            type: "goToStep",
            params: {
              step: 4,
              path: "step4",
            },
          },
        },
        back: {
          target: "Step2",
          actions: {
            type: "goToStep",
            params: {
              step: 2,
              path: "step2",
            },
          },
        },
      },
      states: {
        SaveState: {
          on: {
            save: {
              target: "savedState",
              actions: {
                type: "saveData",
                params: {
                  data: "step3data....",
                  key: "step3data"
                }
              },
            },
          },
        },
        savedState: {
          type: "final",
        },
      },
    },
    Step4: {
      initial: "SaveState",
      on: {
        next: {
          target: "Step5",
          actions: {
            type: "goToStep",
            params: {
              step: 5,
              path: "step5",
            },
          },
        },
        back: {
          target: "Step3",
          actions: {
            type: "goToStep",
            params: {
              step: 3,
              path: "step3",
            },
          },
        },
      },
      states: {
        SaveState: {
          on: {
            save: {
              target: "savedState",
              actions: {
                type: "saveData",
                params: {
                  data: "step4data....",
                  key: "step4data"
                }
              },
            },
          },
        },
        savedState: {
          type: "final",
        },
      },
    },
    Step5: {
      initial: "SaveState",
      on: {
        back: {
          target: "Step4",
          actions: {
            type: "goToStep",
            params: {
              step: 4,
              path: "step4",
            },
          },
        }
      },
      states: {
        SaveState: {
          invoke: {
            src: "saveFinal",
            input: () => {
              const { question, answer } = generateCaptcha();
              return {
                question,
                answer
              }
            },
            id: "saveFinal",
            systemId: "saveFinal",
            onDone: {
              target: "Done",

              actions: assign({
                captchaSuccess: ({ event } ) => {
                  return event.output.isPassed
                },
              })
            },

            onError: "Error"
          },

          always: {
            target: "Done",
            guard: "isPassed"
          }
        },

        Done: {
          on: {
            submit: [{
              guard: "isPassed",
              target: "#FormMachine.FinalStep",
              reenter: true,
            }, {
              target: "Error",
              reenter: true
            }]
          }
        },

        Error: {
          on: {
            retry: "SaveState"
          }
        }
      },
    },
    FinalStep: {
      type: "final",
    },
  },
});
