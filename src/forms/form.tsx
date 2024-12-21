import { useEffect, useState } from "react";
import { shallowEqual, useMachine, useSelector } from "@xstate/react";
import { goToStepParamsType, TestMachine } from "../machine/formMachine";
import { useNavigate, useParams } from "react-router-dom";
import { getSavedForm, saveUpdateForm } from "../util";
import { createBrowserInspector } from "@statelyai/inspect";

const { inspect } = createBrowserInspector();

const Form = () => {
  const { formId } = useParams();
  const savedFormLocal = getSavedForm(formId || "");
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState<number>(0);
  const [snapshot, send, machineRef] = useMachine(TestMachine.provide({
    actions: {
      goToStep: function ({ context }, params: goToStepParamsType) {
        // Add your action code here
        context.step = params.step;
      },
    }
  }
  ), {
    input: {
      navigate: navigate,
    },
    snapshot: savedFormLocal?.snapShot,
    inspect
  });

  

  useEffect(() => {
    const subscription = machineRef.subscribe((mysnapshot) => {
      // simple logging
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

  const childDataSnapshot = useSelector(machineRef, (state) => state.children.saveFinal?.getSnapshot(), shallowEqual);

  return (
    <div>form {snapshot.context.step}



      {snapshot.status !== "done" && !snapshot.error ? (
        <>
          <pre>
            {JSON.stringify({ canSubmit: snapshot.can({ type: "submit" })}, null, 2)}
          </pre>

          {snapshot.matches("Step5") && !snapshot.can({ type: "submit" }) && snapshot.children.saveFinal ? (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "200px", marginLeft: "auto", marginRight: "auto", marginTop: "100px", backgroundColor: "#161718", borderRadius: "10px", padding: "20px" }}>
              <div>
                <span style={{ marginRight: "15px" }}>{childDataSnapshot?.context?.question}</span>
                <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))} />
              </div>
              <div style={{ marginTop: "20px" }}>
                <sub>below event is not working</sub>
                <br />
                <button onClick={() => {
                  snapshot.children.saveFinal?.send({ type: "saveAnswer", userAnswer })
                  setUserAnswer(0)
                }}>
                  verify
                </button>
                {childDataSnapshot?.value === "Answer" && (childDataSnapshot?.context?.answer === childDataSnapshot?.context?.userAnswer ? <><span style={{ color: "green" }}>passed</span></> : <><span style={{ color: "red" }}>failed</span></>)}
              </div>
            </div>
          ) : <>

            <p>{snapshot.context?.data.step1data || "........"}</p>
            <p>{snapshot.context?.data.step2data || "........"}</p>
            <p>{snapshot.context?.data.step3data || "........"}</p>
            <p>{snapshot.context?.data.step4data || "........"}</p>

            
            {!snapshot.matches('Step5') && <>
              <button disabled={snapshot.matches('Step5')} onClick={() => send({ type: "next" })}>
              Go to Step {snapshot.context.step + 1}
            </button><button onClick={() => send({ type: "save", data: `Save a random number:${Math.random()}` })}>
              save data
            </button></>}
            <button onClick={() => send({ type: "back" })}>
              go back
            </button>

            <button disabled={!snapshot.can({ type: "submit" })} onClick={() => send({ type: "submit" })}>
              submit
            </button>
          </>}
        </>
      ) : !snapshot.error &&<h3>Done! <button onClick={() => navigate("/")}>go back</button></h3>}

      {snapshot.matches({ Step5: "Error" }) && (
        <>
          <h3>Something wend wrong</h3>
          <button onClick={() => send({ type: "retry" })}>Retry</button>
        </>
      )}

     { snapshot.error ? <button onClick={() => navigate("/")}>Error</button>  : ""}
      
    </div>
  );
};

export default Form;

