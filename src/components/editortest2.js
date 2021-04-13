import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

export const Editor = (props) => {
  //const [state, setState] = useState({ value: null });
  //const handleChange = value => {
  //  setState({ value });
  //  console.log({value})
  //};

  const [ rt, setRt ] = useState("")
  const handleRtChange = value => { 
    setRt(value)
    console.log(value) 
    console.log(rt)
    props.setRt(value)
  }

  const modules = {
      toolbar: {
          container: [
            [{header: [1,2,3,false]}],
            ['bold', 'italic'],
            ['link'],
            [{ list: 'ordered' }, { list: 'bullet' }]
          ]
      }
  }

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "list",
    "bullet",
    "link",
  ];

  return (
    <div className="text-editor">
      <ReactQuill
        theme="snow"
        value={rt}
        onChange={handleRtChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default Editor;
