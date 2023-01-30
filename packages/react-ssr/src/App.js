import React, { useState, useEffect } from "react";
import axios from "axios";
import  "./App.css";

function App() {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [requestQuery, setRequestQuery] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");

  const routes = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "DELETE", label: "DELETE" }
  ];

  const postMockData = {
    "login": "Qwerty228",
    "password": "QWER123456",
    "age": 24,
    "isDeleted": false
  };

  const putMockData = {
    "id": 4,
    "login": "Qwerty7788",
  };

  const handleGetSubmit = (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:3000/users/" + requestQuery)
      .then((res) => {
        setResponse(JSON.stringify(res.data, null, 2));
      })
      .catch((err) => {
        setResponse(JSON.stringify(err.response.data, null, 2));
      });
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/users/", JSON.parse(requestBody))
      .then((res) => {
        setResponse(JSON.stringify(res.data, null, 2));
      })
      .catch((err) => {
        setResponse(JSON.stringify(err.response.data, null, 2));
      });
  };

  const handlePutSubmit = (e) => {
    e.preventDefault();

    axios
      .put("http://localhost:3000/users/" + requestQuery, JSON.parse(requestBody))
      .then((res) => {
        setResponse(JSON.stringify(res.data, null, 2));
      })
      .catch((err) => {
        setResponse(JSON.stringify(err.response.data, null, 2));
      });
  };

  const handleDeleteSubmit = (e) => {
    e.preventDefault();

    axios
      .delete("http://localhost:3000/users/" + requestQuery, JSON.parse(requestBody))
      .then((res) => {
        setResponse(JSON.stringify(res.data, null, 2));
      })
      .catch((err) => {
        setResponse(JSON.stringify(err.response.data, null, 2));
      });
  };

  const onSubmitHandler = (e) => {
    switch (selectedRoute) {
      case 'GET': handleGetSubmit(e);
      break;
      case 'POST': handlePostSubmit(e);
      break;
      case 'PUT': handlePutSubmit(e);
      break;
      case 'DELETE': handleDeleteSubmit(e);
      break;
      default: handleGetSubmit(e);
    }
  }

  useEffect(() => {
    if (['GET', 'PUT', 'DELETE'].includes(selectedRoute)) {
      setRequestQuery('4');
    }

    if (selectedRoute === 'POST') {
      setRequestBody(JSON.stringify(postMockData));
    }

    if (selectedRoute === 'PUT') {
      setRequestBody(JSON.stringify(putMockData));
    }
  }, [selectedRoute]);

  return (
    <div className="App">
      <h1 className="App-header">API Request Tester</h1>
      <form>
        <div>
          <label htmlFor="route-select">Method: </label>
          <select
            className="form-control"
            id="route-select"
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
          >
            <option value="" disabled>
              Select Method
            </option>
            {routes.map((route) => (
              <option key={route.value} value={route.value}>
                {route.label}
              </option>
            ))}
          </select>
        </div>
        <p>
          {"http://localhost:3000/users/"}
          {['GET', 'PUT', 'DELETE'].includes(selectedRoute) && <input value={requestQuery} onChange={(e) => setRequestQuery(e.target.value)}></input>}
        </p>
        {!['GET', 'DELETE'].includes(selectedRoute) && (
           <div className="request-body">
            <label htmlFor="request-body">Request Body:</label>
            <textarea
              className="form-control"
              id="request-body"
              rows="5"
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
            />
          </div>
        )}
        <button onClick={onSubmitHandler}>
          Send
        </button>
      </form>
      {response && (
        <div>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
