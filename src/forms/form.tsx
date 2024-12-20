import { useEffect, useState } from "react";
import { useActor, useMachine } from "@xstate/react";
import { goToStepParamsType, TestMachine } from "../machine/formMachine";
import { useNavigate, useParams } from "react-router-dom";
import { getSavedForm, saveUpdateForm } from "../util";
import { createMachine } from "xstate";
import { CaptchaMachine } from "../machine/captchaMachine";

const Form = () => {
  const { formId } = useParams();
  const savedFormLocal = getSavedForm(formId || "");
  const navigate = useNavigate();
  
  const [snapshot, send, machineRef] = useMachine(TestMachine.provide(
    {
      actors: {
        "saveFinal": createMachine(CaptchaMachine.config)
      },
      actions: {
        "goToStep": function ({ context }, params: goToStepParamsType) {
          navigate(`/create/${formId}/${params.step}`);
          context.step = params.step;
        }
      }
    }
  ), {
    input: {
      navigate: navigate,
    },
    snapshot: savedFormLocal?.snapShot,
  });

  useEffect(() => {
    const subscription = machineRef.subscribe((mysnapshot) => {
      // simple logging
      console.debug("mysnapshot", mysnapshot);
      saveUpdateForm(formId!, mysnapshot, Number(mysnapshot.context.step));
      // navigate(`/widget/form/create/${formId}/${mysnapshot.context.step}`);
    });
  
    return subscription.unsubscribe;
  }, [machineRef, formId]);
  
  useEffect(() => {
    saveUpdateForm(formId!, snapshot, Number(snapshot.context.step));
  }, []);

  useEffect(() => {
    if (!isNaN(Number(formId)) && Number(formId) === 0) {
      navigate("/");
    }
  }, [formId, navigate]);

  useEffect(() => {
    if (snapshot.context.step === 5 && !snapshot.context.captchaSuccess) {
      navigate(`/create/${formId}/captcha/verify`);
    }
  }, [snapshot.context.step, snapshot.context.captchaSuccess, navigate, formId]);
  
  return (
    <div>form {snapshot.context.step}

      <p>{snapshot.context?.data.step1data || "........"}</p>
      <p>{snapshot.context?.data.step2data || "........"}</p>
      <p>{snapshot.context?.data.step3data || "........"}</p>
      <p>{snapshot.context?.data.step4data || "........"}</p>
      <p>{snapshot.context?.data.step5data || "........"}</p>

      { snapshot.status !== "done" ? (
        <>
          <button disabled={snapshot.matches('Step5')} onClick={() => send({ type: "next" })}>
            Go to Step {snapshot.context.step + 1}
          </button>
          <button onClick={() => send({ type: "save" })}>
            save data
          </button>
          <button onClick={() => send({ type: "back" })}>
            go back
          </button>

          <button disabled={!snapshot.matches('Step5')} onClick={() => send({ type: "submit" })}>
            submit
          </button>
        </>
      ) : <h3>Done!</h3>}
    </div>
  );
};

export default Form;

export const CaptchaForm = () => {
  const [state, send] = useActor(CaptchaMachine);
  console.debug("🚀 -----------------------------------------------------🚀")
  console.debug("🚀 ~ file: form.tsx:95 ~ CaptchaForm ~ state:", state)
  console.debug("🚀 -----------------------------------------------------🚀")
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState<number>(0);

  useEffect(() => {
    if (state.context.isPassed) {
      navigate(-1);
    }
  }, [state.context.isPassed, navigate]);
  
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "200px", marginLeft: "auto", marginRight: "auto", marginTop: "100px", backgroundColor: "#161718", borderRadius: "10px", padding: "20px" }}>
      <div>
        <span style={{marginRight: "15px"}}>{state.context.question}</span>
        <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(isNaN(Number(e.target.value)) ? 0:  Number(e.target.value))} />
      </div>
      <div style={{marginTop: "20px"}}>
        <button onClick={() => send({ type: "save", userAnswer })}>
          verify
        </button>
        <button onClick={() => navigate(-1)}>
          back
        </button>
      </div>
    </div>
  );
};
