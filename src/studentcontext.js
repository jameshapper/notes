import React from "react"

export const StudentContext = React.createContext({
    aStudentId: "",
    setAStudentId: () => {},
    aStudentName: "",
    setAStudentName: () => {}
})

export default function StudentProvider({ children, value }) {

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  )
}