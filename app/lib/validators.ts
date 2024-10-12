import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = zod.object({
  email: zod.string().email().min(1),
});

export type FormData = zod.infer<typeof schema>;

export const resolverEmail = zodResolver(schema);
