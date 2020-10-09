import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as yup from "yup";

const StyledH1 = styled.h1`
  border-bottom: 3px dotted #e892c7;
  width: 34%;
  margin: 0 auto;
  margin-bottom: 15px;
`;
const StyledForm = styled.div`
  display: flex;
  border: 1px solid black;
  flex-direction: column;
  background: pink;
  width: 50%;
  margin: 0 auto;
  padding-top: 20px;
  justify-content: space-around;
`;

const StyledButton = styled.button`
font-size: 1.42rem;
border-radius: 10px;

`;

const Form = () => {
  // data state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  // button state
  const [buttonOn, setButtonOn] = useState(true);

  // errors state
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });

  // function to change state newUser
  const inputChange = (sarah) => {
    sarah.persist();
    lineSchema(sarah);
    setNewUser({
      ...newUser,
      [sarah.target.name]:
        sarah.target.type === "checkbox"
          ? sarah.target.checked
          : sarah.target.value,
    });
    console.log(newUser);
  };

  // post - setPost state - not normally used - just this time for the README
  const [post, setPost] = useState([]);

  //Here is the function for onSubmit
  const onSubmitForm = (event) => {
    event.preventDefault();
    axios
      .post("https://reqres.in/api/users", newUser)
      .then((response) => {
        console.log("succesful", response);
        setPost(response.data); // not usually done!!
      })
      .catch((error) => {
        console.log("this is an error", error);
        setErrors(error.data);
      });
  };

  // validation coding below:
  const formSchema = yup.object().shape({
    name: yup
      .string("please enter name.")
      .required("a valid name is required."),
    email: yup
      .string()
      .email("please enter e-mail")
      .required("valid e-mail address required."),
    password: yup
      .string("please enter a password")
      .required("must enter a password"),
    terms: yup
      .boolean()
      .oneOf([true], "must agree to terms before proceeding."),
  });

  const lineSchema = (e) => {
    yup
      .reach(formSchema, e.target.name)
      .validate(
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      )
      .then((response) => {
        console.log("succesful", response);
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch((response) => {
        console.log("error", response);
        setErrors({ ...errors, [e.target.name]: response.errors[0] });
      });
  };

  useEffect(() => {
    formSchema.isValid(newUser).then((succesful) => {
      console.log("working", succesful);
      setButtonOn(!succesful);
    });
  }, [newUser]);

  return (
    <div>
      <StyledH1>user onboarding form</StyledH1>
      <StyledForm>
        <form onSubmit={onSubmitForm}>
          <div>
            <label htmlFor="name">
              name: {""}
              <input
                id="name"
                name="name"
                placeholder="enter name here"
                type="text"
                value={newUser.name}
                onChange={inputChange}
              />
            </label>
          </div>
          <br></br>
          <div>
            <label htmlFor="email">
              e-mail: {""}
              {errors.email.length > 0 ? (
                <p className="error">{errors.email}</p>
              ) : null}
              <input
                id="email"
                name="email"
                placeholder="enter your e-mail here"
                type="email"
                value={newUser.email}
                onChange={inputChange}
              />
            </label>
          </div>
          <br></br>
          <div>
            <label htmlFor="password">
              password: {""}
              <input
                id="password"
                name="password"
                placeholder="enter your password here."
                type="password"
                value={newUser.password}
                onChange={inputChange}
              />
            </label>
          </div>
          <br></br>
          <div>
            <label htmlFor="terms" className="terms">
              terms: {""}
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={newUser.terms}
                onChange={inputChange}
              />
            </label>
          </div>{" "}
          <br></br>
          <div>
            <StyledButton type="submit" disabled={buttonOn}>
              submit:
            </StyledButton>
          </div>
          <pre>{JSON.stringify(post, null, 2)}</pre>
        </form>
      </StyledForm>
    </div>
  );
};

export default Form;