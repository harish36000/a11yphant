import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { LocalErrorScopeApolloContext } from "app/components/common/error/ErrorScope";
import { CurrentUserDocument, useRegisterMutation } from "app/generated/graphql";
import clsx from "clsx";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import TextInput from "../common/inputs/TextInput";
import LoadingIndicator from "../icons/LoadingIndicator";

const schema = yup
  .object({
    name: yup.string().required("Please tell us your name"),
    email: yup.string().email("This email address is not valid").required("The email address is required"),
    password: yup.string().min(8, "The password must be at least 8 characters long").required("The password is required"),
  })
  .required();

interface SignUpFormProps {
  onSuccess?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [register, { loading }] = useRegisterMutation({
    context: LocalErrorScopeApolloContext,
    refetchQueries: [{ query: CurrentUserDocument }],
    onError: (error) => {
      if (error.graphQLErrors?.[0].extensions.code === "INPUT_ERROR") {
        setError("email", { message: "This email is already taken" });
      }
    },
  });

  const submitLogin = async ({ name, email, password }): Promise<void> => {
    await register({ variables: { name, email, password } });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(submitLogin)} aria-label="Sign up form">
      <div className="mb-4">
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Name" error={!!errors?.name} helperText={errors?.name?.message} {...field} />
          )}
        />
      </div>
      <div className="mb-4">
        <Controller
          name="email"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Email" type="email" error={!!errors?.email} helperText={errors?.email?.message} {...field} />
          )}
        />
      </div>
      <div className="mb-2">
        <Controller
          name="password"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <TextInput inputRef={ref} label="Password" type="password" error={!!errors?.password} helperText={errors?.password?.message} {...field} />
          )}
        />
      </div>

      <button
        className={clsx(
          "px-8 py-4 mb-2 block w-full text-center align-middle text-primary bg-white font-normal leading-none rounded border border-white",
          "transition duration-300 group",
          "hover:bg-primary hover:text-white",
          loading && "cursor-wait",
        )}
        type="submit"
        disabled={loading}
      >
        {!loading && "Sign up"}
        {loading && (
          <>
            <LoadingIndicator className="inline" />
            <span className="sr-only">Sign up in progress</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
