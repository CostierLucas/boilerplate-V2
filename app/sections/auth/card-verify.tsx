import { Link } from "@remix-run/react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";

export default function CardVerify() {
  return (
    <>
      <div className="max-w-md">
        <Button variant="link" className="w-full mb-2 justify-start">
          <Link to="/login" className="flex items-center">
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </Button>
        <Card className="w-full p-5">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-center text-lg font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Logo
              </div>
            </CardTitle>
            <CardContent>
              Please check your inbox, we've sent you a magic link.
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Check your spam folder if you did not receive the email.
              </p>
            </CardFooter>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
