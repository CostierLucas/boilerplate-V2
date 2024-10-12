import { useRemixForm } from "remix-hook-form";
import { Input } from "~/components/ui/input";
import { Form, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { resolverEmail, FormData } from "~/lib/validators";
import GoogleButton from "./google-button";
import { LoaderCircle } from "lucide-react";

export default function UserAuthForm({
  defaultEmail,
}: {
  defaultEmail?: string;
}) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver: resolverEmail,
    stringifyAllValues: false,
  });

  return (
    <>
      <Form onSubmit={handleSubmit} method="post">
        <label>
          Email:
          <Input
            className="mt-1"
            type="email"
            {...register("email")}
            defaultValue={defaultEmail ?? ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </label>
        <Button type="submit" className="ml-auto w-full mt-4">
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Continue With Email"
          )}
        </Button>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleButton />
    </>
  );
}
