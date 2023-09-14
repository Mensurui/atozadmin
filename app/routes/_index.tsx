import { requireUserId } from "~/utils/auth.server";
import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader : LoaderFunction =async ({request}) => {
 await requireUserId(request)
 return redirect('/home'); 
}


