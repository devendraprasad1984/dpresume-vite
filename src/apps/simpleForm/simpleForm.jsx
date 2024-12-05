import React, {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import MyButton from "../../components/contextual/button.jsx";
import DOMEnum from "../../enums/DOMEnum.js";
import {Select, Input, FormControl, InputLabel, MenuItem} from "@mui/material";
import FieldSetWrapper from "../../components/contextual/fieldSetWrapper.jsx";

const SimpleForm = () => {
  const [formData, setFormData] = useState(null);
  const [formData2, setFormData2] = useState(null);
  const [formData3, setFormData3] = useState(null);

  const {
    register: register1,
    watch,
    handleSubmit: handleSubmit1,
    formState: {errors}
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
  } = useForm();
  const {
    control,
    handleSubmit: handleSubmit3,
  } = useForm({
    defaultValues: {
      [DOMEnum.firstName + "_5"]: "",
      [DOMEnum.selectAge]: ""
    },
  });

  const handleOnSubmit1 = (data) => {
    setFormData(data);
  };
  const handleOnSubmit2 = (data) => {
    setFormData2(data);
  };
  const handleOnSubmit3 = (data) => {
    setFormData3(data);
  };

  return <React.Fragment>
    <FieldSetWrapper title="Via HTML Form">
      <div className="col gap1">
        <form onSubmit={handleSubmit1(handleOnSubmit1)} className="col gap1">
          <input type="text" defaultValue="Devendra_1" {...register1(
            DOMEnum.firstName + "_1", {
              required: true,
              maxLength: 20
            })}/>
          <input type="text" defaultValue="Prasad" {...register1(
            DOMEnum.lastName + "_2", {
              required: true,
              pattern: /^[A-Za-z0-9]+$/i
            })}/>
          <input type="number" className="wid30" {...register1(DOMEnum.age, {
            min: 18,
            max: 99
          })} />
          <div className="row gap1">
            <MyButton type="submit" className="button-75">Submit form</MyButton>
            <MyButton onClick={handleSubmit1(handleOnSubmit1)}>Submit
              Vanilla</MyButton>
          </div>
        </form>
        <div>Data: {JSON.stringify(formData)}</div>
        <div>Watch firstname: {watch(DOMEnum.firstName + "_1")}</div>
      </div>
      <hr className="border-bottom"/>
    </FieldSetWrapper>

    <FieldSetWrapper title="Via Vanilla custom Form">
      <div className="col gap1">
        <input type="text" defaultValue="Devendra_3" {...register2(
          DOMEnum.firstName + "_3", {required: true})}/>
        <input type="text" defaultValue="Prasad_4" {...register2(
          DOMEnum.lastName + "_4", {required: true})}/>
        <MyButton onClick={handleSubmit2(handleOnSubmit2)}>Submit
          Vanilla</MyButton>
        <div>Data: {JSON.stringify(formData2)}</div>
      </div>
      <hr className="border-bottom"/>
    </FieldSetWrapper>

    <FieldSetWrapper title="Material UI form">
      <form onSubmit={handleSubmit3(handleOnSubmit3)} className="col gap1">
        <Controller
          name={DOMEnum.firstName + "_5"}
          control={control}
          render={({field}) => <Input {...field} placeholder="enter name"/>}
        />
        <Controller
          name={DOMEnum.selectAge}
          control={control}
          render={({field}) => (<FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Enter age</InputLabel>
            <Select
              {...field}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              placeholder="enter age"
            >
              <MenuItem value="">{""}</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>)}
        />
        <input type="submit" className="base-button button-18 pad10"
               value="Click to submit form"/>
        <div>Data: {JSON.stringify(formData3)}</div>
      </form>
    </FieldSetWrapper>
  </React.Fragment>;
};
export default SimpleForm;