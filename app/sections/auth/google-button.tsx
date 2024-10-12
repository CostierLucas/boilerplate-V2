import { Form } from "@remix-run/react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";

export default function GoogleButton() {
  return (
    <Form action="/auth/google" method="post">
      <Button className="w-full" variant="outline" type="submit">
        <Icons.google className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </Form>
  );
}
