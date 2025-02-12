import React, { createContext, useContext, useState } from "react";

const LogContext = createContext();

export function LogProvider({ children }) {
  const [log, setLog] = useState([]);

  return (
    <LogContext.Provider value={{ log, setLog }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLog() {
  return useContext(LogContext);
}
