import { createContext } from "react";
import { Move } from "../data/MoveData";

const MoveModalContext = createContext<null | ((move: Move) => void)>(null);

export default MoveModalContext;
