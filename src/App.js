import { useReducer } from "react";
import "./styles/App.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  CHOOSE_OPEARATION: "choose-opearation",
  EQUATION: "equation",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (!(state.operation === "roots")) {
        if (payload.digit === "0" && state.currentOperand === "0") {
          return state;
        }
        if (payload.digit === "." && !state.currentOperand) {
          return state;
        }
        if (payload.digit === "." && state.currentOperand.includes(".")) {
          return state;
        }

        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        };
      } else {
        console.log("alina look:", state.clickCount);
        if (state.clickCount === 0) {
          return {
            ...state,
            clickCount: state.clickCount + 1,
            currentOperand: `A = ${payload.digit}`,
          };
        } else if (state.clickCount === 1) {
          return {
            ...state,
            clickCount: state.clickCount + 1,
            previousOperand: state.currentOperand,
            currentOperand: `B = ${payload.digit}`,
          };
        } else if (state.clickCount === 2) {
          return {
            ...state,
            previousOperand: `${state.previousOperand}${state.currentOperand}`,
            currentOperand: `C = ${payload.digit}`,
          };
        } else {
          return {
            clickCount: 0,
            operation: null,
            previousOperand: null,
            currentOperand: null,
          };
        }
      }

    case ACTIONS.CLEAR:
      return {
        currentOperand: "",
        previousOperand: "",
        operation: "",
        clickCount: 0,
      };
    case ACTIONS.CHOOSE_OPEARATION:
      if (!state.currentOperand && !state.previousOperand) {
        return state;
      } else if (!state.previousOperand) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      } else if (!state.currentOperand) {
        return {
          ...state,
          operation: payload.operation,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state), // it has to be the pervios operation and not cur
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.EVALUATE:
      if (!(state.operation === "roots")) {
        return {
          ...state,
          operation: null,
          previousOperand: evaluate(state),
          currentOperand: null,
        };
      } else {
        if (state.clickCount === 2) {
          return {
            clickCount: 0,
            operation: null,
            previousOperand: rootsEval(state),
            currentOperand: null,
          };
        } else {
          return state;
        }
      }

    case ACTIONS.DELETE_DIGIT: // complete functunalllty
      if (!state.currentOperand) {
        return state;
      } else {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };
      }

    case ACTIONS.EQUATION:
      if (payload.operation === "roots") {
        console.log("alina ", state.previousOperand);
        return {
          ...state,
          operation: payload.operation,
          previousOperand: "",
          currentOperand: "ENTER: A B C VALUES",
        };
      }
  }
}

function rootsEval({ currentOperand, previousOperand, operation, clickCount }) {
  const allval = `${previousOperand}${currentOperand}`;
  // Use a regular expression to match all numeric values
  const matches = allval.match(/\d+/g);

  // Convert the matched strings to numbers
  const numbers = matches ? matches.map(Number) : [];
  const a = numbers[0];
  const b = numbers[1];
  const c = numbers[2];
  console.log(previousOperand);
  console.log(a, b, c);
  const root = b * b - 4 * a * c;
  if (root < 0) {
    return "math-err";
  }
  if (root === 0) {
    const computation = ((b * -1) / 2) * a;
    return computation.toString();
  } else {
    const inRoot = Math.sqrt(root);
    const first = (((b * -1 + inRoot) / 2) * a).toString();
    const second = (((b * -1 - inRoot) / 2) * a).toString();
    return `${first} and ${second}`;
  }
}
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  let computation = previousOperand;
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
  }
  return computation.toString();
}

function App() {
  const initialState = {
    currentOperand: "",
    previousOperand: "",
    operation: "",
    clickCount: 0,
  };
  const [{ currentOperand, previousOperand, operation, clickCount }, dispatch] =
    useReducer(reducer, initialState);

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DE
      </button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: "=" })}
      >
        =
      </button>
      <button
        onClick={() =>
          dispatch({
            type: ACTIONS.EQUATION,
            payload: {
              operation: "roots",
            },
          })
        }
      >
        ROOTS
      </button>
    </div>
  );
}

export default App;
