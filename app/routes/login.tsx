import React, { useEffect, useRef, useState } from "react";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validateEmail, validatePassword } from "~/utils/validators.server";
import { login, register, getUser } from "~/utils/auth.server";
import { useActionData } from "@remix-run/react";

export const loader : LoaderFunction = async ({request}) => {
  return await getUser(request) ? redirect('/') : null;
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: "Invalid type", form: action }, { status: 400 });
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: "Invalid type", form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),   
  }

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields:{ email, password, firstName, lastName}, form:action}, {status:400});
  }

  switch(action) {
    case 'login': {
      return await login({email, password});
    }
    case 'register': {
      return await register({email, password, firstName: firstName as string, lastName: lastName as string});
    }
  }
};

export default function Login() {
  const actionData = useActionData();
  const [formError, setFormError] = useState(actionData?.error || ' ')
  const [errors, setErrors] = useState(actionData?.errors || {})
  const [action] = useState("login");
  const firstLoad = useRef(true)
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.firstName || "",
    lastName: actionData?.fields?.lastName || "",
  });

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };

  useEffect(() => {
    if (actionData) {
      setFormError(actionData.error || "");
      setErrors(actionData.errors || {});
      setFormData({
        email: actionData.fields?.email || "",
        password: actionData.fields?.password || "",
        firstName: actionData.fields?.firstName || "",
        lastName: actionData.fields?.lastName || "",
      });
    }
  }, [actionData]);
  
  useEffect(() => {
    const newState = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };
    setErrors(newState);
    setFormError("");
  }, [action]);
  
  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);
  
  useEffect(() => {
    firstLoad.current = false;
  }, []);
  
  return (
      <>
    <Layout>
 <div className="h-full flex justify-center items-center flex-col gap-y-4 ">
  <h1 className="text-5xl font-extrabold text-yellow-950">Welcome Admin</h1>
  <form method="post" className="rounded-2xl bg-gray-200 p-6 w-96 shadow-lg">
    <div className="text-red-600 text-center py-2">
      {formError}
    </div>
    <FormField
      htmlFor="email"
      label="Email"
      value={formData.email}
      onChange={(e) => handleInput(e, "email")}
      error={errors?.email}
    />
    <FormField
      htmlFor="password"
      label="Password"
      type="password"
      value={formData.password}
      onChange={(e) => handleInput(e, "password")}
      error={errors?.password}
    />
    <div className="w-full text-center">
      <button
        type="submit"
        name="_action"
        className="rounded-xl mt-3 bg-yellow-300 px-7 py-2 text-blue-300 font-semibold transition duration-300 ease-in-out hover:bg-yellow-950 hover:-translate-y-1"
        value={action}
      >
        Sign In
      </button>
    </div>
  </form>
</div>
</Layout>
</>
  );
}
