import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import Home from "./pages/Home";
import{QueryClient,QueryClientProvider} from "@tanstack/react-query"
import "./App.css";

function App() {
  const client = new QueryClient()
  return (
    <div className="App">
      <QueryClientProvider client={client}>
      <Router>
        <Routes>
        <Route path="/" element={<Home />}/>
        </Routes>
      </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;
