import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import MyButton from "../../components/contextual/button.jsx";
import DOMEnum from "../../enums/DOMEnum.js";
import {Select, Input} from "@mui/material";

const SimpleForm = () => {
  const [formData, setFormData] = useState(null);
  const [formData2, setFormData2] = useState(null);
  const {
    register: register1,
    watch,
    handleSubmit: handleSubmit1,
    control,
    formState: {errors}
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
  } = useForm();


  const handleOnSubmit1 = (data) => {
    setFormData(data);
  };
  const handleOnSubmit2 = (data) => {
    setFormData2(data);
  };

  return <React.Fragment>
    <h1>Via HTML Form</h1>
    <div className="col gap1 wid50 mwid100">
      <form onSubmit={handleSubmit1(handleOnSubmit1)} className="col gap1">
        <input type="text" defaultValue="Devendra_1" {...register1(DOMEnum.firstName + "_1", {
          required: true,
          maxLength: 20
        })}/>
        <input type="text" defaultValue="Prasad" {...register1(DOMEnum.lastName + "_2", {
          required: true,
          pattern: /^[A-Za-z0-9]+$/i
        })}/>
        <input type="number" className="wid30" {...register1(DOMEnum.age, {
          min: 18,
          max: 99
        })} />
        <input type="submit" value="Submit form" className="base-button"/>
      </form>
      <MyButton onClick={handleSubmit1(handleOnSubmit1)}>Submit Vanilla</MyButton>
      <div>Data: {JSON.stringify(formData)}</div>
      <div>Watch firstname: {watch(DOMEnum.firstName + "_1")}</div>
    </div>
    <hr className="border-bottom"/>
    <h1>Via Vanilla custom Form</h1>
    <div className="col gap1 wid50 mwid100">
      <input type="text" defaultValue="Devendra_3" {...register2(DOMEnum.firstName + "_3", {required: true})}/>
      <input type="text" defaultValue="Prasad_4" {...register2(DOMEnum.lastName + "_4", {required: true})}/>
      <MyButton onClick={handleSubmit2(handleOnSubmit2)}>Submit Vanilla</MyButton>
      <div>Data: {JSON.stringify(formData2)}</div>
    </div>
    <hr className="border-bottom"/>
    <h1>Material UI form</h1>
    <form onSubmit={handleSubmit2(handleOnSubmit1)}>
      <Controller
        name="firstName"
        control={control}
        render={({field}) => <Input {...field} />}
      />
      <Controller
        name="select"
        control={control}
        render={({field}) => (
          <Select
            {...field}
            options={[
              {
                value: "chocolate",
                label: "Chocolate"
              },
              {
                value: "strawberry",
                label: "Strawberry"
              },
              {
                value: "vanilla",
                label: "Vanilla"
              },
            ]}
          />
        )}
      />
      <input type="submit"/>
    </form>
  </React.Fragment>;
};
export default SimpleForm;