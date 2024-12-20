import { assign, createMachine, setup } from "xstate";
import { CaptchaMachine } from "./captchaMachine";

export type goToStepParamsType = {
  step: number;
  path: string;
};

type InputType = {
  navigate?: null | ((...args: any[]) => void);
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
      navigate: null | ((...args: any[]) => void);
      captchaSuccess: boolean;
    },
    events: {} as { type: "next" } | { type: "back" } | { type: "submit" } | { type: "save" } | {type: "retry"},
    input: {} as InputType,
  },
  actions: {
    goToStep: function ({ context }, params: goToStepParamsType) {
      // Add your action code here
      context.navigate?.(params.path);
      context.step = params.step;
    },
    saveData: function ({ context }, params: { data: string, key: string }) {
      context.data = { ...context.data, [params.key]: params.data };
    },
  },
  actors: {
    "saveFinal": createMachine(CaptchaMachine.config)
  }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFUB2AXAlugNpAdAMrpgAOAjAMSpgAe6A2gAwC6iopA9rNpp6uxC1EAVgAs5fOQBMIptIBsTMQGYxAdgAcAGhABPRAvWTNATiYjN6oxpGmFAXwe60WXAWJlJhAIYA3MGIfEkpYfzBmNiQQLh4sfkFhBHJTU3wrOXJ5JgUFFU01XQMEBUt8EVKmY0sU9WlyJxcMbDwIIhJSaWo6RlZBWN4E6KTycmt8HNkRcjEFUzrTIsN1MXwVc0trFfU7R2cQVxaPDq6AIx8AYwBrSP7uQYFh0QkpWXklVQ0dfVEd-FMVCt7JppPkxKZpI0Ds13G1PJ0iOEgiEwgFbtEBvFHqAkgVVpoZCIVBUVNJNGZpEsSgpJDk5Bp1nN6pD9odYe0yCpuvR0Rx7ljEoYaf9ASJZGJFG9Fj8EGIQfg5appGJVICViooWzWhzSFzztdeTF+XxsUJEKNxpMRNNZvNpNLiiItArAWIKhYJblTJqYdr4SpEQFkWBQuFDZiTYLknK0jsmFlyCCrNJQVS8ppyspSuQ5uDySIfW4-R0xNzelE+XFI08ENbJDI5Qp7dm5eoqfamOUtBYskwmOtiWJC0c4SXKPqbn0McahjjRNNXo3mzarFT8gpyipRiCm0xyTT1MP2fDVr4g+hgiHUREp5WHlGUmkrOCybltioFN9ivkM6DLJoKhVFYFCHVlfWOMgRHHS5JwrI0q1nM1axeBtNCbewVzbGUCQVVJUlUPJ5CyQ8wKLCDSBEQNAgvEIIH4MB8EwVA-E4K4GOvfAADMmJ8HBwxnU0RjySiMhkTQqhpFQLCpMR+3wWRTCsJtrGUdQqiPYtIKo4NKDAAAnPTOD0-BSBwYJOKMgBbfAOO41BeP4hDBPNPIN3EOZzCbcg5CbNcqgVIke1kupclApoyNHLSABF6NCABXU5LOwRz7xrFIlH+TQ3WI6R+3wtdxjGewcgpADlI08jKIAUQMozKD0sB0D0vQUoFNK1MogFrETeo1FJSkZVkDdTECpQtiyiEnH2VBOAgOBBC1SA7icqMAFplSpVbOrw8l1C3V9xILUiRx1chltSucEA2mUnVpEDUly3JphBCrIoobSaLAc62suuo0xw9RTBzDQcysCTXtOmzwggYNvurS6VDUeTgTwiwwesf7O3EHNpnUYCqk0CH4WkOHEKSUoMy6sVxElOQHV+ANAPsLQCVmPaiZOD7L1J5yEDU4bRXFWmmHpkosuRnMU0Uj8KhI8KTuJqGAhhz6eajew0lBFVZER5kc3+gNlElnYzGtT8Oc5NW0q3AMMhFyXcqyqk6wmZQnXqQGiVmC3dS5kgrcu8gPxMOMgabR2xDTYU9pkaQ6gJOowuhCKdQDa8Ve56cVrSptVjGFIRcUqxzBUKPOzlGQt123ONWO48SwDpDru-Pt8D2ux5GtZR8nEH3TyRVWs4upC-plCRJFmZVZKyr0qiO+X67IVZ09hoefqQxHVmbPGdnmSuv0QCRO2ZFVxGp8xTCTxa3pERuRht9JQ4dvdI5lHM0jdKS8aMQcg5ZBfNIUT9l9Ne8MkJB2FHbMOKYX5rikuUdyoMsh5EUnsABlV8AxRoHfc04kAyKSAvuJQUlS4ykBBuIwxVPwQjKnHH21Vap6RwckPBmVCFoWIf2PynY0J2j7PdQkV9wJtAAGI8RwPCZhuU9qP2mJ+JQiZ9wFUohKewONL4jQlFNBwQA */
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
  id: "Untitled",
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
            id: "saveFinal",

            onDone: {
              target: "Done",
              actions: assign({
                captchaSuccess: ({ event }: {event: any}) => !!event.data,
              }),
            },

            onError: "Error"
          }
        },

        Done: {
          on: {
            submit: {
              target: "#Untitled.FinalStep",
              reenter: true
            }
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
