import dynamic from "next/dynamic";

const App = dynamic(() => import("./App"));

export default App;