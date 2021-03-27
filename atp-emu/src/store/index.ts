import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./rootReducer";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";
import { logsMiddleware } from "./logs/logs.middleware";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logsMiddleware));
sagaMiddleware.run(rootSaga);